import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-black text-white rounded-[6px] flex items-center justify-center text-xs font-bold">R</div>
            <span className="font-bold text-lg tracking-tight text-[#0f172a]">RoadmapGen</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-[#64748b]">
            <Link href="#" className="hover:text-[#0f172a] transition-colors">Products</Link>
            <Link href="#" className="hover:text-[#0f172a] transition-colors">Features</Link>
            <Link href="#" className="hover:text-[#0f172a] transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-[#0f172a] transition-colors">Changelog</Link>
            <Link href="#" className="hover:text-[#0f172a] transition-colors">Docs</Link>
          </div>

          <div className="flex gap-4">
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#94a3b8]">
          <div>© {new Date().getFullYear()} Roadmap Generator. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#475569] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#475569] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
