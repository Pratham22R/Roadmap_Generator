
import { emailLayout } from "./layout";
import { getPrisma } from "@/lib/prisma";

export const WELCOME_TEMPLATE_DEFAULT = `
    <p>Hi {{name}},</p>
    <p>Thanks for joining us! We're excited to help you generate clear, actionable learning paths to master your goals.</p>
    <p>Get started by creating your first roadmap today.</p>
`;

export const welcomeTemplate = async (name: string) => {
  const templateName = "welcome";
  let content = WELCOME_TEMPLATE_DEFAULT;

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
    previewText: "Welcome to Roadmap Generator! Let's get started.",
    heading: "Welcome to Roadmap Generator! 🚀",
    content: filledContent,
    actionText: "Go to Dashboard",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
};
