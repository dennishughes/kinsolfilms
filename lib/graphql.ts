const GRAPHQL_ENDPOINT = "https://kinsolfilms.empressave.com/graphql"

export interface CrewMember {
  name: string
  link?: string
  title: string | string[]
  customRole?: string
  featured?: boolean
}

export interface CastMember {
  castMember: string
  link?: string
  role: string
  featuredCast?: boolean
}

// --- EAM Settings Types ---

export interface SocialLink {
  socialIconKey?: string
  socialName?: string
  socialUrl?: string
}

export interface EAMSettings {
  siteTitle?: string
  siteLogo?: string
  socialLinks?: SocialLink[]
  homepage?: {
    pageTitle?: string
    heroTitle?: string
    heroText?: string
    heroButtonTitle?: string
    heroButtonUrl?: string
  }
  about?: {
    pageTitle?: string
    heroTitle?: string
    heroText?: string
    ourMissionTitle?: string
    ourMissionText?: string
    ourMissionImage?: string
    ourTeamTitle?: string
    awardsRecognitionTile?: string
    getInTouchContent?: string
    awardsRecognition?: {
      award?: string
      awardImage?: string
      type?: string
    }[]
  }
  work?: {
    pageTitle?: string
    heroTitle?: string
    heroText?: string
  }
  services?: {
    pageTitle?: string
    heroTitle?: string
    heroText?: string
  }
}

const EAM_SETTINGS_QUERY = `
  query GetEAMSettings {
    eamSettingsPage {
      eamSettingsGroup {
        siteTitle
        siteLogo {
          node {
            sourceUrl
          }
        }
        socialLinks {
          socialIconKey
          socialName
          socialUrl
        }
        pageContent {
          __typename
          ... on EamSettingsGroupPageContentHomepageLayout {
            pageTitle
            heroTitle
            heroText
            heroButtonTitle
            heroButtonUrl
          }
          ... on EamSettingsGroupPageContentAboutLayout {
            pageTitle
            heroTitle
            heroText
            ourMissionTitle
            ourMissionText
            ourMissionImage {
              node {
                sourceUrl
              }
            }
            ourTeamTitle
            awardsRecognitionTile
            getInTouchContent
            awardsRecognition {
              award
              awardImage {
                node {
                  sourceUrl
                }
              }
              type
            }
          }
          ... on EamSettingsGroupPageContentWorkLayout {
            pageTitle
            heroTitle
            heroText
          }
          ... on EamSettingsGroupPageContentServicesLayout {
            pageTitle
            heroTitle
            heroText
          }
        }
      }
    }
  }
`

function replaceBranding(text: string | null | undefined): string | undefined {
  if (!text) return undefined
  return text.replace(/Empress Avenue Media/gi, "Kinsol Films")
}

export async function fetchEAMSettings(): Promise<EAMSettings | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: EAM_SETTINGS_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const group = json.data?.eamSettingsPage?.eamSettingsGroup
    if (!group) return null

    const settings: EAMSettings = {
      siteTitle: replaceBranding(group.siteTitle),
      siteLogo: group.siteLogo?.node?.sourceUrl,
      socialLinks: group.socialLinks || [],
    }

    if (group.pageContent && Array.isArray(group.pageContent)) {
      for (const layout of group.pageContent) {
        if (layout.__typename === "EamSettingsGroupPageContentHomepageLayout") {
          settings.homepage = {
            pageTitle: replaceBranding(layout.pageTitle),
            heroTitle: replaceBranding(layout.heroTitle),
            heroText: replaceBranding(layout.heroText),
            heroButtonTitle: replaceBranding(layout.heroButtonTitle),
            heroButtonUrl: layout.heroButtonUrl,
          }
        } else if (layout.__typename === "EamSettingsGroupPageContentAboutLayout") {
          settings.about = {
            pageTitle: replaceBranding(layout.pageTitle),
            heroTitle: replaceBranding(layout.heroTitle),
            heroText: replaceBranding(layout.heroText),
            ourMissionTitle: replaceBranding(layout.ourMissionTitle),
            ourMissionText: replaceBranding(layout.ourMissionText),
            ourMissionImage: layout.ourMissionImage?.node?.sourceUrl,
            ourTeamTitle: replaceBranding(layout.ourTeamTitle),
            awardsRecognitionTile: replaceBranding(layout.awardsRecognitionTile),
            getInTouchContent: replaceBranding(layout.getInTouchContent),
            awardsRecognition: layout.awardsRecognition?.map((a: any) => ({
              award: replaceBranding(a.award),
              awardImage: a.awardImage?.node?.sourceUrl,
              type: replaceBranding(a.type)
            })),
          }
        } else if (layout.__typename === "EamSettingsGroupPageContentWorkLayout") {
          settings.work = {
            pageTitle: replaceBranding(layout.pageTitle),
            heroTitle: replaceBranding(layout.heroTitle),
            heroText: replaceBranding(layout.heroText),
          }
        } else if (layout.__typename === "EamSettingsGroupPageContentServicesLayout") {
          settings.services = {
            pageTitle: replaceBranding(layout.pageTitle),
            heroTitle: replaceBranding(layout.heroTitle),
            heroText: replaceBranding(layout.heroText),
          }
        }
      }
    }

    return settings
  } catch (error) {
    console.error("Error fetching EAM settings:", error)
    return null
  }
}


