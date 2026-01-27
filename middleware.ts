import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnOnboarding = req.nextUrl.pathname.startsWith("/onboarding")
  const onboardingCompleted = req.auth?.user?.onboardingCompleted
  
  if (isOnDashboard) {
    if (isLoggedIn) {
        if (!onboardingCompleted) {
            return Response.redirect(new URL("/onboarding", req.nextUrl))
        }
        return
    } 
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  if (isOnOnboarding) {
    if (!isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl))
    }
    if (onboardingCompleted) {
        return Response.redirect(new URL("/dashboard", req.nextUrl))
    }
    return
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
}
