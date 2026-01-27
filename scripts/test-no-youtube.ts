
import 'dotenv/config'
import { generateRoadmap } from "../src/lib/ai/roadmap-generator"
import { getPrisma } from "../src/lib/prisma"

async function main() {
    const prisma = getPrisma()

    let user = await prisma.user.findFirst({ where: { email: "test-no-youtube@example.com" } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "test-no-youtube@example.com",
                name: "Test No YouTube"
            }
        })
    }

    const input = {
        careerGoal: "Full Stack Developer",
        experienceLevel: "Beginner",
        dailyTime: "2 hours",
        targetDuration: "6 months",
        currentSkills: ["HTML"],
        includeProjects: true
    }

    console.log("--- TEST: Generating Roadmap (NO YouTube API) ---")

    try {
        const start = Date.now()
        // Force a unique input to bypass cache if needed, or we rely on the fact that the hash algorithm hasn't changed 
        // but the prompt response structure HAS. 
        // Wait, if we use the same inputs, the hash is the same. If a template ALREADY exists from previous tests (without new resource structure), 
        // we might reuse it. 
        // We should ensure we use a fresh input to force AI call.
        input.careerGoal = `Full Stack Dev ${Date.now()}`

        const roadmap = await generateRoadmap(user.id, input)
        const time = Date.now() - start

        console.log(`Roadmap Created: ${roadmap.id}`)
        console.log(`Time taken: ${time}ms`)

        // Verification: Check if resources have URLs 
        const template = await prisma.roadmapTemplate.findUnique({
            where: { id: roadmap.templateId! },
            include: { phases: { include: { skills: { include: { resources: true } } } } }
        })

        const firstSkill = template?.phases[0]?.skills[0];
        console.log("First Skill:", firstSkill?.title)
        console.log("Resources:", firstSkill?.resources)

        const hasVideo = firstSkill?.resources.some(r => r.type === 'VIDEO' && r.url.includes('youtu'))
        const hasDoc = firstSkill?.resources.some(r => r.type === 'ARTICLE')

        if (hasVideo && hasDoc) {
            console.log("✅ SUCCESS: Generated Video and Doc resources from Gemini")
        } else {
            console.error("❌ FAILED: Missing resources")
        }

    } catch (e) {
        console.error("❌ FAILURE:", e)
    }
}

main()
