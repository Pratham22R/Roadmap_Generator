"use client"

import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const pricing = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started.",
        features: [
            "1 Roadmap per month",
            "Basic AI generation",
            "Access to community resources",
            "Progress tracking",
        ],
        highlight: false,
        button: "Get started free",
        href: "/login",
    },
    {
        name: "Pro",
        price: "$12",
        period: "/month",
        description: "For serious learners.",
        features: [
            "Unlimited roadmaps",
            "Priority AI processing",
            "Email functionality",
            "Advanced customization",
            "Export to PDF/Notion",
        ],
        highlight: true,
        button: "Upgrade to Pro",
        href: "/login",
    },
    {
        name: "Team",
        price: "$49",
        period: "/month",
        description: "For squads and classrooms.",
        features: [
            "Everything in Pro",
            "Shared workspaces",
            "Admin analytics",
            "Team billing",
            "Priority support",
        ],
        highlight: false,
        button: "Contact Sales",
        href: "mailto:sales@roadmapgenerator.com",
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Start for free, upgrade when you need more power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricing.map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                "relative p-8 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1",
                                plan.highlight
                                    ? "bg-white border-2 border-primary shadow-2xl ring-1 ring-primary/10"
                                    : "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary hover:bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={cn("text-xl font-bold", plan.highlight ? "text-primary" : "text-slate-900")}>
                                    {plan.name}
                                </h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                    {plan.period && <span className="text-slate-500 ml-1 font-medium">{plan.period}</span>}
                                </div>
                                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <div className={cn("mt-0.5 rounded-full p-0.5", plan.highlight ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600")}>
                                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <motion.div
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                variants={{
                                    rest: { scale: 1 },
                                    hover: { scale: 1 },
                                    tap: { scale: 0.98 }
                                }}
                            >
                                <Button
                                    asChild
                                    className={cn(
                                        "w-full h-12 rounded-xl font-medium transition-all relative overflow-hidden group",
                                        plan.highlight
                                            ? "shadow-lg shadow-primary/25 hover:shadow-primary/40"
                                            : ""
                                    )}
                                    variant={plan.highlight ? "default" : "outline"}
                                >
                                    <Link href={plan.href} className="flex items-center justify-center gap-2">
                                        {/* Shimmer effect for highlighted plan - Continuous */}
                                        {plan.highlight && (
                                            <motion.div
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "200%" }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 3,
                                                    repeatDelay: 1,
                                                    ease: "linear",
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
                                            />
                                        )}

                                        <span className="relative z-20">{plan.button}</span>
                                        <motion.span
                                            variants={{
                                                rest: { x: 0 },
                                                hover: {
                                                    x: 5,
                                                    transition: {
                                                        duration: 0.4,
                                                        repeat: Infinity,
                                                        repeatType: "reverse",
                                                        ease: "easeInOut"
                                                    }
                                                }
                                            }}
                                            className="relative z-20"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.span>
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-slate-200 backdrop-blur-sm text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-default">
                        <span>Secured by</span>
                        <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="font-bold flex items-center gap-1 hover:text-black">
                            {/* Simple Polar Logo Concept or Text */}
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fillOpacity="0" /> {/* Fallback placeholder if no logo */}
                                <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.2" />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                            </svg>
                            Polar
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
