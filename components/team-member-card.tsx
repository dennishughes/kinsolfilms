"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { TeamMember } from "@/lib/graphql"

export function TeamMemberCard({ member }: { member: TeamMember }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="text-center h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="relative w-32 h-32 mx-auto mb-4 flex-shrink-0">
                    <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover object-top rounded-full"
                    />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                {member.role && <p className="text-slate-600 mb-4">{member.role}</p>}
                {member.content && (
                    <div className="mt-auto flex-1 flex flex-col">
                        <div
                            className={`text-sm text-slate-700 prose prose-sm max-w-none text-left flex-1 ${!isExpanded ? 'line-clamp-4' : ''}`}
                            dangerouslySetInnerHTML={{ __html: member.content }}
                        />
                        {member.content && member.content.length > 150 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-slate-500 hover:text-slate-800 text-sm mt-3 underline focus:outline-none self-center"
                            >
                                {isExpanded ? "read less" : "read more"}
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
