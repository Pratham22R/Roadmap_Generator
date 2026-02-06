'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { submitOnboarding } from "@/actions/onboarding"
import { ArrowRight, ChevronLeft, Check, X, Briefcase, Zap, Clock, Calendar, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function OnboardingFlow({ userId, careerRoles = [] }: { userId?: string, careerRoles?: { label: string, value: string }[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    careerGoal: "",
    currentSkills: [] as string[],
    experienceLevel: "",
    dailyTime: "",
    targetDuration: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customRole, setCustomRole] = useState("")

  const totalSteps = 3

  const handleNext = () => {
    if (isSubmitting) return
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (isSubmitting) return
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await submitOnboarding({
        ...formData,
        experienceLevel: formData.experienceLevel || "BEGINNER",
        dailyTime: formData.dailyTime || "1 hour",
        targetDuration: formData.targetDuration || "3 months"
      })

      if (result.success && result.roadmapId) {
        router.push(`/dashboard/roadmap/${result.roadmapId}`)
      } else {
        // Handle error (optional: show toast)
        console.error("Onboarding failed", result.error)
        setIsSubmitting(false)
      }
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
    }
  }

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  }

  // --- UI COMPONENTS ---

  const StepIndicator = () => (
    <div className="flex items-center gap-3 mb-4 justify-center">
      {[1, 2, 3].map((s) => (
        <motion.div
          key={s}
          className={cn(
            "h-2.5 rounded-full transition-all duration-500",
            step === s ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30",
            step > s ? "bg-primary/40" : ""
          )}
          layout
        />
      ))}
    </div>
  )

  const SelectionCard = ({
    active,
    onClick,
    title,
    subtitle,
    icon: Icon,
    disabled
  }: {
    active: boolean,
    onClick: () => void,
    title: string,
    subtitle?: string,
    icon?: any,
    disabled?: boolean
  }) => (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 border-2",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        active
          ? "border-primary bg-primary/5 shadow-md"
          : !disabled && "border-transparent bg-secondary/40 hover:bg-secondary/70 hover:scale-[1.01]"
      )}
    >
      <div className={cn(
        "mt-1 p-2 rounded-lg transition-colors",
        active ? "bg-primary text-white" : "bg-background text-muted-foreground group-hover:text-foreground"
      )}>
        {Icon ? <Icon className="h-5 w-5" /> : <div className="h-5 w-5" />}
      </div>

      <div className="flex-1 text-left">
        <h3 className={cn("font-bold text-lg", active ? "text-primary" : "text-foreground")}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-5 right-5 text-primary"
        >
          <Check className="h-6 w-6" />
        </motion.div>
      )}
    </div>
  )

  const PillOption = ({ active, onClick, label, disabled }: { active: boolean, onClick: () => void, label: string, disabled?: boolean }) => (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 border-2",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-md transform scale-105"
          : !disabled && "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {label}
    </button>
  )

  // --- STEPS CONTENT ---

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center p-6 relative">

      {/* Header Controls */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          href={isSubmitting ? "#" : "/dashboard"}
          className={cn(
            "p-3 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border shadow-sm block",
            isSubmitting && "opacity-50 pointer-events-none cursor-not-allowed"
          )}
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-8 flex flex-col items-center justify-center">
        <StepIndicator />

        <div className="w-full">
          <AnimatePresence mode="wait">

            {/* STEP 1: CAREER GOAL */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 text-center"
              >
                <div className="space-y-4 max-w-xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    What is your goal?
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium">
                    Choose a path to start your personalized roadmap.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  {careerRoles.map((role, idx) => (
                    <motion.div key={role.value} custom={idx} variants={cardVariants} initial="hidden" animate="visible">
                      <SelectionCard
                        active={formData.careerGoal === role.value}
                        onClick={() => {
                          setFormData({ ...formData, careerGoal: role.value })
                          setCustomRole("")
                        }}
                        title={role.label}
                        subtitle="Career Path"
                        icon={Briefcase}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  ))}

                  {/* Custom Role Input */}
                  <motion.div custom={careerRoles.length} variants={cardVariants} initial="hidden" animate="visible" className="md:col-span-2 mt-2">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Or type a specific role (e.g. 'DevOps Engineer')"
                        className={cn(
                          "pl-12 h-16 text-lg rounded-2xl border-2 transition-all shadow-sm bg-secondary/20",
                          isSubmitting && "opacity-50 cursor-not-allowed",
                          customRole || (formData.careerGoal && !careerRoles.find(r => r.value === formData.careerGoal))
                            ? "border-primary ring-offset-0 focus-visible:ring-0 bg-primary/5"
                            : "border-transparent hover:bg-secondary/40 focus-visible:border-primary focus-visible:ring-0"
                        )}
                        value={customRole}
                        onChange={(e) => {
                          setCustomRole(e.target.value)
                          setFormData({ ...formData, careerGoal: e.target.value })
                        }}
                        onFocus={() => {
                          if (customRole) setFormData({ ...formData, careerGoal: customRole })
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: EXPERIENCE */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 text-center"
              >
                <div className="space-y-4 max-w-xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Your experience?
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium">
                    We'll tailor the complexity to match your level.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                  <SelectionCard
                    active={formData.experienceLevel === 'BEGINNER'}
                    onClick={() => setFormData({ ...formData, experienceLevel: 'BEGINNER' })}
                    title="Beginner"
                    subtitle="I'm just starting out. I need fundamentals."
                    icon={Zap}
                    disabled={isSubmitting}
                  />
                  <SelectionCard
                    active={formData.experienceLevel === 'INTERMEDIATE'}
                    onClick={() => setFormData({ ...formData, experienceLevel: 'INTERMEDIATE' })}
                    title="Intermediate"
                    subtitle="I have built projects. Show me advanced concepts."
                    icon={Zap}
                    disabled={isSubmitting}
                  />
                  <SelectionCard
                    active={formData.experienceLevel === 'ADVANCED'}
                    onClick={() => setFormData({ ...formData, experienceLevel: 'ADVANCED' })}
                    title="Advanced"
                    subtitle="I want mastery, architecture, and best practices."
                    icon={Zap}
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: COMMITMENT */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-12 text-center"
              >
                <div className="space-y-4 max-w-xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Your Commitment
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium">
                    Consistency beats intensity. Set a realistic pace.
                  </p>
                </div>

                <div className="space-y-10 max-w-2xl mx-auto w-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-wider">Daily Time</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['30 mins', '1 hour', '2 hours', '4+ hours'].map(time => (
                        <PillOption
                          key={time}
                          label={time}
                          active={formData.dailyTime === time}
                          onClick={() => setFormData({ ...formData, dailyTime: time })}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border max-w-xs mx-auto" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-wider">Target Duration</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['1 month', '3 months', '6 months'].map(dur => (
                        <PillOption
                          key={dur}
                          label={dur}
                          active={formData.targetDuration === dur}
                          onClick={() => setFormData({ ...formData, targetDuration: dur })}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}



          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-background via-background to-transparent z-40 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center pointer-events-auto">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBack}
            disabled={isSubmitting}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-all rounded-full px-6",
              step === 1 ? "opacity-0 pointer-events-none" : "opacity-100",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back
          </Button>

          {step < totalSteps ? (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.careerGoal) ||
                (step === 2 && !formData.experienceLevel) ||
                isSubmitting
              }
              className={cn(
                "rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/25 transition-all hover:scale-105",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.dailyTime || !formData.targetDuration}
              className="rounded-full px-10 py-6 text-lg shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 bg-primary text-primary-foreground"
            >
              {isSubmitting ? "Generating..." : "Create Roadmap"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
