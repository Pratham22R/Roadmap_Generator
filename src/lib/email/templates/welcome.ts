
import { emailLayout } from "./layout";

export const welcomeTemplate = (name: string) => {
  const content = `
    <p>Hi ${name || 'there'},</p>
    <p>Thanks for joining us! We're excited to help you generate clear, actionable learning paths to master your goals.</p>
    <p>Get started by creating your first roadmap today.</p>
  `;

  return emailLayout({
    previewText: "Welcome to Roadmap Generator! Let's get started.",
    heading: "Welcome to Roadmap Generator! 🚀",
    content,
    actionText: "Go to Dashboard",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    accentColor: "#111827", // Dark / Black
  });
};
