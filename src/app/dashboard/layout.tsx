export const runtime = "nodejs"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar will go here */}
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}
