
"use client" // Client component for Framer Motion

import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

// SVGs for technology logos (reused subset + consistent styling)
export const TechIcons: Record<string, React.JSX.Element> = {
    React: (<svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#087ea4] opacity-80"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>),
    Nextjs: (<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-black opacity-80"><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="currentColor" /><path d="M115 54H127V125.97H115V54Z" fill="currentColor" /></svg>),
    Typescript: (<svg viewBox="0 0 128 128" className="w-full h-full opacity-80"><path fill="#007ACC" d="M0 0h128v128H0z" /><path fill="#FFF" d="M71.4 78c-1.6-1.5-2.2-3.6-2.2-6.5v-.5h-15v.8c0 7.8 2 12.3 8.3 14.8 5.6 2.2 24.3 3.6 22 13.9-1.2 5.5-5.9 8.2-12.7 8.2-13.8 0-14.8-10.4-15-12h-15c.3 7 3.5 16.3 14.7 20.3 5.4 1.9 11.2 2 15.6 2 9.4 0 20.6-2.8 23.3-13.4 2.8-10.8-3.4-16.7-10.5-19.1-8.5-2.8-16.4-3.5-17.2-9-1.1-6.8 6.5-7.7 11.2-7.7 5.8 0 10.3 1.2 11.4 9.1h14.8c-1.3-13.3-10-19.4-24.8-19.4-10.8 0-19.3 5.1-23.9 13.7zM24.8 66h15.2v25.3c0 10.6 5.8 16.7 14.7 16.7 15.5 0 13.5-18 13.5-18V66h15.2v25.2c0 10-1 16-6.3 21-6.2 5.7-16 5.7-22.1 5.7-9.5 0-18.4-2.8-23-10-4.5-7-7.2-17.6-7.2-28.5V66z" /></svg>),
    Tailwind: (<svg viewBox="0 0 24 24" className="w-full h-full text-[#38bdf8] opacity-80" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" /></svg>),
    Node: (<svg viewBox="0 0 32 32" className="w-full h-full text-[#339933] opacity-80" fill="currentColor"><path d="M0 0h32v32H0V0z" fill="none" /><path d="M16 3c-1.5 0-2.8.8-3.5 2.1l-6.3 11c-.7 1.2-.7 2.7 0 3.9l6.3 11c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2.1l6.3-11c.7-1.2.7-2.7 0-3.9l-6.3-11C18.8 3.8 17.5 3 16 3zm0 2.2c.4 0 .7.2.9.5l6.3 11c.2.4.2.8 0 1.2l-6.3 11c-.2.4-.5.5-.9.5s-.7-.2-.9-.5l-6.3-11c-.2-.4-.2-.8 0-1.2l6.3-11c.2-.3.5-.5.9-.5zM16 11c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" /></svg>),
    Prisma: (<svg viewBox="0 0 24 24" className="w-full h-full text-[#142d3e] opacity-80" fill="currentColor"><path d="M12 2l-9.5 16h19L12 2zm0 4.14L16.62 16H7.38L12 6.14z" /></svg>),
    Github: (<svg viewBox="0 0 24 24" className="w-full h-full text-black opacity-80" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>),
    Globe: (<svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 opacity-80" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>),
};

const gridLayout = [
    // Row 0
    "Typescript", null, "Tailwind", null, "Nextjs",
    // Row 1
    null, "Prisma", null, "Github", null,
    // Row 2
    "React", null, "CENTER", null, "Node",
    // Row 3 (Mirrored-ish for balance)
    null, "Github", null, "Prisma", null,
    // Row 4
    "Nextjs", null, "Tailwind", null, "Typescript"
];

export function AuthVisual() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f5f7ff_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#fdf2f8_0%,transparent_55%)]" />

            {/* Decorative Floating Blobs */}
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-[64px] opacity-40"
            />
            <motion.div
                animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-20 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-[64px] opacity-40"
            />

            {/* Grid Container */}
            <motion.div
                className="grid grid-cols-5 gap-6 p-10 relative z-10"
                style={{
                    maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                    transform: "scale(1.1) rotate(-5deg)" // Slight tilt for dynamism
                }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {gridLayout.map((techName, i) => {
                    const isCenter = techName === "CENTER";
                    const isEmpty = !techName;

                    if (isCenter) {
                        return (
                            <div key={i} className="w-20 h-20 rounded-2xl bg-black shadow-2xl flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">R</span>
                            </div>
                        )
                    }

                    if (isEmpty) {
                        return <div key={i} className="w-20 h-20" /> // Empty space
                    }

                    const Icon = TechIcons[techName] || TechIcons["Globe"];

                    return (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="w-20 h-20 rounded-[20px] bg-slate-50/50 backdrop-blur-sm border border-white/40 shadow-sm flex items-center justify-center p-5"
                        >
                            {Icon}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    )
}
