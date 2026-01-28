
import { emailLayout } from "./layout";

export const inactivityTemplate = (name: string) => {
  const content = `
    <p>Hi ${name || 'there'},</p>
    <p>It's been a while since we last saw you. Your roadmap is waiting!</p>
    <p>Consistency is key to mastering new skills. Jump back in for just 15 minutes today.</p>
  `;

  return emailLayout({
    previewText: "We miss you! Your roadmap is waiting.",
    heading: "We Miss You! 👋",
    content,
    actionText: "Resume Learning",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    accentColor: "#ea580c", // Orange
  });
};
