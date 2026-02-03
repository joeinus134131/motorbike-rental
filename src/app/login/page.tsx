"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bike, KeyRound, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
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
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Selamat Datang</h2>
        <p className="text-gray-500 mt-2 font-medium">Masuk untuk mengelola penyewaan Anda.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-600 text-sm rounded-2xl border border-emerald-100 font-bold mb-4">
              {success}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-2xl border border-rose-100 font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="admin@sewamotor.com"
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
                autoComplete="current-password"
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
                Masuk Sekarang
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-50 text-center space-y-6">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Daftar Gratis
            </Link>
          </p>
          
          <div className="bg-amber-50/50 p-6 rounded-[1.5rem] border border-amber-100 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full -mr-8 -mt-8" />
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-3">Admin Access</p>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-amber-700">Email: <span className="text-gray-900">admin@sewamotor.com</span></p>
              <p className="text-xs font-bold text-amber-700">Pass: <span className="text-gray-900">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <Suspense fallback={<Loader2 className="animate-spin text-primary" size={40} />}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
