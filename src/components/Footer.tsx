"use client";

import Link from "next/link";
import { Bike, Instagram, Twitter, Facebook, Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full -ml-32 -mb-32 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand and Description */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Bike size={24} />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">
                SEWA<span className="text-primary">MOTOR</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Platform penyewaan motor terbaik yang memberikan kenyamanan #1 untuk perjalanan Anda. Unit terbaru, harga transparan, dan pelayanan 24 jam.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Instagram size={20} />} />
              <SocialLink icon={<Twitter size={20} />} />
              <SocialLink icon={<Facebook size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-lg font-black tracking-tight">Quick Links</h4>
            <nav className="flex flex-col gap-4">
              <FooterLink href="/" label="Beranda" />
              <FooterLink href="/motorbikes" label="Cari Motor" />
              <FooterLink href="/contact" label="Hubungi Kami" />
              <FooterLink href="/dashboard" label="Riwayat Sewa" />
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-lg font-black tracking-tight">Kontak</h4>
            <div className="space-y-6">
              <ContactItem icon={<Mail size={18} />} label="hello@sewamotor.com" />
              <ContactItem icon={<Phone size={18} />} label="+62 812 3456 7890" />
              <ContactItem icon={<MapPin size={18} />} label="Jl. Sudirman No 1-2, Jakarta" />
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-lg font-black tracking-tight">Stay Updated</h4>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Dapatkan promo menarik setiap minggu langsung di email Anda.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all pr-12 font-medium"
              />
              <button className="absolute right-2 top-2 p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © 2026 SEWAMOTOR. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group text-sm font-bold">
      <div className="w-0 group-hover:w-1.5 h-1.5 bg-primary rounded-full transition-all" />
      {label}
    </Link>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90 shadow-lg border border-white/5">
      {icon}
    </button>
  );
}

function ContactItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-white transition-colors">
      <div className="text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
