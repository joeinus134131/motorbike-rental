"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            <MessageSquare size={18} />
            <span>Connect With Us</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Butuh Bantuan?</h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">Kami siap membantu Anda mendapatkan pengalaman penyewaan motor terbaik. Hubungi kami melalui saluran berikut.</p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-12">
            <div className="bg-gray-900 text-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-200/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-primary/30 transition-all duration-700" />
               <h3 className="text-2xl font-black mb-10 tracking-tight relative z-10">Direct Contact</h3>
               
               <div className="space-y-10 relative z-10">
                 <ContactItem 
                   icon={<Mail size={24} />} 
                   title="Email kami" 
                   value="hello@sewamotor.com" 
                   sub="Respon dalam 2 jam"
                 />
                 <ContactItem 
                   icon={<Phone size={24} />} 
                   title="WhatsApp Admin" 
                   value="+62 812 3456 7890" 
                   sub="24/7 Fast Response"
                 />
                 <ContactItem 
                   icon={<MapPin size={24} />} 
                   title="Lokasi Kantor" 
                   value="Jl. Sudirman No 1-2, Jakarta" 
                   sub="Kunjungi showroom kami"
                 />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                   <Clock size={20} />
                 </div>
                 <h4 className="font-black text-gray-900 tracking-tight">Jam Operasional</h4>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Senin - Jumat</span>
                    <span className="font-black text-gray-900">08:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Sabtu - Minggu</span>
                    <span className="font-black text-gray-900">09:00 - 17:00</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white p-16 rounded-[3rem] border border-gray-100 shadow-2xl flex flex-col items-center text-center h-full justify-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Pesan Anda Terkirim!</h2>
                <p className="text-gray-500 font-medium max-w-sm mb-10">Terima kasih telah menghubungi kami. Admin kami akan segera menghubungi Anda kembali melalui email atau WhatsApp.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all shadow-xl"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6">
                  <Sparkles size={14} />
                  <span>Send an Inquiry</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-10">Tinggalkan Pesan</h3>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ModernInput label="Nama Lengkap" placeholder="John Doe" required />
                    <ModernInput label="Alamat Email" type="email" placeholder="john@example.com" required />
                  </div>
                  <ModernInput label="Subjek" placeholder="Pertanyaan seputar unit/kerjasama" required />
                  <ModernInput label="Pesan Anda" area placeholder="Tuliskan pesan atau pertanyaan Anda di sini secara detail..." required />
                  
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:bg-indigo-600 hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                          Kirim Pesan Sekarang
                          <Send size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function ContactItem({ icon, title, value, sub }: { icon: any, title: string, value: string, sub: string }) {
  return (
    <div className="flex gap-5 group cursor-pointer">
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-lg font-black text-white group-hover:text-primary transition-colors">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{sub}</p>
      </div>
    </div>
  );
}

function ModernInput({ label, value, onChange, area = false, type = "text", placeholder = "", required = false }: { label: string, value?: any, onChange?: (e: any) => void, area?: boolean, type?: string, placeholder?: string, required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      {area ? (
        <textarea
          required={required}
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm min-h-[160px] outline-none"
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm outline-none"
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
