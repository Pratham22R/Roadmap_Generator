
import { AuthCard } from "@/components/auth/auth-card"
import { AuthVisual } from "@/components/auth/auth-visual"

export const runtime = "nodejs"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column - Auth Card */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[460px] mx-auto lg:mr-20 lg:ml-auto">
          <AuthCard />
        </div>
      </div>

      {/* Right Column - Visual Panel */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-slate-50 items-center justify-center">
        <AuthVisual />
      </div>
    </div>
  )
}
