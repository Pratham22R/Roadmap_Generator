import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { milestoneTemplate } from "../../email/templates/milestone";
import { getPrisma } from "@/lib/prisma";
import { getRenderedEmail } from "../../email/email-renderer";

export const milestoneEmail = inngest.createFunction(
    { id: "milestone-email" },
    { event: "progress/milestone.reached" },
    async ({ event, step }) => {
        const { userId, email, milestoneType, roadmapId } = event.data;
        const prisma = getPrisma();

        // We need roadmap title, fetch it
        const roadmap = await step.run("fetch-roadmap", async () => {
            return await prisma.roadmap.findUnique({
                where: { id: roadmapId },
                select: { title: true },
            });
        });

        if (!roadmap) return; // Should not happen

        const logId = await step.run("create-log", async () => {
            const log = await prisma.emailLog.create({
                data: {
                    userId,
                    emailType: `MILESTONE_${milestoneType}`,
                    status: "QUEUED",
                },
            });
            return log.id;
        });

        await step.run("send-email", async () => {
            try {
                // const html = milestoneTemplate("", milestoneType, roadmap.title, roadmapId);
                const html = await getRenderedEmail("milestone-reached", {
                    milestoneType: milestoneType,
                    roadmapTitle: roadmap.title,
                    roadmapId: roadmapId,
                    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
                }, () => milestoneTemplate("", milestoneType, roadmap.title, roadmapId));
                await transporter.sendMail(
                    formatEmail({
                        to: email,
                        subject: `🎉 ${milestoneType} Milestone Reached!`,
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
