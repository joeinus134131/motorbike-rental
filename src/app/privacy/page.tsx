import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Eye, ShieldCheck, Database, Fingerprint } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
            <Lock size={14} />
            Privasi & Data
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Kebijakan <span className="text-primary italic">Privasi</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Komitmen kami untuk melindungi data pribadi Anda dan transparansi penuh mengenai cara kami mengelola informasi tersebut.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             
             {/* Sticky Sidebar Info */}
             <div className="md:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 sticky top-32">
                   <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                      <ShieldCheck size={24} />
                   </div>
                   <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4">Ringkasan Privasi</h3>
                   <ul className="space-y-4">
                      <li className="flex gap-3 text-xs font-bold text-gray-500 italic leading-relaxed">
                         <div className="w-1 h-4 bg-primary rounded-full shrink-0" />
                         Data Anda tidak akan pernah dijual ke pihak ketiga.
                      </li>
                      <li className="flex gap-3 text-xs font-bold text-gray-500 italic leading-relaxed">
                         <div className="w-1 h-4 bg-primary rounded-full shrink-0" />
                         Enkripsi end-to-end untuk setiap transaksi finansial.
                      </li>
                      <li className="flex gap-3 text-xs font-bold text-gray-500 italic leading-relaxed">
                         <div className="w-1 h-4 bg-primary rounded-full shrink-0" />
                         Akses penuh untuk menghapus data pribadi kapan saja.
                      </li>
                   </ul>
                </div>
             </div>

             {/* Main Clauses */}
             <div className="md:col-span-2 space-y-12">
                
                {/* Clause 1 */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-primary">
                      <Eye size={20} />
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest text-xs">Informasi yang Kami Kumpulkan</h2>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 text-gray-600 font-medium leading-relaxed">
                      <p>Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat Anda membuat akun, melakukan pemesanan, atau menggunakan fitur kontak.</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                         <li>Nama dan Informasi Kontak (Email, Nomor HP)</li>
                         <li>Identitas Resmi (KTP/SIM untuk verifikasi sewa)</li>
                         <li>Data Pembayaran (Diproses melalui payment gateway aman)</li>
                      </ul>
                   </div>
                </div>

                {/* Clause 2 */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-primary">
                      <Database size={20} />
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest text-xs">Penggunaan Informasi</h2>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 text-gray-600 font-medium leading-relaxed">
                      <p>Data yang dikumpulkan digunakan semata-mata untuk meningkatkan layanan sewa motor kepada Anda:</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                         <li>Memproses penyewaan dan konfirmasi booking</li>
                         <li>Verifikasi keamanan dan kelayakan penyewa</li>
                         <li>Pengiriman informasi promo dan pembaruan sistem</li>
                      </ul>
                   </div>
                </div>

                {/* Clause 3 */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-primary">
                      <Fingerprint size={20} />
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest text-xs">Keamanan Data</h2>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-600 font-medium leading-relaxed">
                      <p>Kami menggunakan standar keamanan teknologi terkini, termasuk Secure Socket Layer (SSL) 256-bit untuk memastikan transmisi data Anda aman dari akses tidak sah.</p>
                      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                         <Lock size={16} className="text-primary shrink-0" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Database server kami terlindungi Firewall berlapis.</p>
                      </div>
                </div>
                </div>

             </div>
          </div>

          <div className="mt-24 pt-10 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Ada pertanyaan mengenai privasi?</p>
             <p className="text-gray-900 font-black mt-2 mb-10 italic underline decoration-primary decoration-4 underline-offset-8 cursor-pointer hover:text-primary transition-colors">privacy@sewamotor.com</p>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2026 SewaMotor - Member of Global Logistic Group</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
