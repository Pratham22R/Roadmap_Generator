'use server'

import { auth } from "@/auth"
import { polar } from "@/lib/polar"
import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function syncSubscriptionStatus() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Not authenticated")
    }

    try {
        console.log("Syncing subscription for:", session.user.email)

        // 1. Get customer by email
        const listParams: any = {
            email: session.user.email,
        }
        if (process.env.POLAR_ORGANIZATION_ID) {
            listParams.organizationId = process.env.POLAR_ORGANIZATION_ID
        }

        const customersIterator = await polar.customers.list(listParams)

        console.log("Customer iterator retrieved")

        let customer;
        for await (const page of customersIterator) {
            console.log("Customer page received:", JSON.stringify(page, null, 2))
            if (page.result?.items) {
                customer = page.result.items.find((c: any) => c.email === session.user.email)
                if (customer) break;
            }
        }

        if (!customer) {
            return { success: false, message: "No active subscription found on Polar." }
        }

        // 2. List subscriptions for this customer
        const subListParams: any = {
            customerId: customer.id,
        }
        if (process.env.POLAR_ORGANIZATION_ID) {
            subListParams.organizationId = process.env.POLAR_ORGANIZATION_ID
        }

        const subscriptionsIterator = await polar.subscriptions.list(subListParams)

        // 3. Check for active subscription
        let activeSub;
        for await (const page of subscriptionsIterator) {
            if (page.result?.items) {
                activeSub = page.result.items.find((sub: any) => sub.status === "active")
                if (activeSub) break;
            }
        }

        if (activeSub) {
            await getPrisma().subscription.upsert({
                where: { userId: session.user.id },
                update: {
                    status: "PREMIUM",
                    polarSubscriptionId: activeSub.id,
                    currentPeriodEnd: activeSub.currentPeriodEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                },
                create: {
                    userId: session.user.id,
                    status: "PREMIUM",
                    polarSubscriptionId: activeSub.id,
                    currentPeriodEnd: activeSub.currentPeriodEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            })

            revalidatePath("/dashboard")
            return { success: true, message: "Subscription synced! You are Premium." }
        }

        // 3. Fallback: Check ORDERS/CHECKOUTS if subscription not found
        // (Useful for one-time purchases if Polar architecture allows listing orders by email)
        // For now, if no sub found, we assume FREE

        return { success: false, message: "No active subscription found on Polar." }

    } catch (error: any) {
        console.error("Sync Error Details:", {
            message: error.message,
            stack: error.stack,
            fullError: error
        })
        return { success: false, message: `Failed to sync with Polar: ${error.message}` }
    }
}
