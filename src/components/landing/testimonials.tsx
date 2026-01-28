import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
    {
        name: "Alex Chen",
        role: "Frontend Developer",
        content: "This roadmap generator replaced months of confusion with one clean plan. I finally learned React properly.",
        avatar: "/avatars/alex.jpg",
    },
    {
        name: "Sarah Miller",
        role: "CS Student",
        content: "The curated resources are a game changer. No more 20-tab browser chaos searching for good tutorials.",
        avatar: "/avatars/sarah.jpg",
    },
    {
        name: "James Wilson",
        role: "Career Switcher",
        content: "I went from zero coding knowledge to building my first app in 2 months thanks to the structured path.",
        avatar: "/avatars/james.jpg",
    },
]

export function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        Loved by learners
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg text-[#475569] mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-slate-200">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback className="bg-slate-100 text-slate-600">{testimonial.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-[#0f172a]">{testimonial.name}</div>
                                    <div className="text-xs text-[#64748b]">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
