"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

export interface GalleryImageItem {
    sourceUrl: string
    altText?: string
    description?: string
    caption?: string
}

interface ImageGalleryModalProps {
    images: GalleryImageItem[]
    title: string
    displayMode?: "grid" | "poster"
    gridStartIndex?: number
    priority?: boolean
}

export function ImageGalleryModal({ images, title, displayMode = "grid", gridStartIndex = 0, priority = false }: ImageGalleryModalProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (selectedIndex === null) return
            if (e.key === "ArrowLeft") {
                setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
            } else if (e.key === "ArrowRight") {
                setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
            } else if (e.key === "Escape") {
                setSelectedIndex(null)
            }
        },
        [selectedIndex, images.length]
    )

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", handleKeyDown)
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [selectedIndex, handleKeyDown])

    const openModal = (index: number) => {
        setSelectedIndex(index)
    }

    const closeModal = () => {
        setSelectedIndex(null)
    }

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
    }

    const goToPrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
    }

    if (!images || images.length === 0) return null

    return (
        <>
            {displayMode === "poster" ? (
                <div
                    className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0 w-full object-cover rounded-lg shadow-lg overflow-hidden cursor-pointer group"
                    onClick={() => openModal(0)}
                >
                    <Image
                        src={images[0].sourceUrl}
                        alt={images[0].altText || `${title} poster`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={priority}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="text-white w-10 h-10 drop-shadow-md" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.slice(gridStartIndex).map((image, idx) => {
                        const actualIndex = idx + gridStartIndex
                        return (
                            <div
                                key={actualIndex}
                                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-slate-100"
                                onClick={() => openModal(actualIndex)}
                            >
                                <Image
                                    src={image.sourceUrl}
                                    alt={image.altText || `${title} gallery image ${actualIndex + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal / Lightbox */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
                        onClick={closeModal}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
                                onClick={goToPrev}
                            >
                                <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
                            </button>
                            <button
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
                                onClick={goToNext}
                            >
                                <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
                            </button>
                        </>
                    )}

                    {/* Content */}
                    <div
                        className="relative w-full max-w-6xl h-[85vh] flex flex-col items-center justify-center px-12 md:px-24"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={images[selectedIndex].sourceUrl}
                                alt={images[selectedIndex].altText || `${title} gallery image ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {/* Image Counter */}
                        <div className="mt-4 text-center text-white/60 text-sm font-medium">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
