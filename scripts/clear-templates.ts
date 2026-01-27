
import 'dotenv/config'
import { getPrisma } from "../src/lib/prisma"

async function main() {
    const prisma = getPrisma()
    console.log("🗑️  Clearing Roadmap Templates Cache...")

    // We only need to delete templates. Cascading deletes should handle phases/skills/resources if configured,
    // otherwise we might need to delete dependent records. 
    // Prisma usually handles cascade if defined in schema.

    // Check if there are roadmaps using templates
    const roadmaps = await prisma.roadmap.count()
    console.log(`Found ${roadmaps} active user roadmaps.`)

    // For this dev fix, we might want to keep user roadmaps but they will lose their template link if we delete templates.
    // If we delete templates, user roadmaps might become invalid or we should cascade delete them too to force fresh start.
    // Let's delete EVERYTHING to be safe and clean.

    await prisma.progressLog.deleteMany({})
    await prisma.skillProgress.deleteMany({})
    await prisma.roadmap.deleteMany({}) // User instances
    await prisma.templateResource.deleteMany({})
    await prisma.templateSkill.deleteMany({})
    await prisma.templatePhase.deleteMany({})
    await prisma.roadmapTemplate.deleteMany({})

    console.log("✅ All roadmap data cleared. System is fresh.")
}

main()
    .catch(console.error)
