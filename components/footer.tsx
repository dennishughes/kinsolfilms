import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Video, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { FooterSubscribeForm } from "./footer-subscribe-form"
import { fetchEAMSettings } from "@/lib/graphql"

const iconMap: Record<string, LucideIcon> = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    linkedin: Linkedin,
    x: Twitter,
    vimeo: Video,
}

export async function Footer() {
    const settings = await fetchEAMSettings()
    const socialLinks = settings?.socialLinks || []
    return (
        <footer className="bg-slate-800 text-white py-8">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-6">
                    <FooterSubscribeForm />

                    <div className="flex space-x-4">
                        {socialLinks.length > 0 ? (
                            socialLinks.map((link, idx) => {
                                const Icon = link.socialIconKey ? iconMap[link.socialIconKey.toLowerCase()] : null
                                if (!Icon || !link.socialUrl) return null
                                return (
                                    <Link key={idx} href={link.socialUrl} aria-label={link.socialName || link.socialIconKey} className="text-slate-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                )
                            })
                        ) : (
                            <>
                                <Link href="#" className="text-slate-400 hover:text-white">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-white">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-white">
                                    <Youtube className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-white">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-white">
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="text-center text-slate-400 text-sm">© 2025 Empress Avenue Media. All rights reserved.</div>
            </div>
        </footer>
    )
}
