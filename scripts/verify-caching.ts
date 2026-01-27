
import { generateRoadmap } from "../src/lib/ai/roadmap-generator"
import { getPrisma } from "../src/lib/prisma"

// Mock GoogleGenAI to avoid spending credits and for deterministic testing if needed
// For now we will rely on logic flow logs.

async function main() {
    const prisma = getPrisma()

    // Create a dummy user for testing
    let user = await prisma.user.findFirst({ where: { email: "test@example.com" } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "test@example.com",
                name: "Test User"
            }
        })
    }

    const input = {
        careerGoal: "Frontend Developer",
        experienceLevel: "Beginner",
        dailyTime: "2 hours",
        targetDuration: "3 months"
    }

    console.log("--- TEST 1: First Generation (Cache Miss) ---")
    const start1 = Date.now()
    const roadmap1 = await generateRoadmap(user.id, input)
    const time1 = Date.now() - start1

    console.log(`Roadmap 1 Created: ${roadmap1.id}`)
    console.log(`Time taken: ${time1}ms`)
    console.log(`Template ID: ${roadmap1.templateId}`)

    if (!roadmap1.templateId) {
        console.error("FAILED: Roadmap 1 should have a template ID")
    }

    console.log("\n--- TEST 2: Second Generation (Cache Hit) ---")
    const start2 = Date.now()
    const roadmap2 = await generateRoadmap(user.id, input)
    const time2 = Date.now() - start2

    console.log(`Roadmap 2 Created: ${roadmap2.id}`)
    console.log(`Time taken: ${time2}ms`)
    console.log(`Template ID: ${roadmap2.templateId}`)

    if (roadmap1.templateId !== roadmap2.templateId) {
        console.error("FAILED: Template IDs should match")
    } else {
        console.log("SUCCESS: Template IDs match")
    }

    if (time2 > 5000) { // Arbitrary threshold, cache hit should be fast
        console.warn("WARNING: Cache hit took longer than expected. Check if API was called.")
    } else {
        console.log("SUCCESS: Response time indicates cache hit")
    }

    // Check Database State
    const template = await prisma.roadmapTemplate.findUnique({
        where: { id: roadmap1.templateId! },
        include: { phases: { include: { skills: true } } }
    })

    console.log(`Template has ${template?.phases.length} phases`)
    console.log(`Template Phase 1 has ${template?.phases[0]?.skills.length} skills`)

    const progress1 = await prisma.skillProgress.count({ where: { roadmapId: roadmap1.id } })
    const progress2 = await prisma.skillProgress.count({ where: { roadmapId: roadmap2.id } })

    console.log(`Roadmap 1 Progress Entries: ${progress1}`)
    console.log(`Roadmap 2 Progress Entries: ${progress2}`)

    if (progress1 === 0 || progress1 !== progress2) {
        console.error("FAILED: Progress entries mismatch or empty")
    } else {
        console.log("SUCCESS: Progress entries created correctly for both instances")
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // Cleanup if needed, or leave for inspection
    })
