import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoModal } from "@/components/video-modal"
import {
  fetchProductions,
  getOurProductions,
  getCollaborations,
  getInProgressProductions,
  getFeaturedProduction,
  getUpcomingEvents,
  fetchEAMSettings,
  type Production,
} from "@/lib/graphql"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const [allProductions, settings] = await Promise.all([
    fetchProductions(),
    fetchEAMSettings()
  ])
  const homepageSettings = settings?.homepage

  // Debug: Log all production statuses to see what values are coming from WordPress
  console.log("[v0] All productions with statuses:", allProductions.map(p => ({
    title: p.title,
    status: p.status,
    statusType: typeof p.status,
    collaboration: p.collaboration
  })))

  // Filter productions by category
  const ourProductions = getOurProductions(allProductions)
  const collaborations = getCollaborations(allProductions)
  const inProgress = getInProgressProductions(allProductions)
  const upcomingEvents = getUpcomingEvents(allProductions)
  const mainUpcoming = upcomingEvents[0]
  const upcomingCards = upcomingEvents.slice(1, 4)
  const featuredProduction = mainUpcoming?.production || getFeaturedProduction(allProductions)

  // Debug: Log filtered results
  console.log("[v0] In Progress productions:", inProgress.map(p => ({ title: p.title, status: p.status })))

  // Helper to format film type display
  const formatType = (production: Production) => {
    const type = production.filmType || "Feature"
    const year = production.releaseYear || ""
    return year ? `${type} • ${year}` : type
  }

  // Helper to get status display
  const getStatusDisplay = (production: Production) => {
    if (production.status === "In Progress") return "in progress"
    if (production.status === "In Development") return "in development"
    if (production.status === "In Pre-Production") return "in pre-production"
    if (production.status === "In Post") return "in post"
    return production.status?.toLowerCase() || "released"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - from generalized component */}
      <Header siteTitle={settings?.siteTitle} siteLogo={settings?.siteLogo} />

      {/* New Hero Section - Static Wave Background */}
      <section className="relative py-20 text-white overflow-hidden">
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

        <div className="container relative mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light mb-6">
              {homepageSettings?.heroTitle || "Kinsol Films"}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light mb-8">
              {homepageSettings?.heroText || "Making meaningful media that explores critical social issues and tells compelling human stories."}
            </p>
            {(homepageSettings?.heroButtonUrl || homepageSettings?.heroButtonTitle || !homepageSettings) && (
              <VideoModal
                videoUrl={homepageSettings?.heroButtonUrl || "https://vimeo.com/365363979"}
                buttonText={homepageSettings?.heroButtonTitle || "watch our sizzle"}
                className="bg-transparent border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg tracking-wide rounded-full transition-all duration-300"
              />
            )}
          </div>
        </div>
      </section>

      {/* Temporarily hidden looping video background */}
      {false && (
        <section className="relative h-[70vh] overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://www.empressave.com/wp-content/uploads/2019/11/WebIntroAnimation.mp4" type="video/mp4" />
              {/* Fallback image if video doesn't load */}
              <Image
                src="/hero-filmmaker.jpeg"
                alt="Filmmaker working with professional camera equipment"
                fill
                className="object-cover"
                priority
              />
            </video>
          </div>

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl">
                <h1 className="text-7xl font-thin text-slate-400/90 mb-4 tracking-wide"></h1>
              </div>
            </div>
          </div>

          {/* Bottom right watch button */}
          <div className="absolute bottom-6 right-6">
            <VideoModal
              videoUrl="https://vimeo.com/365363979"
              buttonText="watch the sizzle"
            />
          </div>
        </section>
      )}

      {/* Making meaningful media section */}
      <section className="py-12 bg-white pb-0 pt-0">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-light text-slate-800 mb-4 lowercase">
              {homepageSettings?.pageTitle || "making meaningful media"}
            </h2>
            <div className="flex-shrink-0 ml-8">
              <Image
                src="/network-diagram.png"
                alt="Network diagram showing connected data points"
                width={200}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Productions - three-column grid layout with right column */}
      {ourProductions.length > 0 && (
        <section className="mb-12 bg-white pt-6">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <div className="inline-block bg-slate-700 text-white px-4 py-1 pt-3 text-sm right-top-br">
              our productions
            </div>
          </div>

          <div className="flex gap-6 -mt-5">
            {/* Main grid content */}
            <div className="flex-1">
              {/* Grid layout - 3 columns on desktop, 2 on tablet, 1 on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ourProductions.slice(0, 3).map((film) => (
                  <div
                    key={film.id}
                    className="border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Horizontal card layout */}
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Movie Poster */}
                      <Link href={`/work/${film.slug}`} className="block w-full sm:w-32 md:w-28 lg:w-32 aspect-[3/4] sm:aspect-[2/3] bg-slate-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-300 flex-shrink-0 relative overflow-hidden group">
                        {film.poster?.sourceUrl ? (
                          <Image
                            src={film.poster.sourceUrl}
                            alt={film.poster.altText || film.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-slate-500 text-xs">[Movie Poster]</span>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-3 lg:p-4 flex flex-col">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 line-clamp-2">{film.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{formatType(film)}</p>
                        <p className="text-xs lg:text-sm text-slate-700 mb-3 flex-1 line-clamp-3 leading-relaxed">
                          {film.logline || "No description available."}
                        </p>
                        <Link
                          href={`/work/${film.slug}`}
                          className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start"
                        >
                          More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right thin column */}
            {ourProductions.length >= 3 && (
              <Link href="/work?section=our-productions" className="w-8 bg-slate-600 flex-shrink-0 relative block hover:bg-slate-700 transition-colors group cursor-pointer">
              <div className="absolute top-6 left-0 w-full flex flex-col items-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mb-10 -mt-2 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-3 h-3 text-slate-800" />
                </div>
                <div className="text-white text-xs transform rotate-90 origin-center whitespace-nowrap">
                  see all films
                </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Coming Soon - poster + embedded trailer + text layout */}
      {featuredProduction && (
        <section className="py-12 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="mb-1">
              <div className="inline-block bg-slate-600 text-white px-4 py-1 text-sm right-top-br">latest work</div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
              {/* Embedded Trailer Video on the left */}
              <div className="w-full lg:w-[60%] relative">
                {featuredProduction.trailerUrl ? (
                  <div className="relative aspect-video w-full h-full min-h-[280px]">
                    {/* Check if it's a YouTube URL and embed it */}
                    {featuredProduction.trailerUrl.includes('youtube.com') || featuredProduction.trailerUrl.includes('youtu.be') ? (
                      <iframe
                        src={featuredProduction.trailerUrl.includes('youtu.be')
                          ? `https://www.youtube.com/embed/${featuredProduction.trailerUrl.split('/').pop()?.split('?')[0]}`
                          : featuredProduction.trailerUrl.includes('watch?v=')
                            ? `https://www.youtube.com/embed/${featuredProduction.trailerUrl.split('v=')[1]?.split('&')[0]}`
                            : featuredProduction.trailerUrl.replace('watch?v=', 'embed/')
                        }
                        title={`${featuredProduction.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : featuredProduction.trailerUrl.includes('vimeo.com') ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${featuredProduction.trailerUrl.split('/').pop()?.split('?')[0]}`}
                        title={`${featuredProduction.title} Trailer`}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      /* Fallback for other video URLs - show poster with play button overlay */
                      <div className="relative w-full h-full">
                        {featuredProduction.imageGallery?.[0]?.sourceUrl ? (
                          <Image
                            src={featuredProduction.imageGallery[0].sourceUrl}
                            alt={featuredProduction.title}
                            fill
                            className="object-cover"
                          />
                        ) : featuredProduction.poster?.sourceUrl ? (
                          <Image
                            src={featuredProduction.poster.sourceUrl}
                            alt={featuredProduction.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-700" />
                        )}
                        <Link
                          href={featuredProduction.trailerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                        >
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-slate-800 fill-slate-800 ml-1" />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  /* No trailer - show poster or image gallery as fallback */
                  <div className="relative w-full h-full min-h-[280px] flex items-center justify-center bg-slate-900/50">
                    {featuredProduction.poster?.sourceUrl ? (
                      <div className="relative aspect-[2/3] w-full max-w-[280px] shadow-2xl rounded-md overflow-hidden my-8">
                        <Image
                          src={featuredProduction.poster.sourceUrl}
                          alt={featuredProduction.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : featuredProduction.imageGallery?.[0]?.sourceUrl ? (
                      <div className="relative aspect-video w-full h-full">
                        <Image
                          src={featuredProduction.imageGallery[0].sourceUrl}
                          alt={featuredProduction.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-500">[Trailer Coming Soon]</span>
                      </div>
                    )}
                  </div>
                )}
                {/* Side text */}
                <div className="absolute -right-8 top-0 bottom-0 w-8 bg-slate-600 flex items-center justify-center">
                  <div className="text-white text-xs transform -rotate-90 whitespace-nowrap">latest work</div>
                </div>
              </div>

              {/* Title and description to the right of the video */}
              <div className="w-full lg:w-[40%] flex-shrink-0 text-white flex flex-col justify-center lg:pl-8 mt-6 lg:mt-0">
                <h3 className="text-3xl lg:text-4xl font-light mb-4">{featuredProduction.title.toLowerCase()}</h3>
                {mainUpcoming ? (
                  <>
                    <p className="text-slate-300 mb-6 text-base lg:text-lg leading-relaxed">
                      {featuredProduction.logline || "Coming soon to theaters near you."}
                    </p>
                    {mainUpcoming.event.title && (
                      <p className="text-slate-300 mb-2 text-sm lg:text-base leading-relaxed">
                        {mainUpcoming.event.title === "get tickets"
                          ? `exclusive engagement at ${mainUpcoming.event.location || "the theatre"}`
                          : mainUpcoming.event.location
                            ? `${mainUpcoming.event.location}`
                            : null}
                        {mainUpcoming.event.location && <br />}
                        {mainUpcoming.event.titleLink ? (
                          <Link href={mainUpcoming.event.titleLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                            {mainUpcoming.event.title}
                          </Link>
                        ) : (
                          <span className="capitalize">{mainUpcoming.event.title}</span>
                        )}
                      </p>
                    )}
                    {mainUpcoming.event.datetime && (
                      <div className="text-4xl lg:text-5xl font-light text-slate-500 mb-5">
                        {mainUpcoming.parsedDate.toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                        }).replace(/\//g, "/")}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-300 mb-6 text-base lg:text-lg leading-relaxed">
                    {featuredProduction.logline || "Coming soon to theaters near you."}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-2">

                  <Button
                    asChild
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 px-4 py-2 text-sm"
                  >
                    <Link href={`/work/${featuredProduction.slug}`}>
                      more info
                    </Link>
                  </Button>
                </div>
              </div>

            </div>

            {/* Additional Coming Soon Cards */}
            {upcomingCards.length > 0 && (
              <div className="flex gap-6 mt-12 pt-12 border-t border-slate-700">
                {/* Cards grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingCards.map((upcoming, index) => {
                      const project = upcoming.production
                      const event = upcoming.event
                      return (
                        <div
                          key={`${project.id}-upcoming-${index}`}
                          className="border border-slate-700 bg-slate-800 hover:shadow-lg transition-shadow duration-300"
                        >
                          {/* Horizontal card layout */}
                          <div className="flex flex-col sm:flex-row h-full">
                            {/* Movie Poster */}
                            <Link href={`/work/${project.slug}`} className="block w-full sm:w-32 md:w-28 lg:w-32 aspect-[3/4] sm:aspect-[2/3] bg-slate-900 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-700 flex-shrink-0 relative overflow-hidden group">
                              {project.poster?.sourceUrl ? (
                                <Image
                                  src={project.poster.sourceUrl}
                                  alt={project.poster.altText || project.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-slate-600 text-xs">[Movie Poster]</span>
                              )}
                            </Link>

                            {/* Content */}
                            <div className="flex-1 p-3 lg:p-4 flex flex-col">
                              <h3 className="text-lg lg:text-xl font-bold text-white mb-1 line-clamp-2">{project.title}</h3>
                              <p className="text-sm text-slate-400 mb-3">{formatType(project)}</p>

                              {event.datetime && (
                                <div className="mt-1 text-lg font-light text-slate-300">
                                  {upcoming.parsedDate.toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "2-digit",
                                  }).replace(/\//g, "/")}
                                </div>
                              )}
                              {event.title && event.titleLink ? (
                                <Link href={event.titleLink} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-300 hover:text-white underline mt-1 transition-colors self-start">
                                  {event.title}
                                </Link>
                              ) : event.title ? (
                                <span className="text-sm text-slate-300 mt-1 capitalize self-start">{event.title}</span>
                              ) : null}
                              <Link
                                href={`/work/${project.slug}`}
                                className="text-sm text-slate-400 underline font-medium hover:text-white transition-colors self-start mt-auto pt-3"
                              >
                                More
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Sidebar bar — only when 3 cards shown */}
                {upcomingCards.length >= 3 && (
                  <Link href="/work?section=coming-soon" className="w-8 bg-slate-600 flex-shrink-0 relative block hover:bg-slate-500 transition-colors group cursor-pointer">
                    <div className="absolute top-6 left-0 w-full flex flex-col items-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mb-16 -mt-2 group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight className="w-3 h-3 text-slate-800" />
                      </div>
                      <div className="text-white text-xs transform rotate-90 origin-center whitespace-nowrap">
                        see all coming soon events
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Collaborations - three-column horizontal layout, one row */}
      {collaborations.length > 0 && (
        <section className="py-12 bg-white pt-12">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <div className="inline-block bg-slate-700 text-white px-4 py-1 text-sm right-top-br">purely post</div>
          </div>

          <div className="flex gap-6 -mt-5">
            {/* Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborations.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Horizontal card layout */}
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Movie Poster */}
                      <Link href={`/work/${project.slug}`} className="block w-full sm:w-32 md:w-28 lg:w-32 aspect-[3/4] sm:aspect-[2/3] bg-slate-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-300 flex-shrink-0 relative overflow-hidden group">
                        {project.poster?.sourceUrl ? (
                          <Image
                            src={project.poster.sourceUrl}
                            alt={project.poster.altText || project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-slate-500 text-xs">[Movie Poster]</span>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-3 lg:p-4 flex flex-col">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{formatType(project)}</p>

                        {project.contributions && project.contributions.length > 0 && (
                          <div className="mb-4 flex-1">
                            <p className="text-xs font-medium mb-2">Our Contributions</p>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {project.contributions.slice(0, 8).map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 border border-slate-400 rounded-sm flex items-center justify-center flex-shrink-0">
                                    <div className="w-1 h-1 bg-slate-400 rounded-sm"></div>
                                  </div>
                                  <span className="truncate">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Link
                          href={`/work/${project.slug}`}
                          className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start mt-auto"
                        >
                          More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar bar — only when 3+ collaborations */}
            {collaborations.length >= 3 && (
              <Link href="/work?section=collaborations" className="w-8 bg-slate-600 flex-shrink-0 relative block hover:bg-slate-700 transition-colors group cursor-pointer">
                <div className="absolute top-6 left-0 w-full flex flex-col items-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mb-16 -mt-2 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-3 h-3 text-slate-800" />
                  </div>
                  <div className="text-white text-xs transform rotate-90 origin-center whitespace-nowrap">
                    see all collaborations
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
      )}

      {/* In Progress - horizontal layout like productions */}
      {inProgress.length > 0 && (
        <section className="py-12 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <div className="inline-block bg-amber-600 text-white px-4 py-1 text-sm right-top-br">in progress</div>
          </div>

          <div className="flex gap-6 -mt-5">
            {/* Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgress.slice(0, 3).map((project) => (
                  <div key={project.id}>
                    {/* Main card with horizontal layout */}
                    <div className="border border-slate-300 hover:shadow-lg transition-shadow duration-300 mb-2">
                      <div className="flex flex-col sm:flex-row h-full">
                        {/* Movie Poster */}
                        <Link href={`/work/${project.slug}`} className="block w-full sm:w-40 md:w-44 lg:w-40 aspect-[3/4] sm:aspect-[2/3] bg-slate-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-300 flex-shrink-0 relative overflow-hidden group">
                          {project.poster?.sourceUrl ? (
                            <Image
                              src={project.poster.sourceUrl}
                              alt={project.poster.altText || project.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="text-slate-500 text-sm">[Movie Poster]</span>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="flex-1 p-4 lg:p-5 flex flex-col">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
                          <p className="text-sm text-slate-500 mb-3">{formatType(project)}</p>
                          <div className="mb-4 max-h-[5.5rem] overflow-hidden flex-shrink-0">
                            <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
                              {project.logline || "Details coming soon."}
                            </p>
                          </div>
                          <Link
                            href={`/work/${project.slug}`}
                            className="text-sm text-slate-800 underline font-medium hover:text-slate-600 transition-colors self-start mt-auto"
                          >
                            More
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Status indicator below the card - matches poster width */}
                    <div className="flex">
                      <div className="w-full sm:w-40 md:w-44 lg:w-40 flex-shrink-0">
                        <div className="bg-slate-600 text-white px-4 py-1 text-sm">{getStatusDisplay(project)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar bar — only when 3+ in-progress */}
            {inProgress.length >= 3 && (
              <Link href="/work?section=in-progress" className="w-8 bg-amber-600 flex-shrink-0 relative block hover:bg-amber-700 transition-colors group cursor-pointer">
                <div className="absolute top-6 left-0 w-full flex flex-col items-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mb-16 -mt-2 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-3 h-3 text-amber-700" />
                  </div>
                  <div className="text-white text-xs transform rotate-90 origin-center whitespace-nowrap">
                    see all in progress
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Footer - from generalized component */}
      <Footer />
    </div>
  )
}
