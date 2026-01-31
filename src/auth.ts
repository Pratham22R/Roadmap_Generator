import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getPrisma } from "@/lib/prisma"
import { inngest } from "@/lib/inngest/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const {
  handlers,
  auth,
  signIn,
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
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ token, session }) {
        // console.log("SESSION CALLBACK", { tokenSub: token.sub, sessionUser: session.user?.email })
        if (token.sub && session.user) {
          session.user.id = token.sub
          session.user.onboardingCompleted = token.onboardingCompleted as boolean
          session.user.role = token.role as "ADMIN" | "USER"
        }
        return session
      },
      async jwt({ token, user, trigger, session }) {
        if (user) {
          // console.log("JWT CALLBACK - LOGIN", { userId: user.id, email: user.email })
          token.id = user.id
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token.onboardingCompleted = (user as any).onboardingCompleted
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    pages: {
      signIn: "/login",
    },
  }
})
