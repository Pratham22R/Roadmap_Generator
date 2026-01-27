import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { polar } from "@/lib/polar"
import { getPrisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const body = await req.json()
    const event = body

    // LOGGING (Critical for debugging)
    console.log("------- POLAR WEBHOOK RECEIVED -------")
    console.log("Event Type:", event.type)
    console.log("Payload:", JSON.stringify(event.data, null, 2))
    console.log("--------------------------------------")

    try {
        // HANDLE SUBSKEY EVENTS
        if (event.type === "subscription.created" || event.type === "subscription.updated") {
            const subscription = event.data
            const customerEmail = subscription.customer?.email || subscription.user?.email

            if (customerEmail) {
                const user = await getPrisma().user.findUnique({ where: { email: customerEmail } })
                if (user) {
                    await getPrisma().subscription.upsert({
                        where: { userId: user.id },
                        update: {
                            polarSubscriptionId: subscription.id,
                            status: subscription.status === "active" ? "PREMIUM" : "FREE",
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                        },
                        create: {
                            userId: user.id,
                            polarSubscriptionId: subscription.id,
                            status: subscription.status === "active" ? "PREMIUM" : "FREE",
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                        }
                    })
                    console.log(`✅ Subscription updated via subscription event for ${customerEmail}`)
                } else {
                    console.warn(`⚠️ User not found for email: ${customerEmail}`)
                }
            }
        }

        // HANDLE CHECKOUT EVENTS (One-time or initial sub)
        if (event.type === "checkout.created" || event.type === "checkout.updated") {
            const checkout = event.data
            const customerEmail = checkout.customer_email || checkout.customer?.email

            // Only process succeeded checkouts
            if (checkout.status === "succeeded" && customerEmail) {
                const user = await getPrisma().user.findUnique({ where: { email: customerEmail } })

                if (user) {
                    // Grant Premium
                    // Note: We might not have a subscription ID yet if it's just a checkout, 
                    // but we can grant "PRO" status.
                    await getPrisma().subscription.upsert({
                        where: { userId: user.id },
                        update: {
                            status: "PREMIUM",
                            // Set a default period if unknown (e.g. 1 month from now) or wait for sub event
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        },
                        create: {
                            userId: user.id,
                            status: "PREMIUM",
                            polarSubscriptionId: checkout.id, // temp ID
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                    })
                    console.log(`✅ Premium granted via checkout.succeeded for ${customerEmail}`)
                } else {
                    console.warn(`⚠️ User not found for checkout email: ${customerEmail}`)
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (err) {
        console.error("❌ Webhook processing failed", err)
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
}
