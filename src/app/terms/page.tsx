import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, ScrollText, CheckCircle2, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <ScrollText size={14} />
            Layanan & Ketentuan
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Syarat & <span className="text-primary italic">Ketentuan</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Daftar aturan dan kewajiban yang berlaku untuk setiap pengguna layanan SewaMotor demi kenyamanan dan keamanan bersama.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 md:p-16 space-y-16">
            
            {/* Clause 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">01</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pendaftaran & Akun</h2>
              </div>
              <div className="pl-16 space-y-4 text-gray-600 leading-relaxed font-medium">
                <p>Pengguna wajib memberikan informasi yang akurat, lengkap, dan terbaru saat mendaftarkan akun di platform SewaMotor.</p>
                <p>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan aktivitas yang terjadi di bawah akun Anda.</p>
                <div className="flex gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mt-6">
                   <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                   <p className="text-sm">Hanya individu berusia 18 tahun ke atas dengan identitas resmi yang dapat melakukan penyewaan.</p>
                </div>
              </div>
            </div>

            {/* Clause 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">02</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Kebijakan Penyewaan</h2>
              </div>
              <div className="pl-16 space-y-6 text-gray-600 leading-relaxed font-medium">
                <ul className="list-disc space-y-3 pl-4">
                  <li>Pembayaran dilakukan di muka sesuai dengan durasi sewa yang dipilih.</li>
                  <li>Penyewa wajib mengembalikan unit dalam kondisi yang sama seperti saat diterima.</li>
                  <li>Keterlambatan pengembalian akan dikenakan biaya tambahan per jam sesuai ketentuan harga yang berlaku.</li>
                </ul>
              </div>
            </div>

            {/* Clause 3 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black">03</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Asuransi & Tanggung Jawab</h2>
              </div>
              <div className="pl-16 space-y-4 text-gray-600 leading-relaxed font-medium">
                <p>Setiap penyewaan sudah termasuk asuransi perlindungan terhadap kejadian tak terduga dalam batas ketentuan yang berlaku.</p>
                <div className="flex gap-4 p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                   <AlertCircle size={24} className="text-amber-600 shrink-0" />
                   <div className="space-y-1">
                      <p className="font-black text-amber-900 uppercase tracking-widest text-[10px]">Peringatan Keamanan</p>
                      <p className="text-sm text-amber-800">Kerusakan akibat kelalaian berat penyewa (termasuk mengemudi di bawah pengaruh alkohol) sepenuhnya menjadi tanggung jawab penyewa.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <div className="pt-10 border-t border-gray-50 text-center">
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Terakhir Diperbarui: 4 Februari 2026</p>
               <p className="text-sm text-gray-500 leading-relaxed mb-10">Dengan melanjutkan penggunaan layanan kami, Anda dianggap telah menyetujui seluruh ketentuan di atas tanpa terkecuali.</p>
               <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                  <Shield size={14} />
                  <span>SewaMotor Safe Management System</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
