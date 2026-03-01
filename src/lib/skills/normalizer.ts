import { canonicalSkills } from './canonicalSkills';

/**
 * Normalizes an array of skills extracted from a resume.
 * Converts to lowercase, trims whitespace, and maps to canonical names.
 * Unrecognized skills are discarded per instruction, but logged for review.
 * 
 * @param extractedSkills Raw skill strings extracted from the resume
 * @returns Array of valid, normalized canonical skill names
 */
export function normalizeSkills(extractedSkills: string[]): string[] {
    if (!extractedSkills || !Array.isArray(extractedSkills)) return [];

    const normalized = new Set<string>();

    for (const skill of extractedSkills) {
        if (typeof skill !== 'string') continue;

        const cleaned = skill.trim().toLowerCase();
        if (!cleaned) continue;

        // Direct match with canonical mapping
        const canonical = canonicalSkills[cleaned];
        if (canonical) {
            normalized.add(canonical);
        } else {
            // If it exactly matches a canonical value but wasn't lowercased in the dictionary keys
            // We can also try doing a reverse lookup or just let it be discarded.
            // Strict registry compliance:
            console.warn(`[Skill Normalizer] Unrecognized skill discarded: "${skill}"`);

            // Optionally we could just add it as title case if we didn't want strict matching
            // but instruction says "All skills must match this registry. If skill not recognized: Either discard Or log"
        }
    }

    return Array.from(normalized);
}
