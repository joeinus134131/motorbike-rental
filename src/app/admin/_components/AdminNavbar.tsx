"use client";

import { Bell, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for bookings, bikes, or customers..."
          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none mb-1">{session?.user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center border text-gray-500 hover:border-primary/50 transition-all cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
