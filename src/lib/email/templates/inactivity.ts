
import { emailLayout } from "./layout";
import { getPrisma } from "@/lib/prisma";

export const INACTIVITY_TEMPLATE_DEFAULT = `
    <p>Hi {{name}},</p>
    <p>It's been a while since we last saw you. Your roadmap is waiting!</p>
    <p>Consistency is key to mastering new skills. Jump back in for just 15 minutes today.</p>
`;

export const inactivityTemplate = async (name: string) => {
  const templateName = "inactivity";
  let content = INACTIVITY_TEMPLATE_DEFAULT;

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
  const filledContent = content.replace(/{{name}}/g, name || 'there');

  return emailLayout({
    previewText: "We miss you! Your roadmap is waiting.",
    heading: "We Miss You! 👋",
    content: filledContent,
    actionText: "Resume Learning",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    accentColor: "#ea580c", // Orange
  });
};
