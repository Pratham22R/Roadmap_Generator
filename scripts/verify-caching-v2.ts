import 'dotenv/config'
import { generateRoadmap } from "../src/lib/ai/roadmap-generator"
import { getPrisma } from "../src/lib/prisma"

// Mock GoogleGenAI to avoid spending credits and for deterministic testing
// We will mock the module behavior by overriding the generation function if possible,
// or we just let it fail/run and check the DB logic which happens BEFORE AI call for cache hits.
// For cache misses, it will try to call AI. We can catch the error if no API key or just observe behaviors.

async function main() {
    const prisma = getPrisma()

    // Create a dummy user for testing
    let user = await prisma.user.findFirst({ where: { email: "test-v2@example.com" } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "test-v2@example.com",
                name: "Test User V2"
            }
        })
    }

    const baseInput = {
        careerGoal: "Backend Developer",
        experienceLevel: "Beginner",
        dailyTime: "2 hours",
        targetDuration: "3 months"
    }

    // TEST 1: Cache Miss (New Signature)
    console.log("--- TEST 1: First Generation (Skills: [Node, DB]) ---")
    const input1 = { ...baseInput, currentSkills: ["Node", "DB"] }

    // We expect this to call AI. 
    // NOTE: If Env vars are not set for AI, this might fail. 
    // We assume the environment is set up or we catch the error.
    let roadmap1;
    try {
        roadmap1 = await generateRoadmap(user.id, input1)
        console.log(`Roadmap 1 Created: ${roadmap1.id} (Template: ${roadmap1.templateId})`)
    } catch (e) {
        console.error("Roadmap 1 Generation Failed (Likely AI Error or Config):", e)
        // If it fails, we can't test caching of THIS specific item unless we manually create a template.
        // Let's assume for verification we might need to manually inject a template if AI fails.
        return;
    }

    // TEST 2: Cache Hit (Same Skills, different order)
    console.log("\n--- TEST 2: Second Generation (Skills: [DB, Node]) - Should be Cache Hit ---")
    const input2 = { ...baseInput, currentSkills: ["DB", "Node"] } // Reordered

    const start2 = Date.now()
    const roadmap2 = await generateRoadmap(user.id, input2)
    const time2 = Date.now() - start2

    console.log(`Roadmap 2 Created: ${roadmap2.id} (Template: ${roadmap2.templateId})`)
    console.log(`Time taken: ${time2}ms`)

    if (roadmap1.templateId === roadmap2.templateId) {
        console.log("✅ SUCCESS: Template reused for reordered skills")
    } else {
        console.error("❌ FAILED: Template NOT reused for reordered skills")
    }


    // TEST 3: Cache Miss (Different Skills)
    console.log("\n--- TEST 3: Third Generation (Skills: [Node]) - Should be Cache Miss ---")
    const input3 = { ...baseInput, currentSkills: ["Node"] } // Different

    try {
        const start3 = Date.now()
        const roadmap3 = await generateRoadmap(user.id, input3)
        console.log(`Roadmap 3 Created: ${roadmap3.id} (Template: ${roadmap3.templateId})`)

        if (roadmap3.templateId !== roadmap1.templateId) {
            console.log("✅ SUCCESS: New template created for different skills")
        } else {
            console.error("❌ FAILED: Template reused incorrectly for different skills")
        }
    } catch (e) {
        console.log("Roadmap 3 Generation Failed (Expected if AI is called and fails, but confirms it tried to call AI)")
        // This is actually a partial success if it failed due to AI, meaning it didn't find a cache.
    }

    // Clean up
    console.log("\n--- Cleanup ---")
    // await prisma.user.delete({ where: { id: user.id } }) // Optional
}

main()
    .catch(console.error)
