
import { emailLayout } from "./layout";

export const roadmapTemplate = (name: string, roadmapTitle: string, roadmapId: string) => {
  const content = `
    <p>Hi ${name || 'there'},</p>
    <p>Great news! Your roadmap <strong>"${roadmapTitle}"</strong> has been successfully generated.</p>
    <p>Dive in and start your learning journey now. We've laid out every step for you.</p>
  `;

  return emailLayout({
    previewText: `Your roadmap "${roadmapTitle}" is ready!`,
    heading: "Your Roadmap is Ready! 🗺️",
    content,
    actionText: "View Roadmap",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/roadmap/${roadmapId}`,
    accentColor: "#4f46e5", // Indigo
  });
};
