'use server'

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { getPrisma } from "@/lib/prisma"
import { z } from "zod"

// --- Schemas ---
const CareerRoleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
})

const SkillSchema = z.object({
    title: z.string().min(1, "Title is required"),
    roleId: z.string().min(1, "Role is required"),
    category: z.string().optional(),
})

// --- ACTIONS ---

export async function removeSkillFromRole(roleId: string, skillId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const prisma = getPrisma()
    try {
        await prisma.roleSkill.delete({
            where: {
                roleId_skillId: {
                    roleId,
                    skillId
                }
            }
        })
        revalidatePath("/admin/career-roles")
        revalidatePath("/admin/skills")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to remove skill from role" }
    }
}

export async function createCareerRole(prevState: any, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { message: "Unauthorized" }
    }

    const validatedFields = CareerRoleSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    })

    if (!validatedFields.success) {
        return { message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors }
    }

    const prisma = getPrisma()
    try {
        await prisma.careerRole.create({
            data: {
                title: validatedFields.data.title,
                description: validatedFields.data.description,
                isActive: true,
            },
        })
        revalidatePath("/admin/career-roles")
        revalidatePath("/onboarding") // Update onboarding dropdown
        return { message: "Success" }
    } catch (e) {
        console.error(e)
        return { message: "Failed to create role. It might already exist." }
    }
}

export async function updateCareerRole(prevState: any, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const id = formData.get("id") as string
    const validatedFields = CareerRoleSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    })

    if (!validatedFields.success || !id) {
        return { message: "Invalid fields" }
    }

    const prisma = getPrisma()
    try {
        await prisma.careerRole.update({
            where: { id },
            data: {
                title: validatedFields.data.title,
                description: validatedFields.data.description,
            },
        })
        revalidatePath("/admin/career-roles")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to update role" }
    }
}

export async function deleteCareerRole(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const prisma = getPrisma()
    try {
        await prisma.careerRole.delete({ where: { id } })
        revalidatePath("/admin/career-roles")
        revalidatePath("/onboarding")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to delete role" }
    }
}

export async function createSkill(prevState: any, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    // Retrieve roleIds: might be multiple entries or JSON
    // If we use checkboxes with same name 'roleIds', formData.getAll('roleIds') gives array
    const rawRoleIds = formData.getAll("roleIds")
    // If it's passed as a JSON string (e.g. from a client component managing state), handle that too
    // For now assuming checkboxes:
    const roleIds = rawRoleIds.map(String).filter(Boolean)

    // Manual validation since our Zod schema might be single-role oriented
    const title = formData.get("title") as string
    const category = (formData.get("category") as string) || "Core"

    if (!title || title.length < 1) {
        return { message: "Title is required" }
    }

    const prisma = getPrisma()
    try {
        // 1. Ensure Skill exists (or create it)
        const skill = await prisma.skill.upsert({
            where: { title: title },
            update: {},
            create: { title: title }
        })

        // 2. Connect to Roles
        if (roleIds.length > 0) {
            for (const rId of roleIds) {
                await prisma.roleSkill.upsert({
                    where: {
                        roleId_skillId: {
                            roleId: rId,
                            skillId: skill.id
                        }
                    },
                    update: { category },
                    create: {
                        roleId: rId,
                        skillId: skill.id,
                        category
                    }
                })
            }
        }

        revalidatePath("/admin/skills")
        revalidatePath("/admin/career-roles")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to create skill" }
    }
}

export async function updateSkill(prevState: any, formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const category = formData.get("category") as string

    // Get all selected role IDs
    const roleIds = formData.getAll("roleIds").map(String)

    if (!id || !title) {
        return { message: "Invalid fields" }
    }

    const prisma = getPrisma()
    try {
        // 1. Update Global Skill Title
        await prisma.skill.update({
            where: { id },
            data: { title }
        })

        // 2. Sync Roles
        // Strategy:
        // - Find all existing RoleSkills for this skill
        // - Determine which to Delete (in DB but not in new list)
        // - Determine which to Create (in new list but not in DB)
        // - Determine which to Update (in both, update category)

        const existingRoleSkills = await prisma.roleSkill.findMany({
            where: { skillId: id },
            select: { roleId: true }
        })
        const existingIds = existingRoleSkills.map(r => r.roleId)

        const toCreate = roleIds.filter(rid => !existingIds.includes(rid))
        const toDelete = existingIds.filter(rid => !roleIds.includes(rid))
        const toUpdate = roleIds.filter(rid => existingIds.includes(rid))

        // Create
        for (const rid of toCreate) {
            await prisma.roleSkill.create({
                data: {
                    roleId: rid,
                    skillId: id,
                    category: category || "Core"
                }
            })
        }

        // Delete
        if (toDelete.length > 0) {
            await prisma.roleSkill.deleteMany({
                where: {
                    skillId: id,
                    roleId: { in: toDelete }
                }
            })
        }

        // Update (optional: update category if provided)
        // Note: This updates category for ALL kept links. Currently we only have one category input field in the UI.
        /* if (category) {
            await prisma.roleSkill.updateMany({
                where: {
                     skillId: id,
                     roleId: { in: toUpdate }
                },
                data: { category }
            })
        } */

        revalidatePath("/admin/skills")
        revalidatePath("/admin/career-roles")
        return { message: "Success" }
    } catch (e) {
        console.error(e)
        return { message: "Failed to update skill" }
    }
}

export async function deleteSkill(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const prisma = getPrisma()
    try {
        // We are deleting the Skill itself, or the connection?
        // UI deletes "Skill" usually from the list. 
        // If we delete the `Skill` record, it cascades to all RoleSkills.
        // If we want to remove it FROM A ROLE, we need a different action or pass a context.
        // For "Skills Inventory" page, deleting usually means removing the global skill definition or just that item.
        // BUT the `id` passed here from the UI card... wait.
        // The UI currently lists `prisma.skill.findMany`. So `id` is `Skill.id`.

        await prisma.skill.delete({ where: { id } })

        revalidatePath("/admin/skills")
        revalidatePath("/admin/career-roles")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to delete skill" }
    }
}

export async function addYouTubeChannel(channelId: string, type: "WHITELIST" | "BLACKLIST") {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const prisma = getPrisma()
    try {
        await prisma.youTubeChannel.create({
            data: {
                channelId,
                type,
            }
        })
        revalidatePath("/admin/youtube-settings")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to add channel. It might already exist." }
    }
}

export async function deleteYouTubeChannel(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { message: "Unauthorized" }

    const prisma = getPrisma()
    try {
        await prisma.youTubeChannel.delete({ where: { id } })
        revalidatePath("/admin/youtube-settings")
        return { message: "Success" }
    } catch (e) {
        return { message: "Failed to delete channel" }
    }
}
