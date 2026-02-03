"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bike, Edit, Trash2, Plus, ArrowUpRight, Search, SlidersHorizontal, Loader2 } from "lucide-react";

export default function AdminMotorbikesPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBikes = async () => {
    try {
      const res = await fetch("/api/admin/motorbikes");
      const data = await res.json();
      setBikes(data);
    } catch (error) {
      console.error("Failed to fetch bikes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus unit ini?")) return;
    
    try {
      const res = await fetch(`/api/admin/motorbikes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBikes(bikes.filter(bike => bike.id !== id));
      } else {
        alert("Gagal menghapus unit.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    }
  };

  const filteredBikes = bikes.filter(bike => 
    bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
       <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">
            <Bike size={14} />
            <span>Inventory Manager</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Unit Motor</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola ketersediaan, harga, dan kondisi unit kendaraan.</p>
        </div>
        <Link href="/admin/motorbikes/new" className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl shadow-gray-200">
          Tambah Unit Baru <Plus size={16} />
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari unit atau brand..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
                <SlidersHorizontal size={18} />
                Filters
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Unit Motor</th>
                <th className="px-10 py-6">Brand / Tahun</th>
                <th className="px-10 py-6 text-right">Harga / Hari</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredBikes.map((bike) => (
                <tr key={bike.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200 flex items-center justify-center">
                        {bike.imageUrl ? (
                           <img src={bike.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                           <Bike size={20} className="text-gray-300" />
                        )}
                      </div>
                      <span className="font-black text-gray-900 tracking-tight">{bike.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">{bike.brand}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bike.year}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="font-black text-gray-900 tracking-tight italic">Rp {bike.pricePerDay.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      bike.status === "available" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : bike.status === "rented"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {bike.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/motorbikes/${bike.id}/edit`} className="p-3 text-gray-400 hover:text-primary hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all transform hover:-translate-y-1">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(bike.id)}
                        className="p-3 text-gray-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all transform hover:-translate-y-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBikes.length === 0 && (
            <div className="p-32 text-center bg-gray-50/30">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-200">
                <Bike size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Tidak ada unit ditemukan</h3>
              <p className="text-gray-400 font-medium max-w-xs mx-auto mb-10">Coba gunakan kata kunci pencarian lain atau tambahkan unit baru.</p>
              <Link href="/admin/motorbikes/new" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all">
                Tambah Unit Sekarang <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
