"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Mail, Phone, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";

export default function AdminCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  useEffect(() => {
    fetch("/api/cms/landing")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data || config);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/cms/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      alert("Konfigurasi berhasil diperbarui!");
    } catch (error) {
      alert("Gagal memperbarui konfigurasi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mb-4 mx-auto" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Editor...</p>
      </div>
    </div>
  );

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">
            <Sparkles size={14} />
            <span>Content Management</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Edit Landing Page</h1>
          <p className="text-gray-500 font-medium mt-1">Kustomisasi tampilan pesan dan informasi kontak utama.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all flex items-center gap-3 active:scale-95 text-xs disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Hero Section */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
             <SectionHeader title="Visual & Hero Section" icon={<Globe size={20} />} />
             <div className="grid gap-8 mt-8">
               <ModernInput 
                 label="Hero Main Title" 
                 value={config.heroTitle} 
                 onChange={(e) => setConfig({...config, heroTitle: e.target.value})} 
               />
               <ModernInput 
                 label="Hero Sub-message" 
                 area 
                 value={config.heroSubtitle} 
                 onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} 
               />
               <ModernInput 
                 label="Hero Image Background URL" 
                 value={config.heroImage} 
                 icon={<ImageIcon size={18} />}
                 onChange={(e) => setConfig({...config, heroImage: e.target.value})} 
               />
             </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/20" />
             <SectionHeader title="Contact Information" icon={<Mail size={20} />} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
               <ModernInput 
                 label="Support Email" 
                 value={config.contactEmail} 
                 icon={<Mail size={18} />}
                 onChange={(e) => setConfig({...config, contactEmail: e.target.value})} 
               />
               <ModernInput 
                 label="WhatsApp / Phone" 
                 value={config.contactPhone} 
                 icon={<Phone size={18} />}
                 onChange={(e) => setConfig({...config, contactPhone: e.target.value})} 
               />
             </div>
             <div className="mt-8">
               <ModernInput 
                 label="Office Address" 
                 area 
                 value={config.address} 
                 icon={<MapPin size={18} />}
                 onChange={(e) => setConfig({...config, address: e.target.value})} 
               />
             </div>
          </div>
        </div>

        {/* Preview Helper */}
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200/20 sticky top-32">
            <h4 className="text-xl font-black mb-6 tracking-tight">Live Tips</h4>
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Typography</p>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">Gunakan heading yang singkat dan kuat untuk menarik perhatian pengguna dalam 3 detik pertama.</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">Visuals</p>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">Pastikan URL gambar menggunakan resolusi tinggi (min. 1920x1080) untuk hasil maksimal di layar lebar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string, icon: any }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary border border-gray-100">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configuration set</p>
      </div>
    </div>
  );
}

function ModernInput({ label, value, onChange, area = false, icon }: { label: string, value: string, onChange: (e: any) => void, area?: boolean, icon?: any }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-5 -translate-y-1 text-gray-300 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        {area ? (
          <textarea
            className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm min-h-[120px]`}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input
            type="text"
            className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm`}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
