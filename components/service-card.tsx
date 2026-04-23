"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Service } from "@/lib/graphql"

export function ServiceCard({ service }: { service: Service }) {
    // Use regex to strip HTML tags for a clean truncated text preview
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '')
    }

    const cleanText = service.content ? stripHtml(service.content) : ""

    // Decide how many characters to show before truncating
    const maxLength = 200
    const isLong = cleanText.length > maxLength
    const displayText = isLong ? cleanText.substring(0, maxLength) + "..." : cleanText

    return (
        <Card className="h-full flex flex-col group">
            {service.image && (
                <Link href={`/services/${service.slug}`} className="block relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            )}
            <CardContent className="p-6 flex-1 flex flex-col">
                {service.category && (
                    <div className="mb-4">
                        <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white font-light px-3 py-1">
                            {service.category}
                        </Badge>
                    </div>
                )}
                <h3 className="text-2xl font-light mb-4 text-slate-900 line-clamp-2">{service.title}</h3>

                {service.content && (
                    <div className="flex-1 flex flex-col">
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            {displayText}
                        </p>

                        {isLong && (
                            <div className="mt-auto pt-4">
                                <Link
                                    href={`/services/${service.slug}`}
                                    className="inline-block text-slate-800 font-medium text-sm hover:underline transition-all"
                                >
                                    Read more &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
