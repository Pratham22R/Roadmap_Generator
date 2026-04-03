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
          return true
        }
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
    async session({ token, session }: { token: any, session: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
        session.user.role = token.role as "ADMIN" | "USER"
      }
      return session
    },
    async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: any, session?: any }) {
      if (user) {
        token.id = user.id
        token.onboardingCompleted = (user as any).onboardingCompleted
        token.role = (user as any).role
      }

      // Update token if session is updated (e.g. usage in client update)
      if (trigger === "update" && session?.user) {
        token.onboardingCompleted = session.user.onboardingCompleted
        token.role = session.user.role
      }
      return token
    },
  },
} satisfies NextAuthConfig
