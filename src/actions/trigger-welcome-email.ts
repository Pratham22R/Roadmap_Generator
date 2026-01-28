"use server";

import { inngest } from "@/lib/inngest/client";
import { auth } from "@/auth";

export async function triggerWelcomeEmail(user?: { name?: string | null; email?: string | null; id?: string }) {
    console.log("[Trigger] Attempting to trigger welcome email...");

    let targetUser = user;

    if (!targetUser) {
        const session = await auth();
        targetUser = session?.user;
    }

    if (!targetUser?.email || !targetUser.id) {
        console.log("[Trigger] No session or user email/id found.");
        return;
    }

    console.log("[Trigger] Sending 'user/signed.up' event for user:", targetUser.email);
    try {
        const result = await inngest.send({
            name: "user/signed.up",
            data: {
                userId: targetUser.id,
                email: targetUser.email,
                name: targetUser.name ?? "User",
            },
        });
        console.log("[Trigger] Successfully sent event. IDs:", result.ids);
    } catch (error) {
        console.error("[Trigger] Failed to send event:", error);
    }
}