export interface Award {
  award: string
  awardImage?: {
    sourceUrl: string
  }
  type?: string
}

export interface GalleryImage {
  sourceUrl: string
  altText?: string
  description?: string
  caption?: string
}

export interface ComingSoonEvent {
  title: string
  titleLink?: string
  datetime?: string
  location?: string
  address?: string
}

export interface LinksMediaItem {
  title?: string
  titleLink?: string
  description?: string
}

export interface WatchEngageItem {
  type?: string
  link?: string
  watchImage?: {
    id?: string
    sourceUrl?: string
  }
}

export interface GenreNode {
  name: string
}

export interface Production {
  id: string
  slug: string
  title: string
  filmType?: string
  durationMinutes?: number
  releaseDate?: string
  releaseYear?: string
  status?: string
  synopsis?: string
  logline?: string
  trailerUrl?: string
  websiteUrl?: string
  imdbUrl?: string
  contributions?: string[]
  poster?: {
    sourceUrl: string
    altText?: string
  }
  genres?: string[]
  genreTerms?: GenreNode[]
  awards?: Award[]
  imageGallery?: GalleryImage[]
  crew?: CrewMember[]
  cast?: CastMember[]
  comingSoon?: ComingSoonEvent[]
  linksMedia?: LinksMediaItem[]
  watchEngage?: WatchEngageItem[]
  licensingContactName?: string
  licensingContactEmail?: string
  licensingContactPhone?: string
  // From group field
  featured?: boolean
  collaboration?: boolean
}

// GraphQL query to fetch all productions - matching exact schema
const PRODUCTIONS_QUERY = `
  query GetProductions {
    productionItems(first: 1000) {
      nodes {
        title
        productionItemId
        slug
        genres {
          nodes {
            name
          }
        }
        production {
          durationMinutes
          filmType
          releaseDate
          releaseYear
          status
          synopsis
          logline
          trailerUrl
          websiteUrl
          imdbUrl
          licensingContactEmail
          licensingContactName
          licensingContactPhone
          contributions
          posterUrl {
            node {
              sourceUrl(size: LARGE)
            }
          }
          imageGallery {
            edges {
              node {
                sourceUrl
                altText
                description
                caption
              }
            }
          }
          group {
            featured
            collaboration
          }
          awards {
            award
            type
            awardImage {
              node {
                sourceUrl
              }
            }
          }
          cast {
            castMember
            role
            link
            featuredCast
          }
          crew {
            name
            title
            customRole
            link
            featured
          }
          watchEngage {
            type
            link
            watchImage {
              node {
                id
                sourceUrl
              }
            }
          }
          comingSoon {
            title
            titleLink
            datetime
            location
            address
          }
          linksMedia {
            title
            titleLink
            description
          }
        }
      }
    }
  }
`

// GraphQL query to fetch a single production by slug
const PRODUCTION_BY_SLUG_QUERY = `
  query GetProductionBySlug($slug: ID!) {
    productionItem(id: $slug, idType: SLUG) {
      title
      productionItemId
      slug
      genres {
        nodes {
          name
        }
      }
      production {
        durationMinutes
        filmType
        releaseDate
        releaseYear
        status
        synopsis
        logline
        trailerUrl
        websiteUrl
        imdbUrl
        licensingContactEmail
        licensingContactName
        licensingContactPhone
        contributions
        posterUrl {
          node {
            sourceUrl(size: LARGE)
          }
        }
        imageGallery {
          edges {
            node {
              sourceUrl
              altText
              description
              caption
            }
          }
        }
        group {
          featured
          collaboration
        }
        awards {
          award
          type
          awardImage {
            node {
              sourceUrl
            }
          }
        }
        cast {
          castMember
          role
          link
          featuredCast
        }
        crew {
          name
          title
          customRole
          link
          featured
        }
        watchEngage {
          type
          link
          watchImage {
            node {
              id
              sourceUrl
            }
          }
        }
        comingSoon {
          title
          titleLink
          datetime
          location
          address
        }
        linksMedia {
          title
          titleLink
          description
        }
      }
    }
  }
`

