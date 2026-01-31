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
import { Loader2, ArrowLeft } from "lucide-react"
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
  const [errors, setErrors] = useState({
    careerGoal: "",
    experienceLevel: "",
    dailyTime: "",
    targetDuration: "",
    skills: "",
  })

  const handleSubmit = async () => {
    const newErrors = {
      careerGoal: !formData.careerGoal ? "Career goal is required" : "",
      experienceLevel: !formData.experienceLevel ? "Experience level is required" : "",
      dailyTime: !formData.dailyTime ? "Daily time is required" : "",
      targetDuration: !formData.targetDuration ? "Target duration is required" : "",
      skills: !skills.trim() ? "At least one skill is required" : "",
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors)
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center pt-2">Customize Your Journey</CardTitle>
          <CardDescription className="text-center">
            Let's personalize the roadmap generator for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="careerGoal" className={errors.careerGoal ? "text-destructive" : ""}>What is your main Career Goal?</Label>
            <Input
              id="careerGoal"
              placeholder="e.g. Full Stack Developer, Data Scientist"
              value={formData.careerGoal}
              onChange={(e) => {
                setFormData({ ...formData, careerGoal: e.target.value })
                if (errors.careerGoal) setErrors({ ...errors, careerGoal: "" })
              }}
              className={errors.careerGoal ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.careerGoal && <p className="text-sm text-destructive">{errors.careerGoal}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className={errors.experienceLevel ? "text-destructive" : ""}>Current Experience Level</Label>
            <Select
              onValueChange={(val) => {
                setFormData({ ...formData, experienceLevel: val })
                if (errors.experienceLevel) setErrors({ ...errors, experienceLevel: "" })
              }}
            >
              <SelectTrigger className={errors.experienceLevel ? "border-destructive focus:ring-destructive" : ""}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner (New to this)</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate (Some knowledge)</SelectItem>
                <SelectItem value="ADVANCED">Advanced (Looking to master)</SelectItem>
              </SelectContent>
            </Select>
            {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className={errors.skills ? "text-destructive" : ""}>Current Skills (comma separated)</Label>
            <Input
              id="skills"
              placeholder="e.g. HTML, CSS, JavaScript"
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value)
                if (errors.skills) setErrors({ ...errors, skills: "" })
              }}
              className={errors.skills ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyTime" className={errors.dailyTime ? "text-destructive" : ""}>Daily Learning Time</Label>
              <Select
                onValueChange={(val) => {
                  setFormData({ ...formData, dailyTime: val })
                  if (errors.dailyTime) setErrors({ ...errors, dailyTime: "" })
                }}
              >
                <SelectTrigger className={errors.dailyTime ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 mins">30 mins</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="4+ hours">4+ hours</SelectItem>
                </SelectContent>
              </Select>
              {errors.dailyTime && <p className="text-sm text-destructive">{errors.dailyTime}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className={errors.targetDuration ? "text-destructive" : ""}>Target Duration</Label>
              <Select
                onValueChange={(val) => {
                  setFormData({ ...formData, targetDuration: val })
                  if (errors.targetDuration) setErrors({ ...errors, targetDuration: "" })
                }}
              >
                <SelectTrigger className={errors.targetDuration ? "border-destructive focus:ring-destructive" : ""}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                </SelectContent>
              </Select>
              {errors.targetDuration && <p className="text-sm text-destructive">{errors.targetDuration}</p>}
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button
            className="w-full cursor-pointer"
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
