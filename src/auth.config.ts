import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) {
             // If logged in but onboarding not complete, allow access ONLY if checking something specific?
             // Actually, the requirement: If No -> Redirect to onboarding.
             // We can return Response.redirect here? No, authorized returns boolean.
             // Middleware handles the redirects based on boolean.
             // But simple boolean isn't enough for conditional redirect.
             // However, `authorized` can strictly return false to trigger login, or true to allow.
             // To redirect to /onboarding, we might need to handle it in middleware.ts logic,
             // OR use logic here.
             return true
        }
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
} satisfies NextAuthConfig
