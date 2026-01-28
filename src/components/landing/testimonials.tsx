"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

const testimonials = [
    {
        name: "Alex Chen",
        role: "Frontend Developer",
        content: "This roadmap generator replaced months of confusion with one clean plan.",
        avatar: "/avatars/alex.jpg",
        // Random rotation and offset for scatter effect
        className: "md:rotate-[-6deg] md:translate-y-8 md:-translate-x-4 z-10"
    },
    {
        name: "Sarah Miller",
        role: "CS Student",
        content: "The curated resources are a game changer. No more 20-tab browser chaos.",
        avatar: "/avatars/sarah.jpg",
        className: "md:rotate-[4deg] md:-translate-y-2 md:translate-x-2 z-20"
    },
    {
        name: "James Wilson",
        role: "Career Switcher",
        content: "I went from zero coding knowledge to building my first app in 2 months.",
        avatar: "/avatars/james.jpg",
        className: "md:rotate-[-3deg] md:translate-y-4 md:translate-x-6 z-10"
    },
    {
        name: "Emma Davis",
        role: "Product Manager",
        content: "Helped me understand the technical stack my team uses. Invaluable tool.",
        avatar: "/avatars/emma.jpg",
        className: "md:rotate-[5deg] md:-translate-y-6 md:-translate-x-2 z-30"
    },
    {
        name: "Michael Brown",
        role: "Backend Dev",
        content: "The backend roadmaps are surprisingly deep and accurate. Highly recommend.",
        avatar: "/avatars/michael.jpg",
        className: "md:rotate-[-5deg] md:translate-y-2 md:-translate-x-5 z-20"
    },
    {
        name: "Lisa Wang",
        role: "UX Designer",
        content: "Finally a roadmap that includes design systems and accessibility properly.",
        avatar: "/avatars/lisa.jpg",
        className: "md:rotate-[3deg] md:-translate-y-4 md:translate-x-4 z-10"
    }
]

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        What they say about us
                    </h2>
                </div>

                {/* 
            Container Group
            - Hovering over this container triggers the grid layout state 
        */}
                <motion.div
                    className="group grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative min-h-[400px] content-center"
                    initial="scattered"
                    whileHover="grid"
                    animate="scattered"
                >
                    {testimonials.map((testimonial, i) => {
                        // Define specific random-looking scatter values for each index
                        // to replicate the "organic pile" look
                        const userScatterVariants: Variants = {
                            scattered: [
                                { rotate: -6, x: -10, y: 20 },  // Card 0
                                { rotate: 4, x: 5, y: -15 },    // Card 1
                                { rotate: -3, x: 15, y: 10 },   // Card 2
                                { rotate: 5, x: -5, y: -25 },   // Card 3
                                { rotate: -5, x: -20, y: 5 },   // Card 4
                                { rotate: 3, x: 10, y: 15 }     // Card 5
                            ][i] || { rotate: 0, x: 0, y: 0 },

                            grid: {
                                rotate: 0,
                                x: 0,
                                y: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 25
                                }
                            }
                        }

                        return (
                            <motion.div
                                key={i}
                                variants={userScatterVariants}
                                className={cn(
                                    "p-6 rounded-2xl bg-white border border-slate-200 shadow-xl md:shadow-md transition-colors duration-300",
                                    "flex flex-col justify-between h-auto min-h-[180px]",
                                    "hover:border-slate-300" // Subtle highlight in grid mode
                                )}
                                style={{
                                    zIndex: i % 2 === 0 ? 10 : 20,
                                    transformOrigin: "center center"
                                }}
                            >
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-[#475569] mb-6 text-sm leading-relaxed font-medium">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-slate-100">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-[#0f172a] text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-[#64748b]">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
