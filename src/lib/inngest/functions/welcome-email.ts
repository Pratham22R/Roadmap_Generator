import { inngest } from "../client";
import { transporter, formatEmail } from "../../email/transporter";
import { welcomeTemplate } from "../../email/templates/welcome";
import { getPrisma } from "@/lib/prisma";

export const welcomeEmail = inngest.createFunction(
    { id: "welcome-email" },
    { event: "user/signed.up" },
    async ({ event, step }) => {
        console.log("[Inngest] Welcome email function triggered for:", event.data.email);
        const { userId, email, name } = event.data;
        const prisma = getPrisma();

        // 1. Log Start
        await step.run("log-start", async () => {
            await prisma.emailLog.create({
                data: {
                    userId,
                    emailType: "WELCOME",
                    status: "QUEUED",
                },
            });
        });

        // 2. Send Email
        const result = await step.run("send-email", async () => {
            try {
                const html = welcomeTemplate(name || "");
                const info = await transporter.sendMail(
                    formatEmail({
                        to: email,
                        subject: "Welcome to Roadmap Generator! 🚀",
                        html,
                    })
                );
                return { success: true, messageId: info.messageId };
            } catch (error: any) {
                console.error("[Inngest] Failed to send welcome email:", error);
                throw new Error(error.message);
            }
        });

        // 3. Log Success
        await step.run("log-success", async () => {
            // Find the log we created (or create new if you want to be safe, but we should update)
            // Since we don't pass the ID from step 1 easily without returning it, let's just create a record or find the latest queued one.
            // Better appraoch: Update the status.
            // But for simplicity/speed in this context, let's just log the 'SENT' status as an update or new entry? 
            // Plan asked for one log entry updated.
            // To do that, we need the log ID from step 1.

            // Let's refactor step 1 to return ID if possible, but step data is serializable.
            // Actually, we can just findFirst queued for this user/type.
            const log = await prisma.emailLog.findFirst({
                where: { userId, emailType: "WELCOME", status: "QUEUED" },
                orderBy: { triggeredAt: "desc" },
            });

            if (log) {
                await prisma.emailLog.update({
                    where: { id: log.id },
                    data: { status: "SENT", sentAt: new Date() },
                });
            }
        });

        return { event, body: result };
    }
);
