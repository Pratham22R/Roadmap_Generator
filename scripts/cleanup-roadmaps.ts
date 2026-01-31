import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🧹 Starting cleanup of Roadmap data...")

    // 1. Delete all Roadmaps (Cascades to SkillProgress)
    const deletedRoadmaps = await prisma.roadmap.deleteMany({})
    console.log(`✅ Deleted ${deletedRoadmaps.count} Roadmaps`)

    // 2. Delete all RoadmapTemplates (Cascades to Phases -> Skills -> Resources)
    // Note: We must delete Roadmaps first because they reference Templates without Cascade delete (usually).
    const deletedTemplates = await prisma.roadmapTemplate.deleteMany({})
    console.log(`✅ Deleted ${deletedTemplates.count} Roadmap Templates`)

    // 3. Optional: Reset Onboarding Profile? 
    // The user asked to remove "data regarding roadmap and templates", but usually this implies resetting the user flow.
    // Let's NOT delete profiles to keep the user account intact, unless they strictly asked "reset onboarding".
    // Use: "kindly remove the data regarding roadmap and templates that comes to db after roadmap generation"
    // This implies the OUTPUT of generation, not the user's input profile.

    console.log("✨ Cleanup completed successfully.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
