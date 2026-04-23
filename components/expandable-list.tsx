"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ExpandableListProps {
    items: React.ReactNode[]
    limit?: number
    title: string
}

export function ExpandableList({ items, limit = 4, title }: ExpandableListProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Need to disable background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        // Cleanup when component unmounts
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!items || items.length === 0) return null

    // If items are less than or equal to limit, just render them all naturally
    if (items.length <= limit) {
        return (
            <div className="space-y-3 text-sm">
                {items}
            </div>
        )
    }

    // Otherwise, render limited amount and a View All button
    const visibleItems = items.slice(0, limit)

    return (
        <>
            <div className="space-y-3 text-sm">
                {visibleItems}
                <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-amber-600 hover:text-amber-700 mt-2 hover:no-underline"
                    onClick={() => setIsOpen(true)}
                >
                    +{items.length - limit} more
                </Button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <h3 className="text-xl font-bold font-serif text-slate-900">
                                {title} <span className="text-slate-500 font-sans text-sm font-normal ml-2">({items.length})</span>
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-slate-100 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                            <div className="space-y-4 text-sm">
                                {items.map((item, i) => (
                                    <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
