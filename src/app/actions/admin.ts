"use server"

import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Helper to check if current user is admin
async function checkAdmin() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required")
    }
    return session
}

export async function banUser(userId: string, isBanned: boolean) {
    await checkAdmin()
    const prisma = getPrisma()

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isBanned }
        })
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
        return { success: true, message: `User ${isBanned ? 'banned' : 'unbanned'} successfully` }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteUser(userId: string) {
    const session = await checkAdmin()

    // Prevent deleting self
    if (session.user?.id === userId) {
        return { success: false, error: "Cannot delete your own admin account" }
    }

    const prisma = getPrisma()

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath("/admin/users")
        return { success: true, message: "User deleted successfully" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
