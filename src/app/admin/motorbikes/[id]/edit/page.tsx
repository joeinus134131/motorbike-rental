"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Bike, Save, ArrowLeft, Loader2, Sparkles, Image as ImageIcon, Trash2, Upload, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditMotorbikePage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: 0,
    imageUrl: "",
    description: "",
    status: "available"
  });

  useEffect(() => {
    fetch(`/api/admin/motorbikes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setFormData(data);
          // If imageUrl starts with /uploads, default to upload mode
          if (data.imageUrl.startsWith("/uploads/")) {
            setImageMode("upload");
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bike:", err);
        setLoading(false);
      });
  }, [params.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, fileName: file.name }),
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({ ...formData, imageUrl: data.url });
        } else {
          alert("Gagal mengupload gambar.");
        }
      };
    } catch (error) {
      alert("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/motorbikes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/motorbikes");
        router.refresh();
      } else {
        alert("Gagal memperbarui unit.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
       <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Link href="/admin/motorbikes" className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6 hover:translate-x-[-4px] transition-transform w-fit">
            <ArrowLeft size={14} />
            <span>Kembali ke List</span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
             <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Bike size={24} />
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Edit Unit Motor</h1>
          </div>
          <p className="text-gray-500 font-medium mt-1 ml-1 font-bold">Memperbarui informasi untuk <span className="text-primary">{formData.name}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Basic Info */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
             <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Informasi Dasar</h3>
             
             <div className="space-y-8">
               <ModernInput 
                 label="Nama Lengkap Unit" 
                 placeholder="Contoh: Vespa Sprint 150 i-get"
                 value={formData.name} 
                 onChange={(e) => setFormData({...formData, name: e.target.value})} 
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <ModernInput 
                   label="Brand Motor" 
                   placeholder="Vespa, Honda, Yamaha..."
                   value={formData.brand} 
                   onChange={(e) => setFormData({...formData, brand: e.target.value})} 
                 />
                 <ModernInput 
                   label="Tahun Produksi" 
                   type="number"
                   value={formData.year} 
                   onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} 
                 />
               </div>

               <ModernInput 
                 label="Deskripsi Unit" 
                 area 
                 placeholder="Ceritakan kelebihan dan kondisi motor ini..."
                 value={formData.description} 
                 onChange={(e) => setFormData({...formData, description: e.target.value})} 
               />
             </div>
          </div>

          {/* Pricing & Visibility */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-orange-500/20" />
             <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Harga & Status</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ModernInput 
                 label="Harga Sewa / Hari" 
                 type="number"
                 placeholder="Rp 0"
                 icon={<span className="font-black text-xs">Rp</span>}
                 value={formData.pricePerDay} 
                 onChange={(e) => setFormData({...formData, pricePerDay: parseInt(e.target.value)})} 
               />
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-black">Status Ketersediaan</label>
                 <select 
                   className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold text-sm appearance-none outline-none shadow-sm"
                   value={formData.status}
                   onChange={(e) => setFormData({...formData, status: e.target.value})}
                 >
                   <option value="available">Available</option>
                   <option value="rented">Rented</option>
                   <option value="maintenance">Maintenance</option>
                 </select>
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Image & Submit */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
            <h4 className="text-lg font-black mb-6 tracking-tight">Main Photo</h4>
            
            {formData.imageUrl ? (
              <div className="relative group mb-8">
                <img src={formData.imageUrl} className="w-full h-48 object-cover rounded-[1.5rem] shadow-lg" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, imageUrl: ""})}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-300 mb-8 border-spacing-4 group">
                 {uploading ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                 ) : (
                    <>
                      <ImageIcon size={32} className="mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No Image Set</span>
                    </>
                 )}
              </div>
            )}

            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
               <button 
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageMode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
               >
                  <LinkIcon size={14} /> URL
               </button>
               <button 
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageMode === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
               >
                  <Upload size={14} /> Upload
               </button>
            </div>

            {imageMode === "url" ? (
              <ModernInput 
                label="Image URL" 
                placeholder="Paste unsplash link here..."
                value={formData.imageUrl} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
              />
            ) : (
              <div className="space-y-4">
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   className="hidden" 
                   accept="image/*" 
                 />
                 <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-gray-50 border-2 border-gray-100 border-dashed rounded-2xl flex items-center justify-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                 >
                    <Upload size={16} /> Choose File
                 </button>
                 {formData.imageUrl && formData.imageUrl.startsWith("/uploads/") && (
                    <p className="text-[10px] font-bold text-emerald-500 text-center uppercase tracking-widest">
                       Gambar terupload di sistem lokal
                    </p>
                 )}
              </div>
            )}

            <div className="mt-10 space-y-4">
              <button
                type="submit"
                disabled={saving || uploading || !formData.imageUrl}
                className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-indigo-600 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <Save size={18} />
                    Simpan Perubahan
                  </>
                )}
              </button>
              <Link href="/admin/motorbikes" className="w-full flex items-center justify-center py-5 bg-gray-50 text-gray-500 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all font-black">
                Batalkan
              </Link>
            </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex gap-4">
             <AlertCircle size={20} className="text-amber-600 shrink-0" />
             <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Catatan Penting</p>
                <p className="text-[11px] font-bold text-amber-800 leading-relaxed">Pastikan status "Maintenance" diaktifkan jika unit sedang dalam perbaikan untuk menghindari overbooking.</p>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ModernInput({ label, value, onChange, area = false, icon, type = "text", placeholder = "" }: { label: string, value: any, onChange: (e: any) => void, area?: boolean, icon?: any, type?: string, placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-black">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors flex items-center justify-center w-6 z-10">
            {icon}
          </div>
        )}
        {area ? (
          <textarea
            required
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm min-h-[140px] outline-none shadow-sm`}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input
            required
            type={type}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm outline-none shadow-sm`}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
