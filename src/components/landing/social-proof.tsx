import { TechIcons } from "./technology-grid"

export function SocialProof() {
    const technologies = [
        "React",
        "TypeScript",
        "Tailwind",
        "Prisma",
        "Inngest",
        "Google",
        "Vercel",
        "Polar"
    ]

    // Duplicate list for seamless infinite scroll
    const marqueeList = [...technologies, ...technologies, ...technologies]

    return (
        <div className="mt-16 flex flex-col items-center gap-8 text-center w-full">
            <p className="text-sm font-semibold text-[#475569] uppercase tracking-wider">Built with modern technology</p>

            {/* Container: 2/3 width (approx 66%) or max-w-4xl for larger screens */}
            <div className="relative w-full md:w-2/3 max-w-[900px] overflow-hidden mask-gradient-x">
                {/* Fade Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Marquee Track */}
                <div className="flex animate-marquee hover:[animation-play-state:paused] gap-12 w-max">
                    {marqueeList.map((tech, index) => (
                        <div key={`${tech}-${index}`} className="group relative flex flex-col items-center justify-center p-2 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0">
                            <div className="h-8 w-8 md:h-10 md:w-10" title={tech}>
                                {TechIcons[tech]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Move 1/3 of the duplicated list */
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    )
}
