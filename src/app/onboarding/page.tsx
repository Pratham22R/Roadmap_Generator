import { auth } from "@/auth"
import { redirect } from "next/navigation"
import OnboardingFlow from "@/components/onboarding/onboarding-flow"
import { getPrisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch active career roles
  const prisma = getPrisma()
  const careerRoles = await prisma.careerRole.findMany({
    where: { isActive: true },
    select: { id: true, title: true }
  })

  // We map them to a simple structure to pass to the client component
  const rolesForClient = careerRoles.map(r => ({ label: r.title, value: r.title }))

  return (
    <OnboardingFlow userId={session?.user?.id} careerRoles={rolesForClient} />
  )
}
