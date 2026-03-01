'use server'

import { getPrisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/ai/roadmap-generator"

const SYSTEM_PROMPT_KEY = "roadmap_system_prompt"

export async function getSystemPrompt() {
    const prisma = getPrisma()
    const setting = await prisma.globalSettings.findUnique({
        where: { key: SYSTEM_PROMPT_KEY }
    })

    // Default prompt if not found (fallback to code constant if DB is empty, 
    // but better to return empty string here and let UI handle defaults)
    return setting?.value || DEFAULT_SYSTEM_PROMPT
}

export async function updateSystemPrompt(newPrompt: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { success: false, message: "Unauthorized" }
    }

    if (!newPrompt || newPrompt.trim().length < 50) {
        return { success: false, message: "Prompt is too short. Please provide detailed instructions." }
    }

    const prisma = getPrisma()
    try {
        await prisma.globalSettings.upsert({
            where: { key: SYSTEM_PROMPT_KEY },
            update: { value: newPrompt },
            create: {
                key: SYSTEM_PROMPT_KEY,
                value: newPrompt,
                description: "System instructions for Gemini AI Roadmap Generation"
            }
        })

        revalidatePath("/admin/ai-prompts")
        return { success: true, message: "System prompt updated successfully" }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Failed to update prompt" }
    }
}
