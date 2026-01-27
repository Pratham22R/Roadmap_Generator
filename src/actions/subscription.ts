'use server'

import { auth } from "@/auth"
import { polar } from "@/lib/polar"
import { redirect } from "next/navigation"

export async function createCheckout() {
  const session = await auth()
  if (!session?.user?.email) {
     redirect("/login")
  }

  // Create Checkout Link
  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_PRODUCT_ID_PREMIUM!],
    customerEmail: session.user.email,
    successUrl: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
    allowDiscountCodes: true,
  })

  if (checkout.url) {
    redirect(checkout.url)
  } else {
    throw new Error("Failed to create checkout")
  }
}
