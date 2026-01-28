import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-[#f8fafc]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-[#475569] text-lg">
                        Start for free, upgrade when you need more power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricing.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-8 rounded-2xl bg-white border ${plan.highlight ? 'border-black ring-1 ring-black shadow-xl' : 'border-slate-200 shadow-sm'} flex flex-col`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-[#0f172a]">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-[#0f172a]">{plan.price}</span>
                                    {plan.period && <span className="text-[#64748b] ml-1">{plan.period}</span>}
                                </div>
                                <p className="text-[#475569] mt-2 text-sm">{plan.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-[#0f172a] shrink-0" />
                                        <span className="text-[#475569] text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full h-12 rounded-xl font-medium ${plan.highlight ? 'bg-black text-white hover:bg-black/90' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-slate-200'}`}
                            >
                                {plan.button}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
