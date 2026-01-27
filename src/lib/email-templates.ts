export const EmailTemplates = {
  welcome: (userName: string) => `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb;">Welcome to Roadmap Generator, ${userName}! 🚀</h2>
      <p>We are thrilled to accompany you on your learning journey.</p>
      <p>Start by creating your first personalized roadmap today.</p>
      <a href="${process.env.NEXTAUTH_URL}/onboarding" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Create Roadmap</a>
    </div>
  `,

  roadmapCreated: (roadmapTitle: string, link: string) => `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #16a34a;">Your Roadmap "${roadmapTitle}" is Ready! 🎉</h2>
      <p>Our AI has crafted a personalized learning path just for you.</p>
      <p>Check out your curriculum and start learning:</p>
      <a href="${link}" style="display: inline-block; background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Roadmap</a>
    </div>
  `,

  skillCompleted: (skillTitle: string, streak: number) => `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #ea580c;">Great Job! You Completed "${skillTitle}" 🎓</h2>
      <p>You are making excellent progress.</p>
      <p><strong>Current Streak: ${streak} days 🔥</strong></p>
      <p>Keep up the momentum!</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Continue Learning</a>
    </div>
  `
};
