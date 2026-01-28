import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️  Clearing database...");

    try {
        // 1. Delete standalone / non-cascading models or leaf nodes if needed
        await prisma.polarWebhookEvent.deleteMany();
        await prisma.verificationToken.deleteMany();

        // 2. Delete Users - this cascades to:
        //    - Accounts, Sessions, OnboardingProfile
        //    - Roadmaps (which cascades to ProgressLogs, SkillProgress)
        //    - Subscriptions, EmailLogs, etc.
        const deletedUsers = await prisma.user.deleteMany();
        console.log(`✅ Deleted ${deletedUsers.count} users (and related data).`);

        // 3. Delete Roadmap Templates - this cascades to:
        //    - TemplatePhase, TemplateSkill, TemplateResource
        //    Note: We must delete these AFTER Users (Roadmaps), because Roadmaps reference Templates.
        const deletedTemplates = await prisma.roadmapTemplate.deleteMany();
        console.log(`✅ Deleted ${deletedTemplates.count} roadmap templates.`);

        console.log("✨ Database cleared successfully.");
    } catch (error) {
        console.error("❌ Error clearing database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
