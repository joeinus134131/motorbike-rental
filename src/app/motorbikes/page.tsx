import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogList from "@/components/CatalogList";
import Link from "next/link";
import { getCMSConfig } from "@/lib/cms";

export default async function MotorbikesPage() {
  const [motorbikes, cmsConfig] = await Promise.all([
    prisma.motorbike.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getCMSConfig()
  ]);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar brandName={cmsConfig.brandName} />
      
      <CatalogList initialMotorbikes={motorbikes} />

      {/* CTA Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-16 relative overflow-hidden text-center md:text-left shadow-2xl shadow-gray-200">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{cmsConfig.ctaTitle || "Butuh Motor Custom Berbeda?"}</h2>
                <p className="text-gray-400 font-medium text-lg leading-relaxed">{cmsConfig.ctaDescription || "Hubungi admin kami untuk permintaan unit khusus atau penyewaan jangka panjang."}</p>
              </div>
              <Link href="/contact" className="px-12 py-6 bg-white text-gray-900 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-2xl">
                 {cmsConfig.ctaButtonText || "Chat WhatsApp Admin"}
              </Link>
           </div>
        </div>
      </section>
      <Footer 
        brandName={cmsConfig.brandName}
        brandDescription={cmsConfig.brandDescription || undefined}
        contactEmail={cmsConfig.contactEmail}
        contactPhone={cmsConfig.contactPhone}
        address={cmsConfig.address}
        instagramUrl={cmsConfig.instagramUrl || undefined}
        twitterUrl={cmsConfig.twitterUrl || undefined}
        facebookUrl={cmsConfig.facebookUrl || undefined}
      />
    </main>
  );
}
