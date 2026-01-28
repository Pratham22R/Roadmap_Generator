"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useAnimation, Variants } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function CTASection() {
    const [hasHovered, setHasHovered] = useState(false)
    const controls = useAnimation()

    const handleHover = async () => {
        if (!hasHovered) {
            setHasHovered(true)
            await controls.start("visible")
        }
    }

    // --- Variants ---

    const drawLineVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (custom: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                delay: custom,
                duration: 1.5,
                ease: "easeInOut"
            }
        })
    }

    const itemVariants: Variants = {
        hidden: { scale: 0, opacity: 0 },
        visible: (custom: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: custom,
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        })
    }

    // --- Logos ---

    const ReactLogo = () => (
        <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#149ECA]">
            <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
            <g stroke="currentColor" strokeWidth="1" fill="none">
                <ellipse rx="10" ry="4.5"></ellipse>
                <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
                <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
            </g>
        </svg>
    )

    const InngestLogo = () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <rect width="24" height="24" rx="6" fill="#020817" />
            <path d="M6 8L12 11L18 8M6 16L12 13L18 16M12 13V20M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    const PythonLogo = () => (
        <svg viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid">
            <path d="M126.916.072c-24.808 0-47.336 10.553-62.864 27.452l-2.02 2.224H127.42v39.27H35.84C15.968 69.018 0 85.054 0 105.02v55.676h65.732v-17.76c0-23.708 19.324-43.088 42.924-43.088h42.128c11.028 0 19.96-8.98 19.96-20.06V38.68c0-21.28-17.092-38.608-38.272-38.608h-5.556zM88.764 26.548a9.42 9.42 0 0 1-9.42 9.42 9.42 9.42 0 0 1-9.42-9.42 9.42 9.42 0 0 1 9.42-9.42 9.42 9.42 0 0 1 9.42 9.42z" fill="#3776AB" />
            <path d="M129.5 254.912c24.812 0 47.336-10.552 62.864-27.452l2.02-2.224H129.004v-39.27h91.564c19.888 0 35.852-16.036 35.852-36.004v-55.676h-65.716v17.76c0 23.708-19.324 43.088-42.924 43.088h-42.144c-11.028 0-19.96 8.98-19.96 20.06v41.108c0 21.28 17.092 38.608 38.272 38.608h5.556zM167.652 228.368a9.42 9.42 0 0 1 9.42-9.42 9.42 9.42 0 0 1 9.42 9.42 9.42 9.42 0 0 1-9.42 9.42 9.42 9.42 0 0 1-9.42-9.42z" fill="#FFD43B" />
        </svg>
    )

    const SalesforceLogo = () => (
        <svg viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#00A1E0]">
            <path d="M16.8 4.7C16.3 2 13.9 0 11.1 0 8.6 0 6.4 1.6 5.6 4 2.5 4.3 0 7 0 10.2c0 3.4 2.7 6.1 6.1 6.1H17c3.9 0 7-3.1 7-7 0-3.6-2.6-6.6-6-7.1-.1 1.4-.2 2.5-.2 2.5z" fill="currentColor" />
        </svg>
    )

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div
                    className="relative rounded-[32px] bg-[#f8fafc] border border-slate-100 p-12 md:p-24 text-center overflow-hidden"
                    onMouseEnter={handleHover}
                >
                    {/* Background Noise/Grid */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

                    {/* --- LEFT SIDE ANIMATION (React -> Branch Split) --- */}
                    <div className="absolute left-0 top-0 bottom-0 w-[40%] md:w-[45%] pointer-events-none hidden md:block">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 650 400" preserveAspectRatio="none">
                            {/* Main Branch Line (Left part) */}
                            <motion.path
                                d="M 0,200 L 400,200" // Extended to align with bottom
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="10 10"
                                variants={drawLineVariants}
                                custom={0}
                                initial="hidden"
                                animate={controls}
                            />
                            {/* Feature Branch Diverge (Bottom) */}
                            <motion.path
                                d="M 120,200 C 150,200 150,280 180,280 L 400,280" // Aligns vertically with Main at x=400
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                variants={drawLineVariants}
                                custom={0.5}
                                initial="hidden"
                                animate={controls}
                            />
                            {/* Feature Branch Diverge (Top - Python) */}
                            <motion.path
                                d="M 120,200 C 150,200 150,50 280,50 L 850,50" // Higher (y=50) and extended to logo (x=850)
                                fill="none"
                                stroke="#FFD43B" // Yellow-ish for Python
                                strokeWidth="3"
                                strokeLinecap="round"
                                variants={drawLineVariants}
                                custom={0.5}
                                initial="hidden"
                                animate={controls}
                            />
                        </svg>

                        {/* REACT LOGO (Start of Main Branch) */}
                        <motion.div
                            className="absolute left-[10%] top-[45%] w-12 h-12 bg-white rounded-full shadow-md p-1 border border-slate-100 z-10"
                            variants={itemVariants}
                            custom={0} // Pops in immediately/first
                            initial="hidden"
                            animate={controls}
                        >
                            <ReactLogo />
                        </motion.div>

                        {/* PYTHON LOGO (Top Branch) */}
                        <motion.div
                            className="absolute right-[-35%] top-[8%] w-10 h-10 bg-white rounded-lg shadow-sm p-1.5 border border-slate-100 z-10"
                            variants={itemVariants}
                            custom={1.2} // Pops in as top branch reaches end
                            initial="hidden"
                            animate={controls}
                        >
                            <PythonLogo />
                        </motion.div>
                    </div>

                    {/* --- RIGHT SIDE ANIMATION (Merge -> Ship) --- */}
                    <div className="absolute right-0 top-0 bottom-0 w-[20%] md:w-[30%] pointer-events-none hidden md:block">
                        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                            {/* Feature Branch Incoming */}
                            <motion.path
                                d="M 20,280 L 50,280 C 180,280 180,200 220,200"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                variants={drawLineVariants}
                                custom={1.8} // Delayed to appear as if coming from left
                                initial="hidden"
                                animate={controls}
                            />
                            {/* Main Branch Incoming & Merge destination */}
                            <motion.path
                                d="M 20,200 L 220,200 L 400,200"
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="10 10"
                                variants={drawLineVariants}
                                custom={1.5}
                                initial="hidden"
                                animate={controls}
                            />
                        </svg>

                        {/* INNGEST LOGO (On Feature Branch) */}
                        <motion.div
                            className="absolute left-[10%] top-[65%] w-10 h-10 shadow-sm z-10"
                            variants={itemVariants}
                            custom={1.8}
                            initial="hidden"
                            animate={controls}
                        >
                            <InngestLogo />
                        </motion.div>

                        {/* SALESFORCE (Merge Point) - Was Rocket */}
                        <motion.div
                            className="absolute left-[52%] top-[45%] w-14 h-14 bg-white rounded-lg shadow-md border border-slate-100 flex items-center justify-center z-10 p-2"
                            variants={itemVariants}
                            custom={2.5}
                            initial="hidden"
                            animate={controls}
                        >
                            <SalesforceLogo />
                        </motion.div>
                    </div>

                    {/* --- CENTER CONTENT --- */}
                    <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-8 bg-transparent">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a]">
                            Start building your roadmap today.
                        </h2>
                        <p className="text-lg text-[#475569] max-w-lg">
                            Join thousands of developers learning faster and smarter with AI-generated paths.
                        </p>

                        <Link href="/login">
                            <motion.div
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                variants={{
                                    rest: { scale: 1 },
                                    hover: { scale: 1.05 },
                                    tap: { scale: 0.95 }
                                }}
                            >
                                <Button className="relative h-[56px] px-8 text-lg font-medium bg-[#0f172a] text-white hover:bg-black/90 transition-all rounded-[14px] shadow-lg shadow-black/10 overflow-hidden group">
                                    {/* Shimmer Effect */}
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.5,
                                            ease: "linear",
                                            repeatDelay: 1
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                                    />

                                    <span className="relative z-10 flex items-center">
                                        Get Started for Free
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
                                        >
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </motion.span>
                                    </span>
                                </Button>
                            </motion.div>
                        </Link>

                        <p className="text-sm text-[#64748b]">No credit card required. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
