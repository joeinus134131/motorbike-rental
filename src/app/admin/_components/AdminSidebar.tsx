"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bike, 
  Settings, 
  CreditCard, 
  Users, 
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Unit Motor", href: "/admin/motorbikes", icon: Bike },
    { name: "Transaksi", href: "/admin/transactions", icon: CreditCard },
    { name: "Landing Page", href: "/admin/cms", icon: Settings },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-72 min-h-screen bg-gray-900 text-white flex flex-col sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group mb-12">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Bike size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">
            SEWA<span className="text-primary">MOTOR</span>
          </span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 pt-0">
        <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-6 rounded-[2rem] border border-white/5 mb-8">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
            <Sparkles size={20} className="text-indigo-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">Status</p>
          <p className="text-sm font-bold text-white">Super Admin Mode</p>
        </div>

        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
