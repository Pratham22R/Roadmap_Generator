import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { weeklyTemplate } from "../../email/templates/weekly";
import { getPrisma } from "@/lib/prisma";

// 1. The Event Handler (Sends the email)
export const weeklySummaryEmail = inngest.createFunction(
    { id: "weekly-summary-email" },
    { event: "progress/weekly.summary" },
    async ({ event, step }) => {
        const { userId, email, periodStart, periodEnd } = event.data;
        const prisma = getPrisma();

        // Fetch stats for the period
        const stats = await step.run("fetch-stats", async () => {
            // Mock stats for now or real query
            // Real query: Count 'COMPLETED' ProgressLogs or SkillProgress between dates
            // For demo:
            return { completedTasks: 5, nextGoal: "Master Next.js" };
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
                const html = weeklyTemplate("", stats.completedTasks, stats.nextGoal);
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
