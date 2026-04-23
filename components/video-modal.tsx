"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

interface VideoModalProps {
  videoUrl: string
  buttonText?: string
  className?: string
}

export function VideoModal({ videoUrl, buttonText = "watch the sizzle", className }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract and format embed URL based on provider
  const getEmbedUrl = (url: string) => {
    // Handle Vimeo URL formats
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    }

    // Handle YouTube Standard URL formats
    const ytMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    }

    // Handle YouTube Short URL formats
    const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (ytShortMatch) {
      return `https://www.youtube.com/embed/${ytShortMatch[1]}?autoplay=1`
    }

    // Fallback embed structure if no known platform is matched
    if (url.includes('youtube.com') && !url.includes('/embed/')) {
      return url.replace('watch?v=', 'embed/') + '?autoplay=1'
    }

    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <>
      <Button
        variant="outline"
        className={className || "bg-transparent border-white/50 text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg tracking-wide rounded-full transition-all"}
        onClick={() => setIsOpen(true)}
      >
        <Play className={`w-5 h-5 mr-3 ${className ? '' : 'fill-current'}`} />
        {buttonText}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video iframe */}
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Sizzle Reel"
            />
          </div>
        </div>
      )}
    </>
  )
}
