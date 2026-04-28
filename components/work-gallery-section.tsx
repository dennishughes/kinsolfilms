"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

export interface GalleryItem {
    sourceUrl: string
    alt?: string
    link?: string | null
}

interface WorkGallerySectionProps {
    title: string
    items: GalleryItem[]
    layoutType: 'interactive' | 'poster' | 'flyer' | 'logo'
}

export function WorkGallerySection({ title, items, layoutType }: WorkGallerySectionProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex === null) return
        if (e.key === 'ArrowLeft') {
            setSelectedIndex(prev => (prev! > 0 ? prev! - 1 : items.length - 1))
        } else if (e.key === 'ArrowRight') {
            setSelectedIndex(prev => (prev! < items.length - 1 ? prev! + 1 : 0))
        } else if (e.key === 'Escape') {
            setSelectedIndex(null)
        }
    }, [selectedIndex, items.length])

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
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
        setSelectedIndex(prev => (prev! < items.length - 1 ? prev! + 1 : 0))
    }

    const goToPrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIndex(prev => (prev! > 0 ? prev! - 1 : items.length - 1))
    }

    if (items.length === 0) return null

    // Grid rendering logic
    const renderGrid = () => {
        switch (layoutType) {
            case 'interactive':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="group cursor-pointer"
                                onClick={() => openModal(idx)}
                            >
                                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden border border-slate-200 group-hover:shadow-md transition-shadow">
                                    <Image
                                        src={item.sourceUrl}
                                        alt={item.alt || `${title} ${idx + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                {item.link ? (
                                    <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-900 flex items-center">
                                        View Project <ExternalLink className="w-3 h-3 ml-1" />
                                    </p>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-900 flex items-center">
                                        View Details
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            case 'poster':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative aspect-[2/3] w-full bg-slate-100 border border-slate-200 cursor-pointer group hover:opacity-90 transition-opacity"
                                onClick={() => openModal(idx)}
                            >
                                <Image
                                    src={item.sourceUrl}
                                    alt={item.alt || `${title} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )
            case 'flyer':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative aspect-[2/3] w-full bg-slate-100 border border-slate-200 cursor-pointer group hover:opacity-90 transition-opacity"
                                onClick={() => openModal(idx)}
                            >
                                <Image
                                    src={item.sourceUrl}
                                    alt={item.alt || `${title} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )
            case 'logo':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative aspect-square w-full bg-slate-50 border border-slate-200 p-4 flex items-center justify-center cursor-pointer group hover:border-slate-300 transition-colors"
                                onClick={() => openModal(idx)}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.sourceUrl}
                                        alt={item.alt || `${title} ${idx + 1}`}
                                        fill
                                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )
        }
    }

    return (
        <div className="mb-12">
            <h3 className="text-2xl font-light text-slate-800 mb-8 border-b border-slate-200 pb-4">{title}</h3>
            {renderGrid()}

            {/* Modal */}
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
                    {items.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
                                onClick={goToPrev}
                            >
                                <ChevronLeft className="w-12 h-12" />
                            </button>
                            <button
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
                                onClick={goToNext}
                            >
                                <ChevronRight className="w-12 h-12" />
                            </button>
                        </>
                    )}

                    {/* Content */}
                    <div
                        className="relative w-full max-w-6xl h-[85vh] flex flex-col items-center justify-center px-12 md:px-24"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={items[selectedIndex].sourceUrl}
                                alt={items[selectedIndex].alt || `${title} ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Action Bar */}
                        <div className="mt-6 text-center text-white h-8">
                            <span className="text-white/60 text-sm mr-4">
                                {selectedIndex + 1} / {items.length}
                            </span>
                            {items[selectedIndex].link && (
                                <a
                                    href={items[selectedIndex].link!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-slate-300 underline underline-offset-4 flex items-center justify-center inline-flex"
                                >
                                    Visit Project Link <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
