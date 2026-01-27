import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getPrisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const {
  handlers,
  auth,
  signIn,
// @ts-expect-error - PrismaAdapter vs AdapterUser type mismatch request
} = NextAuth(() => {
  return {
    adapter: PrismaAdapter(getPrisma()),
    providers: [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      }),
      Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub
          session.user.onboardingCompleted = token.onboardingCompleted as boolean
        }
        return session
      },
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user.id
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token.onboardingCompleted = (user as any).onboardingCompleted
        }

        // Update token if session is updated (e.g. usage in client update)
        if (trigger === "update" && session?.user) {
            token.onboardingCompleted = session.user.onboardingCompleted
        }
        return token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
})
