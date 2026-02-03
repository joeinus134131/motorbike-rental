import prisma from "@/lib/prisma";
import Link from "next/link";
import { Bike, Edit, Trash2, Plus, AlertCircle } from "lucide-react";

export default async function AdminMotorbikesPage() {
  const bikes = await prisma.motorbike.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manajemen Unit</h1>
          <p className="text-gray-500 mt-1">Kelola seluruh armada motor Anda di sini.</p>
        </div>
        <Link href="/admin/motorbikes/new" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus size={20} />
          Tambah Unit Baru
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-6 py-4">Foto</th>
                <th className="px-6 py-4">Nama Unit</th>
                <th className="px-6 py-4">Brand / Tahun</th>
                <th className="px-6 py-4">Harga / Hari</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <img src={bike.imageUrl} className="w-16 h-12 object-cover rounded-lg shadow-inner bg-gray-100" />
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900">{bike.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500">{bike.brand} - {bike.year}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-black text-gray-900">Rp {bike.pricePerDay.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      bike.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {bike.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bikes.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              <div className="flex justify-center mb-4"><Bike size={48} className="opacity-20" /></div>
              <p>Belum ada unit motor yang terdaftar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