// Helper function to transform GraphQL response to our Production type
function transformProduction(node: any): Production {
  const fields = node.production || {}

  // Extract genre names from taxonomy (genres is at root level, not inside production)
  const genreNodes = node.genres?.nodes || []
  const genres = genreNodes.map((g: any) => g.name)

  // Group has featured and collaboration as boolean fields
  const isFeatured = fields.group?.featured === true
  const isCollaboration = fields.group?.collaboration === true

  // Debug: Log all production fields to find the hidden description field
  console.log("[v0] Production fields for", node.title, ":", Object.keys(fields))

  // Status can be a string or an object with a name property
  let status = "Released"
  if (typeof fields.status === "string" && fields.status) {
    status = fields.status
  } else if (fields.status && typeof fields.status === "object" && fields.status.name) {
    status = fields.status.name
  } else if (Array.isArray(fields.status) && fields.status.length > 0) {
    // Handle if status is an array
    status = typeof fields.status[0] === "string" ? fields.status[0] : fields.status[0]?.name || "Released"
  }

  return {
    id: node.productionItemId?.toString() || node.slug,
    slug: node.slug,
    title: node.title,
    filmType: fields.filmType || "Feature",
    durationMinutes: fields.durationMinutes,
    releaseDate: fields.releaseDate,
    releaseYear: fields.releaseYear,
    status,
    synopsis: fields.synopsis,
    logline: fields.logline,
    trailerUrl: fields.trailerUrl,
    websiteUrl: fields.websiteUrl,
    imdbUrl: fields.imdbUrl,
    contributions: fields.contributions || [],
    poster: fields.posterUrl?.node ? {
      sourceUrl: fields.posterUrl.node.sourceUrl,
      altText: node.title,
    } : undefined,
    genres,
    genreTerms: genreNodes,
    featured: isFeatured,
    collaboration: isCollaboration,
    awards: fields.awards?.map((a: any) => ({
      award: a.award,
      type: a.type,
      awardImage: a.awardImage?.node ? { sourceUrl: a.awardImage.node.sourceUrl } : undefined,
    })) || [],
    imageGallery: fields.imageGallery?.edges?.map((edge: any) => ({
      sourceUrl: edge.node.sourceUrl,
      altText: edge.node.altText,
      description: edge.node.description,
      caption: edge.node.caption,
    })) || [],
    crew: fields.crew || [],
    cast: fields.cast || [],
    comingSoon: fields.comingSoon || [],
    linksMedia: fields.linksMedia || [],
    watchEngage: fields.watchEngage?.map((w: any) => ({
      type: w.type,
      link: w.link,
      watchImage: w.watchImage?.node ? {
        id: w.watchImage.node.id,
        sourceUrl: w.watchImage.node.sourceUrl,
      } : undefined,
    })) || [],
    licensingContactName: fields.licensingContactName,
    licensingContactEmail: fields.licensingContactEmail,
    licensingContactPhone: fields.licensingContactPhone,
  }
}

export async function fetchProductions(): Promise<Production[]> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PRODUCTIONS_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const nodes = json.data?.productionItems?.nodes || []
    return nodes.map(transformProduction)
  } catch (error) {
    console.error("Error fetching productions:", error)
    throw error
  }
}

export async function fetchProductionBySlug(slug: string): Promise<Production | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PRODUCTION_BY_SLUG_QUERY,
        variables: { slug },
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const node = json.data?.productionItem
    if (!node) return null

    return transformProduction(node)
  } catch (error) {
    console.error("Error fetching production:", error)
    return null
  }
}

// Helper to safely get status as lowercase string
function getStatusString(p: Production): string {
  if (typeof p.status === "string") {
    return p.status.toLowerCase()
  }
  return ""
}

// Helper functions to filter productions
// WordPress status values: "Released", "Coming Soon", "In Development", "In Production", "In Post"
export function getOurProductions(productions: Production[]): Production[] {
  // Show non-collaboration productions that are released
  return productions.filter(p => {
    if (p.collaboration) return false
    const status = getStatusString(p)
    // Only show released productions (or empty status which defaults to released)
    return status === "" || status === "released"
  })
}

export function getCollaborations(productions: Production[]): Production[] {
  return productions.filter(p => p.collaboration)
}

export function getInProgressProductions(productions: Production[]): Production[] {
  // Matches: "In Development", "In Pre-Production", "In Production", "In Post"
  return productions.filter(p => {
    const status = getStatusString(p)
    return (
      status === "in development" ||
      status === "in pre-production" ||
      status === "in production" ||
      status === "in post"
    )
  })
}

