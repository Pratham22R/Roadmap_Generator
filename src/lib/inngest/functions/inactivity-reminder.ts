import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { inactivityTemplate } from "../../email/templates/inactivity";
import { getPrisma } from "@/lib/prisma";
import { getRenderedEmail } from "../../email/email-renderer";

// 1. Handler
export const inactivityEmail = inngest.createFunction(
    { id: "inactivity-email" },
    { event: "user/inactive" },
    async ({ event, step }) => {
        const { userId, email } = event.data;
        const prisma = getPrisma();

        const logId = await step.run("create-log", async () => {
            const log = await prisma.emailLog.create({
                data: {
                    userId,
                    emailType: "INACTIVITY_REMINDER",
                    status: "QUEUED",
                },
            });
            return log.id;
        });

        await step.run("send-email", async () => {
            try {
                // const html = inactivityTemplate("");
                const html = await getRenderedEmail("inactivity-reminder", {
                    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
                }, () => inactivityTemplate(""));
                await transporter.sendMail(
                    formatEmail({
                        to: email,
                        subject: "We Miss You! 👋",
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

// 2. Scheduler
export const inactivityCron = inngest.createFunction(
    { id: "inactivity-cron" },
    { cron: "0 10 * * *" }, // Daily at 10am
    async ({ step }) => {
        const prisma = getPrisma();

        // Find users inactive for 7 days
        // Assuming 'updatedAt' on User or latest Session is proxy for activity
        // For simplicity, using User.updatedAt
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);

        const inactiveUsers = await step.run("fetch-inactive", async () => {
            return await prisma.user.findMany({
                where: {
                    updatedAt: {
                        lt: sevenDaysAgo,
                        gt: eightDaysAgo // Only trigger once, for the 7th day
                    },
                    email: { not: undefined }
                },
                select: { id: true, email: true, updatedAt: true }
            });
        });

        if (!inactiveUsers.length) return;

        const events = inactiveUsers.map((user: any) => ({
            name: "user/inactive",
            data: {
                userId: user.id,
                email: user.email,
                lastActiveAt: user.updatedAt.toISOString()
            }
        }));

        await step.sendEvent("send-inactive-events", events);

        return { triggered: inactiveUsers.length };
    }
);
