"use client"
export const runtime = "nodejs"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitOnboarding } from "@/actions/onboarding"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function OnboardingPage() {
  const router = useRouter()
  const { update } = useSession()
  const [loading, setLoading] = useState(false)
  
  // Basic form state
  const [formData, setFormData] = useState({
    careerGoal: "",
    experienceLevel: "",
    dailyTime: "",
    targetDuration: "",
  })
  const [skills, setSkills] = useState("")

  const handleSubmit = async () => {
    if (!formData.careerGoal || !formData.experienceLevel) {
        toast.error("Please fill in all required fields")
        return
    }

    setLoading(true)
    try {
        const result = await submitOnboarding({
            ...formData,
            currentSkills: skills.split(",").map(s => s.trim()).filter(s => s.length > 0)
        })

        if (result.success) {
            toast.success("Profile updated!")
            // Update session data to reflect onboardingCompleted: true
            await update({ onboardingCompleted: true })
            
            router.refresh()
            router.push("/dashboard")
        } else {
            toast.error("Something went wrong. Please try again.")
        }
    } catch (error) {
        console.error(error)
        toast.error("An unexpected error occurred")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/50 text-zinc-100 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Customize Your Journey</CardTitle>
          <CardDescription className="text-zinc-400">
            Let's personalize the roadmap generator for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="careerGoal">What is your main Career Goal?</Label>
                <Input 
                    id="careerGoal" 
                    placeholder="e.g. Full Stack Developer, Data Scientist" 
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({...formData, careerGoal: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="experience">Current Experience Level</Label>
                <Select 
                    onValueChange={(val) => setFormData({...formData, experienceLevel: val})}
                >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BEGINNER">Beginner (New to this)</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate (Some knowledge)</SelectItem>
                        <SelectItem value="ADVANCED">Advanced (Looking to master)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="skills">Current Skills (comma separated)</Label>
                <Input 
                    id="skills" 
                    placeholder="e.g. HTML, CSS, JavaScript" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="dailyTime">Daily Learning Time</Label>
                    <Select 
                        onValueChange={(val) => setFormData({...formData, dailyTime: val})}
                    >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30 mins">30 mins</SelectItem>
                            <SelectItem value="1 hour">1 hour</SelectItem>
                            <SelectItem value="2 hours">2 hours</SelectItem>
                            <SelectItem value="4+ hours">4+ hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="duration">Target Duration</Label>
                    <Select 
                         onValueChange={(val) => setFormData({...formData, targetDuration: val})}
                    >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1 month">1 month</SelectItem>
                            <SelectItem value="3 months">3 months</SelectItem>
                            <SelectItem value="6 months">6 months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving Profile..." : "Create Profile & Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
