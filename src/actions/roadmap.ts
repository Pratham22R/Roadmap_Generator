'use server'

import { auth } from "@/auth"
import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleSkillStatus(roadmapId: string, skillId: string, isCompleted: boolean) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const prisma = getPrisma()
  const status = isCompleted ? "COMPLETED" : "PENDING"

  try {
    await prisma.skillProgress.update({
      where: {
        roadmapId_skillId: {
          roadmapId,
          skillId
        }
      },
      data: { status }
    })
  } catch (error) {
    console.error("Failed to update skill progress:", error)
    throw new Error("Failed to update status")
  }

  // Log progress
  if (isCompleted) {
    await prisma.progressLog.create({
      data: {
        userId: session.user.id,
        itemId: skillId,
        itemType: "SKILL",
        action: "COMPLETED"
      }
    })
  }

  revalidatePath("/dashboard")
  return { success: true }
}
