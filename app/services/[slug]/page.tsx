import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { fetchServices } from "@/lib/graphql"
import { Badge } from "@/components/ui/badge"

export const revalidate = 60

// Generate static params for all services
export async function generateStaticParams() {
    const services = await fetchServices()
    return services.map((service) => ({
        slug: service.slug,
    }))
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const services = await fetchServices()
    const service = services.find(s => s.slug === params.slug)

    if (!service) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <Header />

            {/* Service Hero */}
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
                    <div className="absolute inset-0 bg-slate-900/60" />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {service.category && (
                            <Badge variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 mb-6 border-none">
                                {service.category}
                            </Badge>
                        )}
                        <h1 className="text-5xl md:text-7xl font-light mb-8">{service.title}</h1>

                        <Link href="/services" className="inline-flex items-center justify-center space-x-2 text-slate-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Services</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Service Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {service.image && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-12 shadow-md">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-light">
                            <div dangerouslySetInnerHTML={{ __html: service.content || '' }} />
                        </div>

                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <h3 className="text-2xl font-light mb-4">Ready to start your project?</h3>
                            <p className="text-slate-600 mb-6">
                                Get in touch with us today to discuss how our {service.title} services can bring your vision to life.
                            </p>
                            <Link
                                href="/about"
                                className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-md transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
