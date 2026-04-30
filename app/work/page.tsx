import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import {
    fetchProductions,
    getOurProductions,
    getCollaborations,
    getInProgressProductions,
    getComingSoonProductions,
    getUpcomingEvents,
    fetchWorks,
    fetchEAMSettings,
    sortProductionsByYear,
    type Production,
} from "@/lib/graphql"
import { WorkGallerySection } from "@/components/work-gallery-section"
import { WorkTabNav, type WorkSection } from "@/components/work-tab-nav"
import { ArrowRight } from "lucide-react"

export const revalidate = 60

interface WorkPageProps {
    searchParams: Promise<{ section?: string }>
}

const PREVIEW_COUNT = 3 // cards shown per section in "all" view

export default async function WorkPage({ searchParams }: WorkPageProps) {
    const { section } = await searchParams
    const activeSection = (section || "all") as WorkSection
    const isAll = activeSection === "all"

    const [allProductions, worksData, settings] = await Promise.all([
        fetchProductions(),
        fetchWorks(),
        fetchEAMSettings(),
    ])

    const workSettings = settings?.work

    // Compute full lists for tab visibility
    const allOurProductions = sortProductionsByYear(getOurProductions(allProductions))
    const allComingSoon = sortProductionsByYear(getComingSoonProductions(allProductions))
    const allInProgress = sortProductionsByYear(getInProgressProductions(allProductions))
    const allCollaborations = sortProductionsByYear(getCollaborations(allProductions))

    // Check if there are any design works
    const hasDesignWorks = worksData && (
        worksData.posterArt.length > 0 ||
        worksData.flyersAds.length > 0 ||
        worksData.logoDesign.length > 0 ||
        worksData.interactiveDesign.length > 0
    )

    const visibleSections: WorkSection[] = ["all"]
    if (allOurProductions.length > 0) visibleSections.push("our-productions")
    if (allComingSoon.length > 0) visibleSections.push("coming-soon")
    if (allInProgress.length > 0) visibleSections.push("in-progress")
    if (allCollaborations.length > 0) visibleSections.push("collaborations")
    if (hasDesignWorks) visibleSections.push("design-works")

    // Derived lists for rendering
    const ourProductions = (isAll || activeSection === "our-productions") ? allOurProductions : []
    const comingSoon = (isAll || activeSection === "coming-soon") ? allComingSoon : []
    const upcomingEvents = (isAll || activeSection === "coming-soon") ? getUpcomingEvents(allProductions) : []
    const inProgress = (isAll || activeSection === "in-progress") ? allInProgress : []
    const collaborations = (isAll || activeSection === "collaborations") ? allCollaborations : []

    // In "all" mode each section is capped to PREVIEW_COUNT; in section mode show all
    const displayProductions = isAll ? ourProductions.slice(0, PREVIEW_COUNT) : ourProductions
    const displayComingSoon = isAll ? comingSoon.slice(0, PREVIEW_COUNT) : comingSoon
    const displayInProgress = isAll ? inProgress.slice(0, PREVIEW_COUNT) : inProgress
    const displayCollabs = isAll ? collaborations.slice(0, PREVIEW_COUNT) : collaborations

    // ── Helpers ──────────────────────────────────────────────────────────────
    const formatType = (p: Production) => {
        const type = p.filmType || "Feature"
        const year = p.releaseYear || ""
        return year ? `${type} • ${year}` : type
    }
    const getStatusDisplay = (p: Production) => {
        const s = (p.status || "").toLowerCase()
        if (s === "in development") return "in development"
        if (s === "in pre-production") return "in pre-production"
        if (s === "in production") return "in production"
        if (s === "in post") return "in post"
        return p.status?.toLowerCase() || "in progress"
    }

    // ── Section header helper (badge + optional "see all" link) ──────────────
    const SectionHeader = ({
        label,
        badgeBg,
        total,
        sectionKey,
    }: {
        label: string
        badgeBg: string
        total?: number
        sectionKey: WorkSection
    }) => (
        <div className="flex items-end justify-between mb-6">
            <div className={`inline-block ${badgeBg} text-white px-4 py-1 pt-3 text-sm right-top-br`}>{label}</div>
            {isAll && total !== undefined && total > PREVIEW_COUNT && (
                <Link
                    href={`/work?section=${sectionKey}`}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors group"
                >
                    see all {total}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            )}
        </div>
    )

    // ── Poster card shared UI ─────────────────────────────────────────────────
    const PosterSlot = ({
        href,
        sourceUrl,
        altText,
        light = true,
    }: {
        href: string
        sourceUrl?: string | null
        altText?: string
        light?: boolean
    }) => (
        <Link
            href={href}
            className={`block w-full sm:w-32 md:w-36 lg:w-40 aspect-[2/3] ${light ? "bg-slate-100" : "bg-slate-900"} flex items-center justify-center border-b sm:border-b-0 sm:border-r ${light ? "border-slate-200" : "border-slate-700"} flex-shrink-0 relative overflow-hidden group`}
        >
            {sourceUrl ? (
                <Image src={sourceUrl} alt={altText || ""} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
                <div className={`absolute inset-0 flex items-center justify-center ${light ? "text-slate-400" : "text-slate-500"} text-sm p-4 text-center`}>[No Poster]</div>
            )}
        </Link>
    )

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header siteTitle={settings?.siteTitle} siteLogo={settings?.siteLogo} />

            {/* Hero */}
            <section className="relative py-20 text-white overflow-hidden flex-shrink-0">
                <div className="absolute inset-0">
                    <Image src="/hero-bg-cinematic.png" alt="Abstract wave background" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-slate-900/60" />
                </div>
                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-light mb-8">
                            {workSettings?.heroTitle || "Our Work"}
                        </h1>
                        <p className="text-xl text-slate-200 leading-relaxed font-light">
                            {workSettings?.heroText || "A comprehensive collection of our original films, creative collaborations, and design portfolio."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Sticky tab nav */}
            <WorkTabNav activeSection={activeSection} visibleSections={visibleSections} />

            {/* ── Collaborations ──────────────────────────────────────────── */}
            {displayCollabs.length > 0 && (
                <section id="collaborations" className="py-12 bg-white flex-shrink-0">
                    <div className="container mx-auto px-6">
                        <SectionHeader label="purely post" badgeBg="bg-slate-700" total={collaborations.length} sectionKey="collaborations" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-5">
                            {displayCollabs.map((project) => (
                                <div key={project.id} className="border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row h-full">
                                    <PosterSlot href={`/work/${project.slug}`} sourceUrl={project.poster?.sourceUrl} altText={project.poster?.altText || project.title} />
                                    <div className="p-4 lg:p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{project.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4">{formatType(project)}</p>
                                        {project.contributions && project.contributions.length > 0 && (
                                            <div className="mb-6 flex-1">
                                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Our Contributions</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.contributions.map((item, idx) => (
                                                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 text-xs rounded border border-slate-200">{item}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <Link href={`/work/${project.slug}`} className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start mt-auto">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isAll && collaborations.length > PREVIEW_COUNT && (
                            <Link href="/work?section=collaborations" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border border-slate-300 text-slate-600 text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors">
                                see all {collaborations.length} collaborations <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* ── Coming Soon ─────────────────────────────────────────────── */}
            {displayComingSoon.length > 0 && (
                <section id="coming-soon" className="py-12 bg-slate-800 flex-shrink-0">
                    <div className="container mx-auto px-6">
                        <SectionHeader label="coming soon" badgeBg="bg-slate-600" total={comingSoon.length} sectionKey="coming-soon" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-5">
                            {displayComingSoon.map((project) => {
                                const nextEvent = upcomingEvents.filter(e => e.production.id === project.id)[0]
                                return (
                                    <div key={project.id} className="border border-slate-700 bg-slate-800 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex flex-col sm:flex-row h-full">
                                            <PosterSlot href={`/work/${project.slug}`} sourceUrl={project.poster?.sourceUrl} altText={project.poster?.altText || project.title} light={false} />
                                            <div className="flex-1 p-4 lg:p-5 flex flex-col">
                                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{project.title}</h3>
                                                <p className="text-sm text-slate-400 mb-3">{formatType(project)}</p>
                                                {nextEvent && (
                                                    <>
                                                        <div className="text-lg font-light text-slate-300 mb-1">
                                                            {nextEvent.parsedDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })}
                                                        </div>
                                                        {nextEvent.event.title && (
                                                            nextEvent.event.titleLink
                                                                ? <Link href={nextEvent.event.titleLink} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-300 hover:text-white underline mb-3 transition-colors self-start">{nextEvent.event.title}</Link>
                                                                : <span className="text-sm text-slate-300 mb-3 capitalize">{nextEvent.event.title}</span>
                                                        )}
                                                    </>
                                                )}
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-3">{project.logline || "Coming soon."}</p>
                                                <Link href={`/work/${project.slug}`} className="text-sm text-slate-400 underline font-medium hover:text-white transition-colors self-start mt-auto">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {isAll && comingSoon.length > PREVIEW_COUNT && (
                            <Link href="/work?section=coming-soon" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border border-slate-600 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                                see all {comingSoon.length} coming soon <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* ── Our Productions ─────────────────────────────────────────── */}
            {displayProductions.length > 0 && (
                <section id="our-productions" className="py-12 bg-white flex-shrink-0">
                    <div className="container mx-auto px-6">
                        <SectionHeader label="our productions" badgeBg="bg-slate-700" total={ourProductions.length} sectionKey="our-productions" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-5">
                            {displayProductions.map((film) => (
                                <div key={film.id} className="border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row h-full">
                                    <PosterSlot href={`/work/${film.slug}`} sourceUrl={film.poster?.sourceUrl} altText={film.poster?.altText || film.title} />
                                    <div className="p-4 lg:p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{film.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4">{formatType(film)}</p>
                                        <p className="text-slate-600 mb-6 flex-1 line-clamp-3 text-sm lg:text-base leading-relaxed">
                                            {film.logline || "No description available."}
                                        </p>
                                        <Link href={`/work/${film.slug}`} className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start mt-auto">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Full-width "See all" button in all mode */}
                        {isAll && ourProductions.length > PREVIEW_COUNT && (
                            <Link href="/work?section=our-productions" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border border-slate-300 text-slate-600 text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors">
                                see all {ourProductions.length} productions <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* ── In Progress ─────────────────────────────────────────────── */}
            {displayInProgress.length > 0 && (
                <section id="in-progress" className="py-12 bg-slate-100 flex-shrink-0">
                    <div className="container mx-auto px-6">
                        <SectionHeader label="in progress" badgeBg="bg-amber-600" total={inProgress.length} sectionKey="in-progress" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-5">
                            {displayInProgress.map((project) => (
                                <div key={project.id}>
                                    <div className="border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300 mb-2">
                                        <div className="flex flex-col sm:flex-row h-full">
                                            <Link href={`/work/${project.slug}`} className="block w-full sm:w-40 md:w-44 lg:w-40 aspect-[3/4] sm:aspect-[2/3] bg-slate-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-300 flex-shrink-0 relative overflow-hidden group">
                                                {project.poster?.sourceUrl
                                                    ? <Image src={project.poster.sourceUrl} alt={project.poster.altText || project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    : <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm p-4 text-center">[No Poster]</div>
                                                }
                                            </Link>
                                            <div className="flex-1 p-4 lg:p-5 flex flex-col">
                                                <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
                                                <p className="text-sm text-slate-500 mb-3">{formatType(project)}</p>
                                                <div className="mb-4 max-h-[5.5rem] overflow-hidden flex-shrink-0">
                                                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">{project.logline || "Details coming soon."}</p>
                                                </div>
                                                <Link href={`/work/${project.slug}`} className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start mt-auto">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-full sm:w-40 md:w-44 lg:w-40 flex-shrink-0">
                                            <div className="bg-slate-600 text-white px-4 py-1 text-sm">{getStatusDisplay(project)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isAll && inProgress.length > PREVIEW_COUNT && (
                            <Link href="/work?section=in-progress" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border border-slate-300 text-slate-600 text-sm hover:bg-white transition-colors">
                                see all {inProgress.length} in progress <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* ── Design Works — teaser card in "all" view, full gallery in section view ── */}
            {hasDesignWorks && isAll ? (
                <section className="py-12 bg-slate-900 flex-shrink-0">
                    <div className="container mx-auto px-6">
                        <div className="flex items-end justify-between mb-6">
                            <div className="inline-block bg-slate-700 text-white px-4 py-1 pt-3 text-sm right-top-br">design works</div>
                        </div>
                        <Link href="/work?section=design-works" className="group relative block overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors">
                            <div className="flex items-center justify-between p-8 md:p-12">
                                <div>
                                    <p className="text-white text-2xl md:text-3xl font-light mb-2">Poster Art · Flyers · Logos · Interactive</p>
                                    <p className="text-slate-400 text-sm">View our full design portfolio</p>
                                </div>
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-slate-600 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            ) : worksData && activeSection === "design-works" && (
                <section id="design-works" className="py-16 bg-white flex-1 min-h-[50vh]">
                    <div className="container mx-auto px-6">
                        <div className="mb-6">
                            <div className="inline-block bg-slate-700 text-white px-4 py-1 pt-3 text-sm right-top-br">design works</div>
                        </div>
                        <div className="space-y-16 mt-4">
                            {worksData.posterArt.length > 0 && (
                                <WorkGallerySection title="Poster Art" layoutType="poster" items={worksData.posterArt.map(img => ({ sourceUrl: img.sourceUrl, alt: "Poster Art" }))} />
                            )}
                            {worksData.flyersAds.length > 0 && (
                                <WorkGallerySection title="Flyers & Ads" layoutType="flyer" items={worksData.flyersAds.map(img => ({ sourceUrl: img.sourceUrl, alt: "Flyer or Ad Design" }))} />
                            )}
                            {worksData.logoDesign.length > 0 && (
                                <WorkGallerySection title="Logo Design" layoutType="logo" items={worksData.logoDesign.map(img => ({ sourceUrl: img.sourceUrl, alt: "Logo Design" }))} />
                            )}
                            {worksData.interactiveDesign.length > 0 && (
                                <WorkGallerySection
                                    title="Interactive Design"
                                    layoutType="interactive"
                                    items={worksData.interactiveDesign
                                        .filter(item => item.image2?.node?.sourceUrl)
                                        .map(item => ({ sourceUrl: item.image2!.node!.sourceUrl, link: item.link || null, alt: "Interactive Design Work" }))}
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    )
}
