import { NextRequest } from "next/server";
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { welcomeEmail } from "@/lib/inngest/functions/welcome-email";
import { roadmapEmail } from "@/lib/inngest/functions/roadmap-email";
import { milestoneEmail } from "@/lib/inngest/functions/milestone-email";
import { weeklySummaryEmail, weeklySummaryCron } from "@/lib/inngest/functions/weekly-summary";
import { inactivityEmail, inactivityCron } from "@/lib/inngest/functions/inactivity-reminder";

const serveHandler = serve({
    client: inngest,
    functions: [
        welcomeEmail,
        roadmapEmail,
        milestoneEmail,
        weeklySummaryEmail,
        weeklySummaryCron,
        inactivityEmail,
        inactivityCron,
    ],
});

export const GET = serveHandler.GET;
export const POST = serveHandler.POST;
export const PUT = async (req: NextRequest, context: any) => {
    console.log("[Inngest Route] PUT request received");
    try {
        const clone = req.clone();
        const text = await clone.text();
        console.log("[Inngest Route] Request body length:", text.length);
    } catch (e) {
        console.error("[Inngest Route] Failed to clone/read body:", e);
    }
    return serveHandler.PUT(req, context);
};
