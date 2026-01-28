
import { emailLayout } from "./layout";

export const milestoneTemplate = (name: string, milestone: string, roadmapTitle: string, roadmapId: string) => {
  const content = `
    <p>Hi ${name || 'there'},</p>
    <p>Congratulations! You've completed <strong>${milestone}</strong> of your roadmap <strong>"${roadmapTitle}"</strong>.</p>
    <p>Keep up the momentum! You're making great progress towards your goal.</p>
  `;

  return emailLayout({
    previewText: `You've reached the ${milestone} milestone! 🎉`,
    heading: `🎉 ${milestone} Completed!`,
    content,
    actionText: "Continue Learning",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/roadmap/${roadmapId}`,
    accentColor: "#16a34a", // Green
  });
};
