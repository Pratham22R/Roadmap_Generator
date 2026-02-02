
import { emailLayout } from "./layout";
import { getPrisma } from "@/lib/prisma";

export const ROADMAP_TEMPLATE_DEFAULT = `
    <p>Hi {{name}},</p>
    <p>Great news! Your roadmap <strong>"{{roadmapTitle}}"</strong> has been successfully generated.</p>
    <p>Dive in and start your learning journey now. We've laid out every step for you.</p>
`;

export const roadmapTemplate = async (name: string, roadmapTitle: string, roadmapId: string) => {
  const templateName = "roadmap";
  let content = ROADMAP_TEMPLATE_DEFAULT;

  try {
    const prisma = getPrisma();
    const dbTemplate = await prisma.emailTemplate.findUnique({
      where: { name: templateName }
    });
    if (dbTemplate?.content) {
      content = dbTemplate.content;
    }
  } catch (error) {
    console.error(`Failed to fetch template ${templateName}, using default.`, error);
  }

  // Replace placeholders
  const filledContent = content
    .replace(/{{name}}/g, name || 'there')
    .replace(/{{roadmapTitle}}/g, roadmapTitle || 'Your Roadmap');

  return emailLayout({
    previewText: `Your roadmap "${roadmapTitle}" is ready!`,
    heading: "Your Roadmap is Ready! 🗺️",
    content: filledContent,
    actionText: "View Roadmap",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/roadmap/${roadmapId}`,
    accentColor: "#6366f1", // Indigo
  });
};
