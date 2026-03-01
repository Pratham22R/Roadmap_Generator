import crypto from 'crypto';

interface CacheParams {
    careerOrTopic: string;
    missingSkills: string[];
    experienceLevel: string;
    dailyTime: string;
    targetDuration: string;
}

/**
 * Generates a deterministic SHA-256 hash for roadmap caching.
 * Key components: career OR selectedSkillCluster + sortedMissingSkills + experienceLevel + dailyTime
 */
export function generateRoadmapHash(params: CacheParams): string {
    const sortedMissingSkills = [...params.missingSkills].sort();

    const dataString = [
        `career:${params.careerOrTopic.trim().toLowerCase()}`,
        `missingSkills:${JSON.stringify(sortedMissingSkills)}`,
        `experienceLevel:${params.experienceLevel.trim().toLowerCase()}`,
        `dailyTime:${params.dailyTime.trim().toLowerCase()}`,
        `targetDuration:${params.targetDuration.trim().toLowerCase()}`,
    ].join('|');

    return crypto.createHash('sha256').update(dataString).digest('hex');
}
