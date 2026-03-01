import { getPrisma } from "@/lib/prisma"
import { normalizeSkills } from "@/lib/skills/normalizer"

/**
 * Calculates missing skills based on a target career role and user's known skills.
 * New logic: requiredSkills - normalizedUserSkills = missingSkills
 * 
 * @param careerGoal The target career role (e.g. "Frontend Developer")
 * @param userSkills Array of skills the user already knows (from resume or onboarding)
 * @returns Array of missing canonical skills, plus whether it successfully found role
 */
export async function computeMissingSkills(careerGoal: string, userSkills: string[]): Promise<string[]> {
    const prisma = getPrisma()

    const normalizedUserSkills = normalizeSkills(userSkills)

    const role = await prisma.careerRole.findFirst({
        where: { title: { equals: careerGoal, mode: 'insensitive' } },
        include: { skills: { include: { skill: true } } }
    })

    // If role not strictly in DB, we could either fallback to an empty array (meaning we rely on Gemini entirely)
    // For now, if role is missing, we just return empty array so that prompt relies on Gemini
    if (!role) return []

    const requiredSkills = role.skills.map(rs => rs.skill.title)
    const knownSet = new Set(normalizedUserSkills)

    return requiredSkills.filter(req => !knownSet.has(req))
}
