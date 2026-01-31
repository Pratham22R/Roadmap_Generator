"use server"

import { auth } from "@/auth"
import { getPrisma } from "@/lib/prisma"
import { generateRoadmap } from "@/lib/ai/roadmap-generator"
import { triggerWelcomeEmail } from "@/actions/trigger-welcome-email";
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
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  const prisma = getPrisma()

  // Check if user is ALREADY onboarded before we might update it
  const userStatus = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true }
  })
  const wasAlreadyOnboarded = userStatus?.onboardingCompleted ?? false

  // Validate data
  const validatedFields = onboardingSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, error: "Invalid data" }
  }

  // LIMIT CHECK
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })
  const isPremium = subscription?.status === "PREMIUM" || subscription?.status === "PRO"

  if (!isPremium) {
    const roadmapCount = await prisma.roadmap.count({
      where: { userId, status: "ACTIVE" } // Only count active ones
    })

    if (roadmapCount >= 1) {
      return { success: false, error: "FREE_LIMIT_REACHED" }
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Create Onboarding Profile
      await tx.onboardingProfile.upsert({
        where: { userId },
        update: { ...validatedFields.data },
        create: {
          userId,
          ...validatedFields.data
        }
      })

      // Mark user as onboarded
      await tx.user.update({
        where: { id: userId },
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

    const roadmap = await generateRoadmap(userId, {
      careerGoal: validatedFields.data.careerGoal,
      experienceLevel: validatedFields.data.experienceLevel,
      dailyTime: validatedFields.data.dailyTime,
      targetDuration: validatedFields.data.targetDuration,
      currentSkills: validatedFields.data.currentSkills
    })

    if (!wasAlreadyOnboarded) {
      // Pass the user object to avoid another DB call if possible, or just the ID
      await triggerWelcomeEmail(session.user);
    }

    return { success: true, roadmapId: roadmap.id }
  } catch (error) {
    console.error("Onboarding Error:", error)
    return { success: false, error: "Database error" }
  }
}
