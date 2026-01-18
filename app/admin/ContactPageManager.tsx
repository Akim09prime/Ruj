
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { ContactPageData } from '../../types';

export const ContactPageManager: React.FC = () => {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dbService.getContactData().then(setData);
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    await dbService.updateContactData(data);
    setSaving(false);
    alert('Pagina de Contact a fost actualizată!');
  };

  const updateInfo = (field: string, val: string) => {
    if (!data) return;
    setData({ ...data, info: { ...data.info, [field]: val } });
  };

  const updateFAQ = (idx: number, field: 'question' | 'answer', lang: 'ro' | 'en', val: string) => {
    if (!data) return;
    const newFAQ = [...data.faq];
    newFAQ[idx][field][lang] = val;
    setData({ ...data, faq: newFAQ });
  };

  if (!data) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="font-serif text-4xl mb-2">Contact Settings</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Informații & FAQ</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-white px-10 py-3 text-[10px] uppercase font-bold tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? 'Se salvează...' : 'Salvează Tot'}
        </button>
      </div>

      <div className="space-y-12">
        
        {/* INFO SECTION */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">1. Date de Contact</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Telefon</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.phone} onChange={e => updateInfo('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Email</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.email} onChange={e => updateInfo('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Adresă</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.address} onChange={e => updateInfo('address', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Oraș</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.city} onChange={e => updateInfo('city', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Program</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.hours} onChange={e => updateInfo('hours', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">WhatsApp Link</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.whatsappLink} onChange={e => updateInfo('whatsappLink', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Map Embed URL (Iframe src)</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.info.mapEmbedUrl} onChange={e => updateInfo('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">2. Hero Text</h2>
          <div className="space-y-4">
             <div>
                <label className="text-[10px] uppercase font-bold text-muted">Titlu (RO)</label>
                <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.hero.title.ro} onChange={e => setData({...data, hero: {...data.hero, title: {...data.hero.title, ro: e.target.value}}})} />
             </div>
             <div>
                <label className="text-[10px] uppercase font-bold text-muted">Subtitlu (RO)</label>
                <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.hero.subtitle.ro} onChange={e => setData({...data, hero: {...data.hero, subtitle: {...data.hero.subtitle, ro: e.target.value}}})} />
             </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">3. FAQ</h2>
          <div className="space-y-6">
             {data.faq.map((item, idx) => (
                <div key={idx} className="bg-surface-2 p-4 border border-border">
                   <div className="mb-2">
                      <label className="text-[10px] uppercase font-bold text-muted">Întrebare (RO)</label>
                      <input className="w-full bg-background border border-border p-2 text-xs" value={item.question.ro} onChange={e => updateFAQ(idx, 'question', 'ro', e.target.value)} />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-muted">Răspuns (RO)</label>
                      <textarea className="w-full bg-background border border-border p-2 text-xs h-16" value={item.answer.ro} onChange={e => updateFAQ(idx, 'answer', 'ro', e.target.value)} />
                   </div>
                </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
};
