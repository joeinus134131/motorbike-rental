import prisma from "@/lib/prisma";
import { Motorbike } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bike, ShieldCheck, Clock, MapPin, Star, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCMSConfig } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cmsConfig = await getCMSConfig();

  const motorbikes = await prisma.motorbike.findMany({
    where: { status: "available" },
    orderBy: [
      { bookings: { _count: "desc" } },
      { createdAt: "desc" }
    ],
    take: 6,
  });

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar brandName={cmsConfig.brandName} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={cmsConfig.heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fafafa]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-3xl text-white">
            <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom duration-700">
              {cmsConfig.heroBadge || "Premium Rental Experience"}
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl animate-in fade-in slide-in-from-bottom duration-1000">
              {cmsConfig.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              {cmsConfig.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <Link
                href="#bikes"
                className="px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all text-lg flex items-center gap-2"
              >
                {cmsConfig.heroButtonText || "Jelajahi Armada"}
                <ArrowRight size={20} />
              </Link>
              <div className="flex items-center gap-4 px-6 py-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60 block">Status</span>
                  <span className="text-sm font-black text-white">Open 24/7 Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Floating Over Hero */}
      <section className="relative z-20 -mt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white hover:bg-white transition-all duration-500 hover:-translate-y-4">
              <div className="w-20 h-20 bg-orange-50 text-primary rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                <Bike size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{cmsConfig.feature1Title || "Unit Terbaru"}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{cmsConfig.feature1Description || "Seluruh unit motor kami dijamin dalam kondisi prima dengan perawatan rutin berkala."}</p>
            </div>
            
            <div className="group bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl shadow-orange-200/20 border border-orange-100/50 hover:bg-white transition-all duration-500 hover:-translate-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-10 group-hover:-rotate-6 transition-transform">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase text-gray-900">{cmsConfig.feature2Title || "Proteksi Penuh"}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{cmsConfig.feature2Description || "Nikmati perjalanan tanpa cemas dengan proteksi asuransi komprehensif di setiap kilometer."}</p>
            </div>

            <div className="group bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white hover:bg-white transition-all duration-500 hover:-translate-y-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{cmsConfig.feature3Title || "Booking Kilat"}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{cmsConfig.feature3Description || "Proses verifikasi dan pengambilan unit yang efisien, langsung berangkat dalam 15 menit."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section id="bikes" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[100px] -ml-48 -mt-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] -mr-48 -mb-48" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-4 block">{cmsConfig.featuredSectionSubtitle || "Fleet selection"}</span>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">{cmsConfig.featuredSectionTitle || "Armada Favorit Musim Ini"}</h2>
            </div>
            <Link 
              href="/motorbikes" 
              className="group flex items-center gap-4 px-8 py-4 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all duration-500 font-black text-sm uppercase tracking-widest shadow-inner"
            >
              Lihat Semua
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {motorbikes.map((bike: Motorbike) => (
              <div key={bike.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                <div className="relative h-72 overflow-hidden px-6 pt-6">
                  <div className="absolute top-10 left-10 z-20">
                    <span className="px-5 py-2 bg-white/90 backdrop-blur-xl text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/50">
                      {bike.brand}
                    </span>
                  </div>
                  <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-1000 ease-out shadow-xl"
                  />
                  <div className="absolute bottom-10 right-10 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-lg">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-gray-900">4.9</span>
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-3xl font-black mb-3 group-hover:text-primary transition-colors tracking-tight leading-none">{bike.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">
                    <MapPin size={14} className="text-primary" />
                    <span>Tersedia: Jakarta & Bali</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[2rem] group-hover:bg-indigo-50/50 transition-colors">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest block mb-1">Price per day</span>
                      <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">
                        Rp {bike.pricePerDay.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/motorbikes/${bike.id}`}
                      className="w-16 h-16 bg-gray-900 text-white rounded-3xl flex items-center justify-center hover:bg-primary transition-all shadow-xl active:scale-90"
                    >
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <span className="text-5xl font-black block mb-2 text-primary">{cmsConfig.stat1Value || "500+"}</span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{cmsConfig.stat1Label || "Units Available"}</span>
          </div>
          <div>
            <span className="text-5xl font-black block mb-2 text-primary">{cmsConfig.stat2Value || "15k+"}</span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{cmsConfig.stat2Label || "Happy Riders"}</span>
          </div>
          <div>
            <span className="text-5xl font-black block mb-2 text-primary">{cmsConfig.stat3Value || "24h"}</span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{cmsConfig.stat3Label || "Support Service"}</span>
          </div>
          <div>
            <span className="text-5xl font-black block mb-2 text-primary">{cmsConfig.stat4Value || "4.9"}</span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{cmsConfig.stat4Label || "Trustpilot Score"}</span>
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
