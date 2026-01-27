'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitOnboarding } from "@/actions/onboarding"
import { Label } from "@/components/ui/label"
import { RocketIcon, CheckIcon } from "lucide-react"

export default function OnboardingFlow({ userId }: { userId?: string }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    careerGoal: "",
    currentSkills: [] as string[],
    experienceLevel: "BEGINNER",
    dailyTime: "1 hour",
    targetDuration: "3 months"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await submitOnboarding(formData) // Will redirect or handle response
  }

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/80 backdrop-blur-xl text-zinc-100">
      <CardHeader>
        <CardTitle>Let's personalize your journey</CardTitle>
        <CardDescription>Step {step} of 3</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-2">
            <Label htmlFor="careerGoal">What is your dream career role?</Label>
            <Input 
              id="careerGoal"
              placeholder="e.g. Full Stack Developer, AI Engineer" 
              value={formData.careerGoal}
              onChange={(e) => setFormData({...formData, careerGoal: e.target.value})}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label>What is your current experience level?</Label>
            <div className="grid grid-cols-1 gap-2">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                <div 
                  key={level}
                  onClick={() => setFormData({...formData, experienceLevel: level})}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.experienceLevel === level 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{level}</span>
                    {formData.experienceLevel === level && <CheckIcon className="h-4 w-4 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
             <div className="space-y-2">
              <Label>How much time can you dedicate daily?</Label>
              <select 
                title="Daily Time"
                value={formData.dailyTime}
                onChange={(e) => setFormData({...formData, dailyTime: e.target.value})}
                className="w-full p-2 h-10 rounded-md border border-zinc-700 bg-zinc-800 text-sm"
              >
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="4+ hours">4+ hours</option>
              </select>
            </div>
             <div className="space-y-2">
              <Label>Target Duration</Label>
               <select 
                title="Target Duration"
                value={formData.targetDuration}
                onChange={(e) => setFormData({...formData, targetDuration: e.target.value})}
                className="w-full p-2 h-10 rounded-md border border-zinc-700 bg-zinc-800 text-sm"
              >
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
              </select>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting}>
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext} disabled={!formData.careerGoal}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Generating Roadmap..." : "Generate Roadmap"} <RocketIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
