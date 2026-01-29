import Link from "next/link"
import { Github, Twitter, Linkedin, HelpCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Changelog", href: "/changelog" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Community", href: "/community" },
      { label: "Help Center", href: "/help" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ]
  }

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container mx-auto px-6 max-w-[1200px]">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-slate-200 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">
                R
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">RoadmapGen</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Turn your ideas into clear, actionable product roadmaps in seconds. Built for developers, designed for shipping.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <SocialLink href="https://twitter.com" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <SocialLink href="https://github.com" icon={<Github className="h-4 w-4" />} label="GitHub" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Product</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Company</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © {currentYear} Roadmap Generator. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-slate-900 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-slate-500 hover:text-blue-600 transition-colors duration-200 text-sm font-medium block hover:translate-x-0.5 transform"
      >
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-black transition-all duration-200 border border-slate-100 hover:border-slate-200"
      aria-label={label}
    >
      {icon}
    </Link>
  )
}
