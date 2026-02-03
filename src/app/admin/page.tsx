import prisma from "@/lib/prisma";
import Link from "next/link";
import { Bike, Users, CalendarDays, Wallet, ArrowUpRight, Plus, TrendingUp, MoreHorizontal } from "lucide-react";

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
    take: 8,
    include: { user: true, motorbike: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Morning, Admin 👋</h1>
          <p className="text-gray-500 font-medium">Berikut ringkasan statistik bisnis Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/motorbikes" className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-95 text-sm uppercase tracking-widest">
            <Plus size={20} />
            Unit Baru
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard 
          title="Total Units" 
          value={stats.totalBikes} 
          icon={<Bike size={24} />} 
          trend="+12% this month"
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.activeBookings} 
          icon={<CalendarDays size={24} />} 
          trend="+5.2% vs last week"
          color="bg-orange-500" 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          trend="+28 new users"
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`Rp ${stats.revenue.toLocaleString()}`} 
          icon={<Wallet size={24} />} 
          trend="+Rp 2.4M target"
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Booking Terbaru</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time transactions</p>
            </div>
            <Link href="/admin/bookings" className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline">
              Semua Transaksi <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6 whitespace-nowrap">Customer</th>
                  <th className="px-10 py-6 whitespace-nowrap">Motor Unit</th>
                  <th className="px-10 py-6 whitespace-nowrap text-right">Amount</th>
                  <th className="px-10 py-6 text-right whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 text-xs">
                          {booking.user.name?.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block leading-none mb-1">{booking.user.name}</span>
                          <span className="text-[10px] font-medium text-gray-400">{booking.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-bold text-gray-700">{booking.motorbike.name}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="font-black text-gray-900 text-sm italic">Rp {booking.totalPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        booking.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
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

        {/* Quick Actions / Insights */}
        <div className="space-y-10">
          <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
            <h4 className="text-xl font-black mb-6 tracking-tight relative z-10">Quick Insights</h4>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-sm font-bold">Conversion Rate</span>
                </div>
                <span className="text-sm font-black text-indigo-400">8.4%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                    <Bike size={16} />
                  </div>
                  <span className="text-sm font-bold">Unit Usage</span>
                </div>
                <span className="text-sm font-black text-emerald-400">92%</span>
              </div>
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white text-white hover:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
              Download Reports
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
            <h4 className="text-xl font-black mb-6 tracking-tight">Main Settings</h4>
            <div className="space-y-4">
              <Link href="/admin/cms" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all group">
                <span className="font-bold text-sm tracking-tight text-gray-500 group-hover:text-white">CMS Landing Page</span>
                <ArrowUpRight size={18} className="text-gray-300 group-hover:text-white" />
              </Link>
              <Link href="/admin/motorbikes" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all group">
                <span className="font-bold text-sm tracking-tight text-gray-500 group-hover:text-white">Inventory Manager</span>
                <ArrowUpRight size={18} className="text-gray-300 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: { title: string, value: any, icon: any, trend: string, color: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 group hover:border-primary/20 transition-all">
      <div className={`w-16 h-16 ${color} text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
        {icon}
      </div>
      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-3">{title}</p>
      <h4 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">{value}</h4>
      <div className="flex items-center gap-2">
        <div className="p-1 bg-emerald-50 text-emerald-500 rounded-md">
          <TrendingUp size={12} />
        </div>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
      </div>
    </div>
  );
}
