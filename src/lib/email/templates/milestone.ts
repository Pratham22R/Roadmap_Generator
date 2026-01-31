
import { emailLayout } from "./layout";
import { getPrisma } from "@/lib/prisma";

export const MILESTONE_TEMPLATE_DEFAULT = `
    <p>Hi {{name}},</p>
    <p>Congratulations! You've completed <strong>{{milestone}}</strong> of your roadmap <strong>"{{roadmapTitle}}"</strong>.</p>
    <p>Keep up the momentum! You're making great progress towards your goal.</p>
`;

export const milestoneTemplate = async (name: string, milestone: string, roadmapTitle: string, roadmapId: string) => {
  const templateName = "milestone";
  let content = MILESTONE_TEMPLATE_DEFAULT;

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
    .replace(/{{milestone}}/g, milestone || 'Milestone')
    .replace(/{{roadmapTitle}}/g, roadmapTitle || 'Your Roadmap');

  return emailLayout({
    previewText: `You've reached the ${milestone} milestone! 🎉`,
    heading: `🎉 ${milestone} Completed!`,
    content: filledContent,
    actionText: "Continue Learning",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/roadmap/${roadmapId}`,
    accentColor: "#16a34a", // Green
  });
};
