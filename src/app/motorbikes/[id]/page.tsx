import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Bike, 
  ChevronRight, 
  Star, 
  MapPin, 
  Gauge, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Calendar,
  Fuel,
  Settings
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MotorbikeDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const bike = await prisma.motorbike.findUnique({
    where: { id: params.id }
  });

  if (!bike) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Breadcrumbs */}
      <section className="pt-32 pb-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/motorbikes" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">{bike.name}</span>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Image Gallery (Simplified for now) */}
            <div className="space-y-8">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 group relative">
                <img 
                  src={bike.imageUrl} 
                  alt={bike.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-8 left-8">
                  <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${
                    bike.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {bike.status === 'available' ? 'Ready to Rent' : 'Already Rented'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer bg-gray-100">
                    <img src={bike.imageUrl} alt={`${bike.name} ${i}`} className="w-full h-full object-cover opacity-60 hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info & Booking */}
            <div className="flex flex-col">
              <div className="mb-10">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                  <Zap size={14} />
                  <span>{bike.brand} Premium Unit</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">{bike.name}</h1>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <Star className="text-amber-500 fill-amber-500" size={16} />
                      <span className="text-sm font-black text-gray-900 underline underline-offset-4 decoration-primary/30">4.9 (128 Customer Feedback)</span>
                   </div>
                   <div className="w-1 h-1 bg-gray-300 rounded-full" />
                   <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span className="text-sm font-bold">Jakarta Selatan</span>
                   </div>
                </div>
              </div>

              {/* Price Tag (Glassmorphism) */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 mb-10 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rental Price</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-primary italic">Rp {bike.pricePerDay.toLocaleString()}</span>
                       <span className="text-sm font-bold text-gray-400 italic">/ day</span>
                    </div>
                 </div>
                 <div className="w-px h-12 bg-gray-100" />
                 <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Status</p>
                    <p className="text-sm font-black text-emerald-600 uppercase">Instantly Available</p>
                 </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">Deskripsi Unit</h3>
                 <p className="text-gray-500 font-medium leading-relaxed">
                   {bike.description || `${bike.name} model tahun ${bike.year} dari brand ${bike.brand}. Motor ini dalam kondisi prima dan siap untuk menemani perjalanan Anda dengan performa mesin yang tangguh dan konsumsi bahan bakar yang efisien.`}
                 </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                 <SpecBox icon={<Calendar size={18} />} label="Tahun" value={bike.year.toString()} />
                 <SpecBox icon={<Fuel size={18} />} label="Fuel" value="Petrol" />
                 <SpecBox icon={<Gauge size={18} />} label="Mileage" value="Low KM" />
                 <SpecBox icon={<Settings size={18} />} label="Trans" value="Automatic" />
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-4">
                 <Link 
                  href={bike.status === 'available' ? `/bookings/new?bikeId=${bike.id}` : "#"} 
                  className={`w-full py-6 flex items-center justify-center gap-3 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all ${
                    bike.status === 'available' 
                      ? 'bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] hover:bg-orange-600' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                 >
                    {bike.status === 'available' ? (
                      <>
                        Book Now • Fast Checkout
                        <ArrowRight size={20} />
                      </>
                    ) : 'Unit Out of Stock'}
                 </Link>
                 <button className="w-full py-6 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                    <ShieldCheck size={16} />
                    Check Insurance Details
                 </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-3xl group hover:border-primary/30 transition-all shadow-sm">
       <div className="text-primary mb-3 group-hover:scale-110 transition-transform">{icon}</div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{value}</p>
    </div>
  );
}
