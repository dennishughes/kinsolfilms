import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { fetchServices, fetchEAMSettings } from "@/lib/graphql"
import { ServiceCard } from "@/components/service-card"

export const revalidate = 60

export default async function ServicesPage() {
    const [services, settings] = await Promise.all([
        fetchServices(),
        fetchEAMSettings()
    ])
    const servicesSettings = settings?.services

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <Header siteTitle={settings?.siteTitle} siteLogo={settings?.siteLogo} />

            {/* Services Hero */}
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
                    {/* Subtle overlay so text stays readable */}
                    <div className="absolute inset-0 bg-slate-900/60" />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-light mb-8">
                            {servicesSettings?.heroTitle || "Our Services"}
                        </h1>
                        <p className="text-xl text-slate-200 leading-relaxed font-light">
                            {servicesSettings?.heroText || "Comprehensive media production services tailored to bring complex stories to life. From development to post-production, we handle every step of the creative process."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Services List */}
            <section className="py-16 bg-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-slate-500 py-12">No services found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
