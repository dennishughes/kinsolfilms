"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface HeaderProps {
    siteTitle?: string
    siteLogo?: string
}

export function Header({ siteTitle, siteLogo }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Prevent scrolling when the menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isMobileMenuOpen])

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const closeMenu = () => setIsMobileMenuOpen(false)

    return (
        <header className="bg-slate-800 text-white relative z-50 border-b border-black">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 relative z-50" onClick={closeMenu}>
                        <Image
                            src={siteLogo || "/empress-avenue-logo.png"}
                            alt={siteTitle || "Empress Avenue Media"}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                        <span className="text-xl font-light tracking-wide text-white">
                            {siteTitle ? siteTitle.toLowerCase() : "empress avenue media"}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 text-sm">
                        <Link href="/" className="hover:text-slate-300 transition-colors">
                            home
                        </Link>
                        <Link href="/work" className="hover:text-slate-300 transition-colors">
                            work
                        </Link>
                        <Link href="/services" className="hover:text-slate-300 transition-colors">
                            services
                        </Link>
                        <Link href="/about" className="hover:text-slate-300 transition-colors">
                            about
                        </Link>
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="md:hidden text-white focus:outline-none relative z-50 p-2 -mr-2"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Slide-out Menu Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900 z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8 text-2xl font-light ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <Link href="/" className="hover:text-slate-300 transition-colors" onClick={closeMenu}>
                    Home
                </Link>
                <Link href="/work" className="hover:text-slate-300 transition-colors" onClick={closeMenu}>
                    Work
                </Link>
                <Link href="/about" className="hover:text-slate-300 transition-colors" onClick={closeMenu}>
                    About
                </Link>
                <Link href="/services" className="hover:text-slate-300 transition-colors" onClick={closeMenu}>
                    Services
                </Link>
            </div>
        </header>
    )
}
