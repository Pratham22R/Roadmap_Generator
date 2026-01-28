export function SocialProof() {
    return (
        <div className="mt-24 flex flex-col items-center gap-8 text-center">
            <p className="text-sm font-semibold text-[#475569] uppercase tracking-wider">Trusted by learners worldwide</p>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                {/* Using text for now as placeholders for logos to match the design style without needing assets immediately */}
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">Google</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">GitHub</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">Notion</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">Stripe</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">OpenAI</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">Vercel</div>
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700">Linear</div>
            </div>
        </div>
    )
}
