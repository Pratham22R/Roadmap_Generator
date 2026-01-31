import { getPrisma } from "@/lib/prisma";
import { emailLayout } from "./templates/layout";

/**
 * Fetches a template from the DB (if exists), interpolates data, and returns HTML.
 * If no DB template found, calls the fallback function.
 * 
 * @param templateName The unique ID/name of the template in the DB (e.g., 'welcome', 'weekly-summary')
 * @param data Key-value pairs to replace {{key}} in the template
 * @param defaultRenderer A function that returns the default HTML if no DB template exists
 */
export async function getRenderedEmail(
    templateName: string,
    data: Record<string, any>,
    defaultRenderer: () => string | Promise<string>
): Promise<string> {
    const prisma = getPrisma();

    try {
        const dbTemplate = await prisma.emailTemplate.findUnique({
            where: { name: templateName }
        });

        if (dbTemplate && dbTemplate.content) {
            let content = dbTemplate.content;

            // Interpolate variables
            Object.keys(data).forEach(key => {
                const val = data[key];
                // Simple global replacement for {{key}}
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, String(val ?? ""));
            });

            // Wrap in the standard layout (assuming DB content is inner HTML, 
            // OR if DB content is full HTML. Usually better to wrap if it's just the body.
            // But if the Admin editor provides the full HTML, we might not need layout.
            // Checks if it has <html> tag?
            // For now, let's assume the Admin Editor is for the BODY content predominantly,
            // copying the logic from email-preview.tsx which wraps it in emailLayout.

            // However, the `emailLayout` takes `content`.

            return emailLayout({
                previewText: (data.previewText as string) || "Update from Roadmap Generator",
                heading: dbTemplate.subject || (data.heading as string) || "Notification",
                content: content,
                actionText: (data.actionText as string),
                actionUrl: (data.actionUrl as string),
                accentColor: "#d0d0d0ff"
            });
        }
    } catch (error) {
        console.error(`Failed to fetch/render custom template '${templateName}', using default.`, error);
    }

    return await defaultRenderer();
}
