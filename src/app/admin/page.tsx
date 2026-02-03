import prisma from "@/lib/prisma";
import Link from "next/link";
import { Bike, Users, CalendarDays, Wallet, ArrowUpRight, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const stats = {
    totalBikes: await prisma.motorbike.count(),
    activeBookings: await prisma.booking.count({ where: { status: "PAID" } }),
    totalUsers: await prisma.user.count({ where: { role: "USER" } }),
    revenue: (await prisma.booking.aggregate({
      where: { status: "PAID" },
      _sum: { totalPrice: true },
    }))._sum.totalPrice || 0,
  };

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    include: { user: true, motorbike: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Pantau performa bisnis penyewaan motor Anda.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/cms" className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Edit Landing Page
          </Link>
          <Link href="/admin/motorbikes/new" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <Plus size={20} />
            Tambah Unit
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Unit" value={stats.totalBikes} icon={<Bike />} color="bg-blue-500" />
        <StatCard title="Booking Aktif" value={stats.activeBookings} icon={<CalendarDays />} color="bg-orange-500" />
        <StatCard title="Total Pelanggan" value={stats.totalUsers} icon={<Users />} color="bg-green-500" />
        <StatCard title="Pendapatan" value={`Rp ${stats.revenue.toLocaleString()}`} icon={<Wallet />} color="bg-purple-500" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Booking Terbaru</h3>
          <Link href="/admin/bookings" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Lihat Semua <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Unit Motor</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900 block">{booking.user.name}</span>
                    <span className="text-xs text-gray-400">{booking.user.email}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-medium text-gray-700">{booking.motorbike.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500">
                      {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-black text-gray-900 text-sm">Rp {booking.totalPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      booking.status === "PAID" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 group hover:border-primary/20 transition-all">
      <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-3xl font-black text-gray-900">{value}</h4>
    </div>
  );
}
