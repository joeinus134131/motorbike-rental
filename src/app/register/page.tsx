"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, KeyRound, Mail, User, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?success=Account created successfully");
      } else {
        setError(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/30 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Bike size={32} />
            </div>
            <span className="font-black text-4xl tracking-tighter text-gray-900 uppercase">
              SEWA<span className="text-primary">MOTOR</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bergabung Sekarang</h2>
          <p className="text-gray-500 mt-2 font-medium">Buat akun untuk mulai menyewa motor impian.</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-2xl border border-rose-100 font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-indigo-600 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Daftar Sekarang
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
