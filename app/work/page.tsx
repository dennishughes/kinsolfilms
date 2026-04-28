import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Film, ExternalLink, Calendar, Play, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { fetchProductionBySlug, fetchProductions, fetchEAMSettings } from "@/lib/graphql"
import { VideoModal } from "@/components/video-modal"
import { ImageGalleryModal } from "@/components/image-gallery-modal"
import { ExpandableList } from "@/components/expandable-list"
import { Star, Trophy } from "lucide-react"

export const revalidate = 0

// Generate static params for all productions
export async function generateStaticParams() {
    const productions = await fetchProductions()
    return productions.map((production) => ({
        slug: production.slug,
    }))
}

export default async function FilmDetailPage({ params }: { params: { slug: string } }) {
    const [film, settings] = await Promise.all([
        fetchProductionBySlug(params.slug),
        fetchEAMSettings()
    ])
    console.log("DEBUG CREW:", JSON.stringify(film?.crew, null, 2))
    console.log("DEBUG CAST:", JSON.stringify(film?.cast, null, 2))

    if (!film) {
        notFound()
    }

    // Helper to safely format title for display
    const displayCrewTitle = (c: { title?: string | string[] | { name?: string } | null }): string => {
        if (!c || !c.title) return ""
        if (Array.isArray(c.title)) return c.title.filter(Boolean).map(t => typeof t === "object" ? (t as any).name : t).join(", ")
        if (typeof c.title === "string") return c.title
        if (typeof c.title === "object" && typeof (c.title as any).name === "string") return ((c.title as any).name || "")
        return ""
    }

    // Helper to safely get title as lowercase string
    const getCrewTitle = (c: { title?: string | string[] | { name?: string } | null }): string => {
        if (Array.isArray(c.title)) return c.title.join(", ").toLowerCase()
        if (typeof c.title === "string") return c.title.toLowerCase()
        if (c.title && typeof c.title === "object" && typeof (c.title as any).name === "string") return ((c.title as any).name || "").toLowerCase()
        return ""
    }

    // Helper to get director from crew
    const director = film.crew?.find((c) => getCrewTitle(c) === "director")?.name
    const producer = film.crew?.find((c) => getCrewTitle(c) === "producer" || getCrewTitle(c) === "executive producer")?.name
    const writer = film.crew?.find((c) => getCrewTitle(c) === "writer")?.name

    // Format duration
    const formatDuration = (minutes?: number) => {
        if (!minutes) return null
        return `${minutes} minutes`
    }

    // Get genres display
    const genresDisplay = film.genres?.join(", ") || film.filmType

    // Filter coming soon events to only include future events
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcomingEvents = film.comingSoon?.filter(event => {
        if (!event.datetime) return true // Keep events without a specific date
        const eventDate = new Date(event.datetime)
        return eventDate >= today
    }) || []

    // Build unified gallery starting with the poster
    const allImages = []
    if (film.poster) {
        allImages.push(film.poster)
    }
    if (film.imageGallery && film.imageGallery.length > 0) {
        allImages.push(...film.imageGallery)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <Header siteTitle={settings?.siteTitle} siteLogo={settings?.siteLogo} />

            {/* Production Hero - Static Wave Background */}
            <section className="relative py-12 text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/hero-bg-cinematic.png"
                        alt="Abstract wave background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Subtle overlay so text remains readable */}
                    <div className="absolute inset-0 bg-slate-900/60" />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Link href="/work" className="inline-flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Work</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Production Details - Main Content */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
                        {/* Poster moved down to main content area */}
                        {allImages.length > 0 ? (
                            <ImageGalleryModal
                                images={allImages}
                                title={film.title}
                                displayMode="poster"
                                priority={true}
                            />
                        ) : (
                            <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0 w-full object-cover rounded-lg shadow-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                [No Poster Available]
                            </div>
                        )}

                        {/* Film Info */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 text-sm font-medium">
                                    {film.filmType || "Feature"}
                                </Badge>
                                {/* Status */}
                                {film.status && (
                                    <Badge variant="secondary" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 text-sm font-medium">
                                        {film.status}
                                    </Badge>
                                )}
                                {/* Collaboration Badge */}
                                {film.collaboration && (
                                    film.contributions && film.contributions.length > 0 ? (
                                        <Link href="#contributions-section" className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                            <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-1 text-sm font-medium flex items-center gap-2">
                                                <div className="w-4 h-4 bg-[#0b101b] rounded-full flex items-center justify-center p-0.5 flex-shrink-0">
                                                    <Image
                                                        src={settings?.siteLogo || "/KinsolFilms_Logo_FullColour_Light.png"}
                                                        alt=""
                                                        width={12}
                                                        height={12}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                Collaboration
                                            </Badge>
                                        </Link>
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 text-sm font-medium flex items-center gap-2">
                                            <div className="w-4 h-4 bg-[#0b101b] rounded-full flex items-center justify-center p-0.5 flex-shrink-0">
                                                <Image
                                                    src={settings?.siteLogo || "/KinsolFilms_Logo_FullColour_Light.png"}
                                                    alt=""
                                                    width={12}
                                                    height={12}
                                                    className="object-contain"
                                                />
                                            </div>
                                            Collaboration
                                        </Badge>
                                    )
                                )}
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6">{film.title}</h1>

                            <div className="flex flex-wrap gap-8 text-base text-slate-600 mb-8 font-medium">
                                {film.releaseYear && (
                                    <div className="flex items-center space-x-2.5">
                                        <Calendar className="w-5 h-5 text-slate-500" />
                                        <span>{film.releaseYear}</span>
                                    </div>
                                )}
                                {film.durationMinutes && (
                                    <div className="flex items-center space-x-2.5">
                                        <Clock className="w-5 h-5 text-slate-500" />
                                        <span>{formatDuration(film.durationMinutes)}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2.5">
                                    <Film className="w-5 h-5 text-slate-500" />
                                    <span>{genresDisplay}</span>
                                </div>
                            </div>

                            {film.logline && (
                                <div className="mb-6">
                                    <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-3">Description</h2>
                                    <p className="text-lg text-slate-700 leading-relaxed font-serif italic">
                                        {film.logline}
                                    </p>
                                </div>
                            )}


                            <div className="flex flex-wrap gap-4 mb-8">
                                {film.trailerUrl && (
                                    <VideoModal
                                        videoUrl={film.trailerUrl}
                                        buttonText="Watch Trailer"
                                        className="bg-slate-800 hover:bg-slate-700 text-white h-11 px-8 rounded-md"
                                    />
                                )}
                                {film.imdbUrl && (
                                    <Button asChild variant="outline" size="lg">
                                        <Link href={film.imdbUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View on IMDB
                                        </Link>
                                    </Button>
                                )}
                                {film.websiteUrl && (
                                    <Button asChild variant="outline" size="lg">
                                        <Link href={film.websiteUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Official Website
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Coming Soon / Upcoming Events */}
                            {upcomingEvents.length > 0 && (
                                <div className="mb-8 p-6 bg-slate-900 rounded-lg text-white">
                                    <h3 className="text-xl font-bold mb-4">Coming Soon</h3>
                                    <div className="space-y-4">
                                        {upcomingEvents.map((event, index) => {
                                            const datetime = event.datetime ? new Date(event.datetime) : null
                                            return (
                                                <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-6 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                                    {datetime && (
                                                        <div className="flex-shrink-0 sm:w-32 text-lg font-light text-slate-300">
                                                            {datetime.toLocaleString("en-US", {
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                year: "2-digit",
                                                                timeZone: "UTC"
                                                            }).split(',')[0]}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        {event.title && (
                                                            <div className="font-semibold text-white mb-1">
                                                                {event.titleLink ? (
                                                                    <Link href={event.titleLink} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors capitalize">
                                                                        {event.title}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="capitalize">{event.title}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="text-sm text-slate-400">
                                                                {event.location}
                                                                {event.address && <span> • {event.address}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Contributions (for collaborations/films with specific art roles) */}
                            {film.collaboration && film.contributions && film.contributions.length > 0 && (
                                <div id="contributions-section" className="mt-8 mb-8 p-6 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 scroll-mt-20">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Link
                                            href="#additional-info"
                                            className="group flex-shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                                            title="Scroll to Details"
                                        >
                                            <div className="w-12 h-12 bg-[#0b101b] rounded-full flex items-center justify-center p-1 shadow-lg border border-slate-700/30 group-hover:border-slate-500 transition-colors overflow-hidden">
                                                <Image
                                                    src={settings?.siteLogo || "/KinsolFilms_Logo_FullColour_Light.png"}
                                                    alt={settings?.siteTitle || "Kinsol Films"}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </Link>
                                        <h3 className="text-xl font-bold">Our Contributions</h3>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-slate-800">
                                        {film.contributions.map((contribution, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                                                <span className="font-medium text-base">{contribution}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Details */}
            <section id="additional-info" className="py-16 bg-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Synopsis / About */}
                        <div className="lg:col-span-2 space-y-6">
                            {(film.synopsis || film.logline) && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{film.synopsis || film.logline}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Image Gallery */}
                            {allImages.length > 1 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                                        <ImageGalleryModal images={allImages} title={film.title} gridStartIndex={film.poster ? 1 : 0} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Cast & Crew / Watch & Engage */}
                        <div className="space-y-6">
                            {/* Watch & Engage */}
                            {film.watchEngage && film.watchEngage.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4">Watch & Engage</h3>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {film.watchEngage.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.link || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex w-full h-12 relative hover:opacity-80 transition-opacity bg-white border border-slate-200 rounded-lg overflow-hidden items-center justify-center p-2"
                                                >
                                                    {item.watchImage?.sourceUrl ? (
                                                        <Image
                                                            src={item.watchImage.sourceUrl}
                                                            alt={item.type || "Watch Provider"}
                                                            fill
                                                            className="object-contain p-1.5"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] font-semibold uppercase text-slate-700 tracking-wider">
                                                            {item.type || "Watch Here"}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {film.crew && film.crew.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4">Crew</h3>
                                        <ExpandableList
                                            title="Crew"
                                            limit={4}
                                            items={film.crew.map((member, index) => (
                                                <div key={index}>
                                                    <span className="text-slate-900">{displayCrewTitle(member)}:</span>{" "}
                                                    {member.link ? (
                                                        <Link href={member.link} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-slate-600">
                                                            {member.name}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-bold">{member.name}</span>
                                                    )}
                                                    {member.featured && (
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline-block ml-1.5 -translate-y-0.5" aria-label="Featured Crew" />
                                                    )}
                                                </div>
                                            ))}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {film.cast && film.cast.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4">Cast</h3>
                                        <ExpandableList
                                            title="Cast"
                                            limit={4}
                                            items={film.cast.map((member, index) => (
                                                <div key={index}>
                                                    {member.link ? (
                                                        <Link href={member.link} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-slate-600">
                                                            {member.castMember}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-bold">{member.castMember}</span>
                                                    )}
                                                    {member.featuredCast && (
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline-block ml-1.5 -translate-y-0.5" aria-label="Featured Cast" />
                                                    )}
                                                    {member.role && <span className="text-slate-500"> as {member.role}</span>}
                                                </div>
                                            ))}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {film.linksMedia && film.linksMedia.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4">Links & Media</h3>
                                        <ExpandableList
                                            title="Links & Media"
                                            limit={4}
                                            items={film.linksMedia.map((item, index) => (
                                                <div key={index} className="space-y-1">
                                                    {item.titleLink ? (
                                                        <Link href={item.titleLink} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-slate-600 inline-flex items-center gap-1.5">
                                                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                            {item.title}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-bold">{item.title}</span>
                                                    )}
                                                    {item.description && <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>}
                                                </div>
                                            ))}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {film.awards && film.awards.length > 0 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4">Awards</h3>
                                        <div className="space-y-2 text-sm">
                                            {film.awards.map((award, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/10 mt-0.5 flex-shrink-0" />
                                                    <span className="text-slate-700">{award.award}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
