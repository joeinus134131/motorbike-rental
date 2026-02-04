"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, Search, Star, MapPin, Gauge, ShieldCheck, ArrowRight } from "lucide-react";

interface Motorbike {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  status: string;
  description: string | null;
}

export default function CatalogList({ initialMotorbikes }: { initialMotorbikes: Motorbike[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBikes = initialMotorbikes.filter(bike => 
    bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header Section with Search */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                <Bike size={18} />
                <span>Premium Catalog</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Pilih Unit Favoritmu</h1>
              <p className="text-gray-500 font-medium text-lg max-w-2xl">Jelajahi berbagai pilihan motor terbaru dengan performa maksimal dan harga yang kompetitif.</p>
            </div>
            
            <div className="flex items-center gap-4 justify-center md:justify-end">
               <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 w-full md:w-80 group focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <Search size={20} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Cari motor idaman..." 
                    className="bg-transparent border-none outline-none font-bold text-gray-900 text-sm placeholder:text-gray-300 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBikes.map((bike) => (
            <div key={bike.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={bike.imageUrl} 
                  alt={bike.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    bike.status === 'available' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-400 text-white'
                  }`}>
                    {bike.status === 'available' ? 'Available' : 'Rented'}
                  </span>
                </div>
                {bike.status === 'available' && (
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/50 shadow-lg">
                       <Star className="text-amber-500 fill-amber-500" size={14} />
                       <span className="text-xs font-black text-gray-900">4.9 (42 Reviews)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Link href={`/motorbikes/${bike.id}`} className="block group/title">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1 group-hover/title:text-primary transition-colors">{bike.name}</h3>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{bike.brand} • {bike.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary italic leading-none mb-1">Rp {bike.pricePerDay.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per hari</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl">
                    <Gauge size={16} className="text-primary" />
                    <span className="text-xs font-bold text-gray-600">Low Miles</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl">
                    <ShieldCheck size={16} className="text-primary" />
                    <span className="text-xs font-bold text-gray-600">Berasuransi</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <Link 
                    href={bike.status === 'available' ? `/bookings/new?bikeId=${bike.id}` : "#"} 
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                      bike.status === 'available' 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {bike.status === 'available' ? (
                      <>
                        Sewa Sekarang
                        <ArrowRight size={16} />
                      </>
                    ) : 'Sdh Disewa'}
                  </Link>
                  <button className="p-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all border border-transparent hover:border-gray-200">
                    <Star size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBikes.length === 0 && (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-200/50 border border-gray-50">
              <Bike size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Unit Tidak Ditemukan</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto mb-10">Maaf, kami tidak dapat menemukan motor dengan nama atau brand "{searchTerm}". Coba kata kunci lain!</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl"
            >
               Tampilkan Semua Unit
            </button>
          </div>
        )}
      </section>
    </>
  );
}
