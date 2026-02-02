
import { emailLayout } from "./layout";
import { getPrisma } from "@/lib/prisma";

export const WEEKLY_TEMPLATE_DEFAULT = `
    <p>Hi {{name}},</p>
    <p>Here's a quick summary of your learning progress this week:</p>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0; font-size: 36px; color: #16a34a;">{{completedTasks}}</h2>
      <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Skills Completed</p>
      
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <tr>
          <td align="center" width="50%" style="vertical-align: top; padding: 0 10px;">
             <div style="font-size: 24px; font-weight: bold; color: #1f2937;">{{totalHours}}</div>
             <div style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Hours</div>
          </td>
          <td align="center" width="50%" style="vertical-align: top; padding: 0 10px;">
             <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">{{currentStreak}} 🔥</div>
             <div style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Day Streak</div>
          </td>
        </tr>
      </table>
    </div>

    <p style="text-align: center;">Your next goal: <strong style="color: #111827;">{{nextGoal}}</strong></p>
`;

export const weeklyProgressTemplate = async (name: string, stats: { completedTasks: number, totalHours: number, currentStreak: number, nextGoal: string }) => {
  const { completedTasks, totalHours, currentStreak, nextGoal } = stats;
  const templateName = "weekly";
  let content = WEEKLY_TEMPLATE_DEFAULT;

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
    .replace(/{{completedTasks}}/g, String(completedTasks || 0))
    .replace(/{{totalHours}}/g, String(totalHours || 0))
    .replace(/{{currentStreak}}/g, String(currentStreak || 0))
    .replace(/{{nextGoal}}/g, nextGoal || 'Keep going!');

  return emailLayout({
    previewText: `You completed ${completedTasks} skills this week!`,
    heading: "Your Weekly Progress 📈",
    content: filledContent,
    actionText: "Keep Growing",
    actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    accentColor: "#16a34a", // Green
  });
};