export function getComingSoonProductions(productions: Production[]): Production[] {
  const now = new Date()
  return productions.filter(p => {
    const status = getStatusString(p)

    // If status is explicitly "coming soon", always include it —
    // the admin controls the lifecycle; event dates are just card details.
    if (status === "coming soon") return true

    // Otherwise only include if there is at least one future-dated event
    // (catches productions without a formal status but with upcoming events)
    if (p.comingSoon && p.comingSoon.length > 0) {
      return p.comingSoon.some(event => {
        if (!event.datetime) return true // undated event = treat as future
        const parsed = new Date(event.datetime)
        return !isNaN(parsed.getTime()) && parsed > now
      })
    }

    return false
  })
}

export function getFeaturedProduction(productions: Production[]): Production | undefined {
  // First try to find one marked as featured
  const featured = productions.find(p => p.featured)
  if (featured) return featured

  // Otherwise return the first one with coming soon events
  return productions.find(p => p.comingSoon && p.comingSoon.length > 0)
}

export interface UpcomingEvent {
  production: Production
  event: ComingSoonEvent
  parsedDate: Date
}

export function getUpcomingEvents(productions: Production[]): UpcomingEvent[] {
  const events: UpcomingEvent[] = []
  const now = new Date()

  for (const p of productions) {
    if (p.comingSoon && p.comingSoon.length > 0) {
      for (const event of p.comingSoon) {
        if (event.datetime) {
          const parsed = new Date(event.datetime)
          // Include if valid date and in the future
          if (!isNaN(parsed.getTime()) && parsed > now) {
            events.push({ production: p, event, parsedDate: parsed })
          }
        }
      }
    }
  }

  // Sort by date ascending
  return events.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
}

/**
 * Sorts productions by release year, newest first.
 */
export function sortProductionsByYear(productions: Production[]): Production[] {
  return [...productions].sort((a, b) => {
    const yearA = parseInt(a.releaseYear || "0", 10)
    const yearB = parseInt(b.releaseYear || "0", 10)
    
    // Sort by year descending (newest first)
    if (yearB !== yearA) {
      return yearB - yearA
    }
    
    // Secondary sort by title if years are the same
    return (a.title || "").localeCompare(b.title || "")
  })
}

// --- Services ---

export interface Service {
  id: string
  slug: string
  title: string
  content?: string
  image?: string
  category?: string
}

const SERVICES_QUERY = `
  query Services {
    eamServices(first: 100) {
      nodes {
        id
        slug
        title
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        eamServices {
          title
        }
      }
    }
  }
`

export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: SERVICES_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const nodes = json.data?.eamServices?.nodes || []
    return nodes.map((node: any) => ({
      id: node.id,
      slug: node.slug,
      title: node.title,
      content: node.content,
      category: node.eamServices?.title,
      image: node.featuredImage?.node?.sourceUrl,
    }))
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

// --- Team Members ---

export interface TeamMember {
  id: string
  name: string
  content?: string
  role?: string
  image?: string
}

const TEAM_MEMBERS_QUERY = `
  query TeamMembers {
    teamMembers(first: 100) {
      nodes {
        id
        title
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        eamTeam {
          title
        }
      }
    }
  }
`

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: TEAM_MEMBERS_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const nodes = json.data?.teamMembers?.nodes || []
    return nodes.map((node: any) => ({
      id: node.id,
      name: node.title,
      content: node.content,
      role: node.eamTeam?.title,
      image: node.featuredImage?.node?.sourceUrl,
    }))
  } catch (error) {
    console.error("Error fetching team members:", error)
    return []
  }
}

// --- Works ---

export interface WorkImage {
  sourceUrl: string
  altText?: string
}

export interface InteractiveDesignItem {
  link?: string
  image2?: {
    node: WorkImage
  }
}

export interface WorksData {
  interactiveDesign: InteractiveDesignItem[]
  flyersAds: WorkImage[]
  logoDesign: WorkImage[]
  posterArt: WorkImage[]
}

const WORKS_QUERY = `
  query Works {
    works {
      eamWork {
        interactiveDesign {
          link
          image2 {
            node {
              sourceUrl
            }
          }
        }
        flyersAds {
          edges {
            node {
              sourceUrl
            }
          }
        }
        logoDesign {
          edges {
            node {
              sourceUrl
            }
          }
        }
        posterArt {
          edges {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`

export async function fetchWorks(): Promise<WorksData | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: WORKS_QUERY,
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    if (json.errors) {
      console.error("GraphQL errors:", json.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    const eamWork = json.data?.works?.eamWork

    if (!eamWork) return null

    return {
      interactiveDesign: eamWork.interactiveDesign || [],
      flyersAds: eamWork.flyersAds?.edges?.map((edge: any) => edge.node) || [],
      logoDesign: eamWork.logoDesign?.edges?.map((edge: any) => edge.node) || [],
      posterArt: eamWork.posterArt?.edges?.map((edge: any) => edge.node) || [],
    }
  } catch (error) {
    console.error("Error fetching works:", error)
    return null
  }
}
