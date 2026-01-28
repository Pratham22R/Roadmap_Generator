
import { emailLayout } from "./layout";

export const weeklyTemplate = (name: string, completedTasks: number, nextGoal: string) => {
  const content = `
    <p>Hi ${name || 'there'},</p>
    <p>Here's a quick summary of your learning progress this week:</p>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0; font-size: 36px; color: #16a34a;">${completedTasks}</h2>
      <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Skills Completed</p>
    </div>

    <p>Your next goal: <strong>${nextGoal}</strong></p>
  `;

  return emailLayout({
    previewText: `You completed ${completedTasks} skills this week!`,
    heading: "Your Weekly Progress 📈",
    content,
    actionText: "Keep Growing",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    accentColor: "#16a34a", // Green
  });
};
