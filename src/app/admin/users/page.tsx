"use client";

import { useState, useEffect } from "react";
import { Users, Search, SlidersHorizontal, ArrowUpRight, Shield, User, Mail, Calendar, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "ADMIN" }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      alert("Gagal memperbarui role.");
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
            <Users size={14} />
            <span>Identity Manager</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">User Management</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola akun pelanggan dan akses administrator dalam satu tempat.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari user (nama atau email)..."
              className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold shadow-sm"
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
                <th className="px-10 py-6">User Identity</th>
                <th className="px-10 py-6">Contact Info</th>
                <th className="px-10 py-6 text-center">Role Status</th>
                <th className="px-10 py-6">Joined Date</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 border border-gray-200 shadow-inner overflow-hidden">
                        {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={24} />}
                      </div>
                      <div>
                        <span className="font-black text-gray-900 block leading-none mb-1 text-base">{user.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">ID: {user.id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Mail size={14} className="text-gray-300" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                      user.role === "ADMIN" 
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {user.role === "ADMIN" && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                      <Calendar size={14} className="text-gray-200" />
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right flex items-center justify-end gap-2">
                    {user.role === "USER" && (
                      <button 
                        onClick={() => handleMakeAdmin(user.id)}
                        className="px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200"
                      >
                        Make Admin
                      </button>
                    )}
                    <button className="p-3 text-gray-300 hover:text-primary hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all opacity-0 group-hover:opacity-100">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-32 text-center bg-gray-50/30">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-200">
                <Users size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">No Users Found</h3>
              <p className="text-gray-400 font-medium">Your platform doesn't have any users yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
