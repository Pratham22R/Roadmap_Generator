import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { roadmapTemplate } from "../../email/templates/roadmap";
import { getPrisma } from "@/lib/prisma";
import { getRenderedEmail } from "../../email/email-renderer";

export const roadmapEmail = inngest.createFunction(
    { id: "roadmap-email" },
    { event: "roadmap/generated" },
    async ({ event, step }) => {
        const { userId, email, roadmapTitle, roadmapId } = event.data;
        const prisma = getPrisma();

        const logId = await step.run("create-log", async () => {
            const log = await prisma.emailLog.create({
                data: {
                    userId,
                    emailType: "ROADMAP_GENERATED",
                    status: "QUEUED",
                },
            });
            return log.id;
        });

        await step.run("send-email", async () => {
            try {
                // const html = roadmapTemplate("", roadmapTitle, roadmapId);
                const html = await getRenderedEmail("roadmap-generated", {
                    roadmapTitle: roadmapTitle || "Your Roadmap",
                    roadmapId: roadmapId,
                    roadmapUrl: `https://roadmap.sh/roadmap/${roadmapId}`
                }, () => roadmapTemplate("", roadmapTitle, roadmapId));
                await transporter.sendMail(
                    formatEmail({
                        to: email,
                        subject: "Your Roadmap is Ready! 🗺️",
                        html,
                    })
                );
            } catch (error: any) {
                // Log failure
                await prisma.emailLog.update({
                    where: { id: logId },
                    data: { status: "FAILED", errorMessage: error.message },
                });
                throw error; // Retries handled by Inngest
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
