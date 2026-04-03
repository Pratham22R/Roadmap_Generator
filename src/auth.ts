import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getPrisma } from "@/lib/prisma"
import { inngest } from "@/lib/inngest/client"
import { authConfig } from "./auth.config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const {
  handlers,
  auth,
  signIn,
} = NextAuth(() => {
  return {
    ...authConfig,
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
  }
})
