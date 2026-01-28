"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Preview", href: "#preview" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Only show navbar on landing page (root)
  if (pathname !== "/") {
    return null;
  }

  // The premium floating pill layout
  return (
    <div className="flex justify-center w-full fixed top-0 left-0 right-0 z-50 px-4 pt-[28px]">
      <header
        className={cn(
          "w-full max-w-[1150px] h-[70px] bg-white rounded-[20px] flex items-center justify-between px-6 transition-all duration-300",
          "shadow-[0px_8px_24px_rgba(0,0,0,0.06),0px_2px_6px_rgba(0,0,0,0.04)]"
        )}
      >
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
            R
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0f172a]">
            RoadmapAI
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-[15px] font-medium text-[#0f172a] hover:bg-transparent hover:text-black/70 px-2 h-10"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/login">
            <Button
              className="h-[40px] rounded-[10px] px-5 bg-black text-white font-medium hover:scale-[1.02] hover:bg-black/90 transition-all shadow-md"
            >
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#0f172a]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-4 right-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-xl animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-[#475569] hover:text-[#0f172a]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-black text-white rounded-xl h-12 text-base">Get started</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  )
}
