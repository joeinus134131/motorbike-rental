"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

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
    await fetch("/api/cms/landing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    alert("Konfigurasi berhasil diperbarui!");
  };

  if (loading) return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pengaturan CMS</h1>
        <p className="text-gray-500 mt-1">Ubah tampilan landing page dan informasi kontak aplikasi.</p>
      </div>

      <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
        <Section title="Hero Section" icon={<Globe size={20} />}>
          <div className="grid gap-6">
            <Input label="Hero Title" value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
            <Input label="Hero Subtitle" area value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} />
            <Input label="Hero Image URL" value={config.heroImage} onChange={(e) => setConfig({...config, heroImage: e.target.value})} />
          </div>
        </Section>

        <Section title="Contact Info" icon={<Mail size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email" value={config.contactEmail} onChange={(e) => setConfig({...config, contactEmail: e.target.value})} />
            <Input label="Phone" value={config.contactPhone} onChange={(e) => setConfig({...config, contactPhone: e.target.value})} />
          </div>
          <div className="mt-6">
            <Input label="Address" area value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} />
          </div>
        </Section>

        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, area = false }: { label: string, value: string, onChange: (e: any) => void, area?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      {area ? (
        <textarea
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 min-h-[100px]"
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900"
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
