"use server"

import { auth } from "@/auth"
import { getPrisma } from "@/lib/prisma"
import { generateRoadmap } from "@/lib/ai/roadmap-generator"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const onboardingSchema = z.object({
  careerGoal: z.string().min(1),
  currentSkills: z.array(z.string()),
  experienceLevel: z.string(),
  dailyTime: z.string(),
  targetDuration: z.string(),
})

export async function submitOnboarding(data: z.infer<typeof onboardingSchema>) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const prisma = getPrisma()

  // Validate data
  const validatedFields = onboardingSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, error: "Invalid data" }
  }

  // LIMIT CHECK
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  })
  const isPremium = subscription?.status === "PREMIUM" || subscription?.status === "PRO"

  if (!isPremium) {
    const roadmapCount = await prisma.roadmap.count({
      where: { userId: session.user.id, status: "ACTIVE" } // Only count active ones
    })

    if (roadmapCount >= 1) {
      return { success: false, error: "FREE_LIMIT_REACHED" }
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Create Onboarding Profile
      await tx.onboardingProfile.upsert({
        where: { userId: session.user.id },
        update: { ...validatedFields.data },
        create: {
          userId: session.user.id,
          ...validatedFields.data
        }
      })

      // Mark user as onboarded
      await tx.user.update({
        where: { id: session.user.id },
        data: { onboardingCompleted: true }
      })
    })


    // ... inside transaction or after
    // Note: generateRoadmap is async and might take time. 
    // If we want it to be part of the transaction, we need to pass tx, but generateRoadmap uses prisma global.
    // For now, let's await it AFTER the transaction to not lock DB rows for long AI calls, 
    // OR we just run it and let the user see "Generating..." on dashboard.
    // Since this is a server action, awaiting it here will make the UI submit button spin until it's done.
    // This is good for "instant" feedback.

    await generateRoadmap(session.user.id, {
      careerGoal: validatedFields.data.careerGoal,
      experienceLevel: validatedFields.data.experienceLevel,
      dailyTime: validatedFields.data.dailyTime,
      targetDuration: validatedFields.data.targetDuration,
      currentSkills: validatedFields.data.currentSkills
    })

    return { success: true }
  } catch (error) {
    console.error("Onboarding Error:", error)
    return { success: false, error: "Database error" }
  }
}
