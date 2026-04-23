import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Award } from "lucide-react"
import { fetchTeamMembers, fetchEAMSettings } from "@/lib/graphql"
import { TeamMemberCard } from "@/components/team-member-card"

export const revalidate = 60

export default async function AboutPage() {
  const [teamMembers, settings] = await Promise.all([
    fetchTeamMembers(),
    fetchEAMSettings()
  ])
  const aboutSettings = settings?.about

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header siteTitle={settings?.siteTitle} siteLogo={settings?.siteLogo} />

      {/* About Hero */}
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
          {/* Optional: Add a subtle overlay so text stays readable */}
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light mb-8">
              {aboutSettings?.heroTitle || "About Kinsol Films"}
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed font-light">
              {aboutSettings?.heroText || "We are a film production company dedicated to creating meaningful media that explores important social issues and tells compelling human stories."}
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 mb-6">
                our mission
              </Badge>
              <h2 className="text-3xl font-light mb-6">
                {aboutSettings?.ourMissionTitle || "Creating Impact Through Storytelling"}
              </h2>
              {aboutSettings?.ourMissionText ? (
                <div
                  className="prose prose-slate prose-p:text-slate-700 max-w-none"
                  dangerouslySetInnerHTML={{ __html: aboutSettings.ourMissionText }}
                />
              ) : (
                <>
                  <p className="text-slate-700 mb-6">
                    At Kinsol Films, we believe in the power of film to create social change. Our productions focus
                    on underrepresented voices and critical social issues, bringing awareness and fostering dialogue through
                    compelling storytelling.
                  </p>
                  <p className="text-slate-700">
                    From documentaries that expose social injustices to narrative films that explore human resilience, every
                    project we undertake is driven by our commitment to meaningful media.
                  </p>
                </>
              )}
            </div>
            <div className="relative aspect-video">
              <Image
                src={aboutSettings?.ourMissionImage || "/hero-filmmaker.jpeg"}
                alt={aboutSettings?.ourMissionTitle || "Film production"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 mb-6">
                our team
              </Badge>
              <h2 className="text-3xl font-light">
                {aboutSettings?.ourTeamTitle || "The Creative Minds Behind Our Films"}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards & Recognition */}
      {aboutSettings?.awardsRecognition && aboutSettings.awardsRecognition.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 mb-6">
                awards & recognition
              </Badge>
              <h2 className="text-3xl font-light">
                {aboutSettings?.awardsRecognitionTile || "Celebrating Excellence in Filmmaking"}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutSettings.awardsRecognition.map((item, index) => (
                <Card key={index} className="text-center p-6 flex flex-col items-center">
                  {item.awardImage ? (
                    <div className="relative w-full h-24 mb-6">
                      <Image
                        src={item.awardImage}
                        alt={item.award || "Award"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-800">
                        <Award className="w-8 h-8" />
                      </div>
                    </div>
                  )}
                  {item.award && <p className="text-sm font-medium">{item.award}</p>}
                  {item.type && <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">{item.type}</p>}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get in Touch */}
      <section className="py-16 bg-slate-800 text-white text-center">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 mb-6 border-none">
            get in touch
          </Badge>
          {aboutSettings?.getInTouchContent ? (
            <div
              className="max-w-3xl mx-auto prose prose-invert prose-p:text-slate-300 prose-p:text-lg prose-a:text-blue-400 hover:prose-a:text-blue-300"
              dangerouslySetInnerHTML={{ __html: aboutSettings.getInTouchContent }}
            />
          ) : (
            <>
              <h2 className="text-3xl font-light mb-8">Contact Us</h2>
              <div className="max-w-2xl mx-auto space-y-6 text-slate-300 text-lg">
                <p>
                  <a href="tel:1-250-709-7095" className="hover:text-white transition-colors">1-250-709-7095</a>
                </p>
                <p>
                  <a href="mailto:info@kinsolfilms.ca" className="hover:text-white transition-colors">info@kinsolfilms.ca</a>
                </p>
                <p className="pt-6 border-t border-slate-700 leading-relaxed">
                  Kinsol Films is named after the Kinsol Trestle near its location in
                  Cobble Hill, south of Duncan, BC on Vancouver Island in the beautiful Cowichan Valley.
                </p>
              </div>
            </>
          )}
        </div>
      </section >

      {/* Footer */}
      < Footer />
    </div >
  )
}
