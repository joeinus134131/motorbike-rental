"use client";

import { useState, useEffect } from "react";
import { CreditCard, Search, SlidersHorizontal, ArrowUpRight, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      alert("Gagal menyetujui transaksi.");
    }
  };

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
            <CreditCard size={14} />
            <span>Transaction Manager</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Riwayat Transaksi</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola status pembayaran dan jadwal penyewaan unit.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID transaksi atau nama..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-indigo-600 transition-all">All</button>
            <button className="px-6 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Paid</button>
            <button className="px-6 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Pending</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Reference ID</th>
                <th className="px-10 py-6">Customer</th>
                <th className="px-10 py-6">Unit</th>
                <th className="px-10 py-6">Duration</th>
                <th className="px-10 py-6 text-right">Total Price</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {bookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <span className="font-mono font-bold text-gray-400 uppercase">#{booking.id.slice(-8)}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 text-xs shadow-inner uppercase">
                        {booking.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block leading-none mb-1">{booking.user?.name || "Anonymous"}</span>
                        <span className="text-[10px] font-medium text-gray-400">{booking.user?.email || "-"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-bold text-gray-700">{booking.motorbike?.name || "Unit Terhapus"}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium whitespace-nowrap">
                      <Clock size={14} className="text-gray-300" />
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="font-black text-gray-900 tracking-tight italic">Rp {booking.totalPrice?.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      booking.status === "PAID" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : booking.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right flex items-center justify-end gap-2">
                    {booking.status === "PENDING" && (
                      <button 
                        onClick={() => handleApprove(booking.id)}
                        className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                      >
                        Approve
                      </button>
                    )}
                    <button className="p-3 text-gray-300 hover:text-primary hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <div className="p-32 text-center bg-gray-50/30">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-200">
                <CreditCard size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Belum ada transaksi</h3>
              <p className="text-gray-400 font-medium max-w-xs mx-auto">Semua riwayat pemesanan pelanggan akan muncul di sini secara otomatis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
