"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Bike, Calendar, CreditCard, ChevronRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";

function BookingForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bikeId = searchParams.get("bikeId");

  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/bookings/new?bikeId=${bikeId}`);
      return;
    }

    if (bikeId) {
      fetch(`/api/admin/motorbikes`)
        .then(res => res.json())
        .then(data => {
          const found = data.find((b: any) => b.id === bikeId);
          setBike(found);
          setLoading(false);
        });
    }
  }, [bikeId, status]);

  const calculateDays = () => {
    if (!dates.start || !dates.end) return 0;
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const totalPrice = bike ? calculateDays() * bike.pricePerDay : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalPrice) return alert("Pilih tanggal yang valid!");

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motorbikeId: bikeId,
          startDate: dates.start,
          endDate: dates.end,
          totalPrice,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Gagal melakukan pemesanan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === "loading") return (
    <div className="flex h-screen items-center justify-center">
       <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!bike) return <div className="p-20 text-center">Unit tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24">
      <Navbar />
      
      <div className="pt-32 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Details */}
          <div className="lg:col-span-2">
             <div className="mb-10">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                   <Sparkles size={14} />
                   <span>Secure Checkout</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Konfirmasi Pemesanan</h1>
                <p className="text-gray-500 font-medium">Lengkapi detail perjalanan Anda untuk segera mengamankan unit ini.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
                   <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Pilih Jadwal Sewa</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tanggal Mulai</label>
                        <input 
                          type="date" 
                          required
                          className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold outline-none"
                          value={dates.start}
                          onChange={(e) => setDates({...dates, start: e.target.value})}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tanggal Selesai</label>
                        <input 
                          type="date" 
                          required
                          className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold outline-none"
                          value={dates.end}
                          onChange={(e) => setDates({...dates, end: e.target.value})}
                          min={dates.start || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
                   <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Informasi Personal</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Penyewa</p>
                        <p className="text-lg font-black text-gray-900 ml-1">{session?.user?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</p>
                        <p className="text-lg font-black text-gray-900 ml-1">{session?.user?.email}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem]">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-gray-900 text-sm">Proteksi Keamanan</h4>
                      <p className="text-xs text-gray-500 font-medium">Pembayaran Anda dilindungi dengan enkripsi 256-bit dan asuransi unit standar.</p>
                   </div>
                </div>
             </form>
          </div>

          {/* Price Summary Sticky */}
          <div>
             <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 sticky top-32">
                <div className="relative h-40 rounded-2xl overflow-hidden mb-8 shadow-lg">
                   <img src={bike.imageUrl} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-4 left-4">
                      <h4 className="text-white font-black">{bike.name}</h4>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{bike.brand} • {bike.year}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400">Harga / Hari</span>
                      <span className="font-black text-gray-900">Rp {bike.pricePerDay.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400">Durasi Sewa</span>
                      <span className="font-black text-gray-900">{calculateDays()} Hari</span>
                   </div>
                   <div className="h-px bg-gray-50 my-4" />
                   <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900 tracking-tight">Total Bayar</span>
                      <span className="text-2xl font-black text-primary italic">Rp {totalPrice.toLocaleString()}</span>
                   </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !totalPrice}
                  className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-indigo-600 hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Konfirmasi & Bayar"}
                </button>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
