import Link from "next/link"

export type WorkSection =
    | "all"
    | "our-productions"
    | "coming-soon"
    | "in-progress"
    | "collaborations"
    | "design-works"

const TABS: { id: WorkSection; label: string; activeBg: string; activeBorder: string }[] = [
    {
        id: "all",
        label: "all",
        activeBg: "bg-slate-700",
        activeBorder: "border-slate-700",
    },
    {
        id: "our-productions",
        label: "our productions",
        activeBg: "bg-slate-700",
        activeBorder: "border-slate-700",
    },
    {
        id: "coming-soon",
        label: "coming soon",
        activeBg: "bg-slate-600",
        activeBorder: "border-slate-600",
    },
    {
        id: "in-progress",
        label: "in progress",
        activeBg: "bg-amber-600",
        activeBorder: "border-amber-600",
    },
    {
        id: "collaborations",
        label: "purely post",
        activeBg: "bg-slate-700",
        activeBorder: "border-slate-700",
    },
    {
        id: "design-works",
        label: "design works",
        activeBg: "bg-slate-700",
        activeBorder: "border-slate-700",
    },
]

interface WorkTabNavProps {
    activeSection: WorkSection
    visibleSections?: WorkSection[]
}

export function WorkTabNav({ activeSection, visibleSections }: WorkTabNavProps) {
    const tabsToRender = visibleSections 
        ? TABS.filter(tab => visibleSections.includes(tab.id))
        : TABS

    return (
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-6">
                <nav className="flex overflow-x-auto no-scrollbar gap-1 py-0 justify-center" aria-label="Work sections">
                    {tabsToRender.map((tab) => {
                        const isActive = tab.id === activeSection
                        return (
                            <Link
                                key={tab.id}
                                href={tab.id === "all" ? "/work" : `/work?section=${tab.id}`}
                                className={`
                  flex-shrink-0 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2
                  ${isActive
                                        ? `${tab.activeBg} text-white border-transparent -mb-px`
                                        : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
                                    }
                `}
                            >
                                {tab.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
