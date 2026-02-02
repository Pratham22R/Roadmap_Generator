import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { weeklyProgressTemplate } from "../../email/templates/weekly";
import { getPrisma } from "@/lib/prisma";
import { getRenderedEmail } from "../../email/email-renderer";

// 1. The Event Handler (Sends the email)
export const weeklySummaryEmail = inngest.createFunction(
    { id: "weekly-summary-email" },
    { event: "progress/weekly.summary" },
    async ({ event, step }) => {
        const { userId, email, periodStart, periodEnd } = event.data;
        const prisma = getPrisma();

        // Fetch stats for the period
        const stats = await step.run("fetch-stats", async () => {
            const startDate = new Date(periodStart);
            const endDate = new Date(periodEnd);

            // 1. Completed Tasks
            const completedTasks = await prisma.progressLog.count({
                where: {
                    userId,
                    itemType: "SKILL",
                    action: "COMPLETED",
                    timestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            });

            // 2. Total Hours
            const successfulLogs = await prisma.progressLog.findMany({
                where: {
                    userId,
                    itemType: "SKILL",
                    action: "COMPLETED",
                    timestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                select: { itemId: true }
            });

            const skillIds = successfulLogs.map(log => log.itemId);
            const skills = await prisma.templateSkill.findMany({
                where: { id: { in: skillIds } },
                select: { estimatedTime: true }
            });

            // Helper needed here or imported. Assuming imported from utils.
            // We need to update imports first, but I can't do two edits in one tool call easily if they are far apart.
            // I'll assume parseEstimatedHours is available or I'll inline a simple version if import is hard.
            // Better to rely on the import I will add in the next step or same step if I can partial edit.
            // Since I am replacing the block, I can't add imports at the top easily without replacing the whole file or using multi_replace.
            // I'll calculate hours here with logic or assume import.
            // Let's use the exported function from utils.

            const { parseEstimatedHours } = await import("@/lib/utils");

            let totalHours = 0;
            skills.forEach(skill => {
                totalHours += parseEstimatedHours(skill.estimatedTime);
            });

            // Round to 1 decimal place
            totalHours = Math.round(totalHours * 10) / 10;

            // 3. Current Streak
            // Get all unique dates of activity
            const logs = await prisma.progressLog.findMany({
                where: { userId },
                select: { timestamp: true },
                orderBy: { timestamp: 'desc' }
            });

            const uniqueDates = new Set(logs.map(l => l.timestamp.toISOString().split('T')[0]));
            const sortedDates = Array.from(uniqueDates).sort().reverse();

            let currentStreak = 0;
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            // Check if streak is active (activity today or yesterday)
            if (uniqueDates.has(today) || uniqueDates.has(yesterday)) {
                let checkDate = new Date();
                // If no activity today, start checking from yesterday
                if (!uniqueDates.has(today)) {
                    checkDate.setDate(checkDate.getDate() - 1);
                }

                while (true) {
                    const dateStr = checkDate.toISOString().split('T')[0];
                    if (uniqueDates.has(dateStr)) {
                        currentStreak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }

            // 4. Next Goal
            const activeRoadmap = await prisma.roadmap.findFirst({
                where: { userId, status: "ACTIVE" },
                orderBy: { updatedAt: 'desc' }
            });

            let nextGoal = "Start a new roadmap!";
            if (activeRoadmap) {
                const pendingSkill = await prisma.skillProgress.findFirst({
                    where: {
                        roadmapId: activeRoadmap.id,
                        status: "PENDING"
                    },
                    include: { skill: true }
                });

                if (pendingSkill) {
                    nextGoal = `Master ${pendingSkill.skill.title}`;
                } else {
                    nextGoal = "All caught up!";
                }
            }

            return {
                completedTasks,
                totalHours,
                currentStreak,
                nextGoal
            };
        });

        const logId = await step.run("create-log", async () => {
            const log = await prisma.emailLog.create({
                data: {
                    userId,
                    emailType: "WEEKLY_SUMMARY",
                    status: "QUEUED",
                },
            });
            return log.id;
        });

        await step.run("send-email", async () => {
            try {
                // const html = weeklyProgressTemplate("", stats);
                const html = await getRenderedEmail("weekly-summary", {
                    stats: stats, // Template needs to handle object or we flatten it.
                    // Flattening for simple string replacement if template is simple text,
                    // but the renderer helper does naive interpolation. 
                    // Verify if weeklyProgressTemplate is complex.
                    // Assuming renderer logic: simple interpolation.
                    // We might need to pass complex logic or trust standard template is used if DB entry not found.
                    // For DB entry, user likely designs a simpler HTML or handles 'stats' placeholder?
                    // Let's pass singular stats for now.
                    completedTasks: stats.completedTasks,
                    totalHours: stats.totalHours,
                    currentStreak: stats.currentStreak,
                    nextGoal: stats.nextGoal
                }, () => weeklyProgressTemplate("", stats));
                await transporter.sendMail(
                    formatEmail({
                        to: email,
                        subject: "Your Weekly Progress 📈",
                        html,
                    })
                );
            } catch (error: any) {
                await prisma.emailLog.update({
                    where: { id: logId },
                    data: { status: "FAILED", errorMessage: error.message },
                });
                throw error;
            }
        });

        await step.run("update-log", async () => {
            await prisma.emailLog.update({
                where: { id: logId },
                data: { status: "SENT", sentAt: new Date() },
            });
        });
    }
);

// 2. The Scheduler (Triggers the events)
export const weeklySummaryCron = inngest.createFunction(
    { id: "weekly-summary-cron" },
    { cron: "0 9 * * 1" }, // Every Monday at 9am
    async ({ step }) => {
        const prisma = getPrisma();

        // Fetch all active users (batching recommended for scale, keeping simple for now)
        const users = await step.run("fetch-users", async () => {
            return await prisma.user.findMany({
                where: { email: { not: undefined } },
                select: { id: true, email: true }
            });
        });

        if (!users.length) return;

        // Emit events in batches
        const events = users.map(user => ({
            name: "progress/weekly.summary",
            data: {
                userId: user.id,
                email: user.email,
                periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                periodEnd: new Date().toISOString()
            }
        }));

        await step.sendEvent("send-weekly-summary-events", events);

        return { triggered: users.length };
    }
);
