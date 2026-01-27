import crypto from 'crypto';

export interface RoadmapRequest {
    careerGoal: string
    experienceLevel: string
    dailyTime: string
    targetDuration: string
    currentSkills: string[]
    learningObjective?: string
    includeProjects?: boolean
}

interface NormalizedInput {
    careerGoal: string
    experienceLevel: string
    dailyTime: string
    targetDuration: string
    currentSkills: string[]
    learningObjective?: string
    includeProjects?: boolean
    [key: string]: any
}

/**
 * Normalizes user input for roadmap generation to ensure consistency.
 * - Trims whitespace
 * - Converts to lowercase
 * - Sorts arrays (if any)
 */
export function normalizeInputs(request: RoadmapRequest): NormalizedInput {
    // Helper to normalize string
    const normStr = (s?: string) => s ? s.trim().toLowerCase() : "";

    return {
        careerGoal: normStr(request.careerGoal),
        experienceLevel: normStr(request.experienceLevel),
        dailyTime: normStr(request.dailyTime),
        targetDuration: normStr(request.targetDuration),
        currentSkills: (request.currentSkills || [])
            .map(s => normStr(s))
            .filter(Boolean) // Remove empty strings
            .sort(), // Alphabetical sort for consistency
        learningObjective: normStr(request.learningObjective),
        includeProjects: !!request.includeProjects // Force boolean
    };
}

/**
 * Generates a deterministic SHA-256 hash from normalized inputs.
 * This hash acts as the key for finding existing roadmap templates.
 */
export function generateTemplateHash(input: NormalizedInput): string {
    // Sort keys to ensure object property order doesn't affect hash
    // We only include specific keys that should affect the unique roadmap signature
    const keysToHash = [
        'careerGoal',
        'experienceLevel',
        'dailyTime',
        'targetDuration',
        'currentSkills', // This is now an array
        'learningObjective',
        'includeProjects'
    ];

    const dataString = keysToHash.map(key => {
        const val = input[key];
        return `${key}:${JSON.stringify(val)}`;
    }).join('|');

    return crypto.createHash('sha256').update(dataString).digest('hex');
}
