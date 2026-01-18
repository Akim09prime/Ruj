
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { AboutPageData } from '../../types';

export const AboutManager: React.FC = () => {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dbService.getAboutData().then(setData);
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    await dbService.updateAboutData(data);
    setSaving(false);
    alert('Pagina Despre a fost actualizată!');
  };

  const updateNested = (section: keyof AboutPageData, field: string, subField: 'ro' | 'en', val: string) => {
    if (!data) return;
    // @ts-ignore
    const newSection = { ...data[section], [field]: { ...data[section][field], [subField]: val } };
    setData({ ...data, [section]: newSection });
  };

  const updatePillar = (idx: number, field: 'title' | 'desc', lang: 'ro' | 'en', val: string) => {
    if (!data) return;
    const pillars = [...data.pillars];
    pillars[idx][field][lang] = val;
    setData({ ...data, pillars });
  };

  const updateTimeline = (idx: number, field: 'title' | 'desc', lang: 'ro' | 'en', val: string) => {
    if (!data) return;
    const timeline = [...data.timeline];
    timeline[idx][field][lang] = val;
    setData({ ...data, timeline });
  };

  if (!data) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="font-serif text-4xl mb-2">Despre Noi (CMS)</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Gestiune conținut premium</p>
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
        
        {/* HERO */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">1. Hero Section</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Titlu (RO)</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.hero.title.ro} onChange={e => updateNested('hero', 'title', 'ro', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Titlu (EN)</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.hero.title.en} onChange={e => updateNested('hero', 'title', 'en', e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] uppercase font-bold text-muted">Text (RO)</label>
              <textarea className="w-full bg-surface-2 border border-border p-3 text-xs h-24" value={data.hero.text.ro} onChange={e => updateNested('hero', 'text', 'ro', e.target.value)} />
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">2. Manifest</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Titlu (RO)</label>
              <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={data.manifesto.title.ro} onChange={e => updateNested('manifesto', 'title', 'ro', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">Text (RO)</label>
              <textarea className="w-full bg-surface-2 border border-border p-3 text-xs h-24" value={data.manifesto.text.ro} onChange={e => updateNested('manifesto', 'text', 'ro', e.target.value)} />
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">3. Piloni (Carduri)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.pillars.map((p, i) => (
              <div key={i} className="bg-surface-2 p-4 border border-border">
                <span className="text-[10px] font-bold text-muted block mb-2">Card {i+1}</span>
                <input className="w-full bg-background border border-border p-2 text-xs mb-2" value={p.title.ro} onChange={e => updatePillar(i, 'title', 'ro', e.target.value)} />
                <textarea className="w-full bg-background border border-border p-2 text-xs h-20" value={p.desc.ro} onChange={e => updatePillar(i, 'desc', 'ro', e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">4. Timeline Execuție</h2>
          <div className="space-y-4">
            {data.timeline.map((step, i) => (
              <div key={i} className="flex gap-4 items-center">
                <span className="text-xl font-serif text-accent w-8">{step.year}</span>
                <input className="w-1/3 bg-surface-2 border border-border p-3 text-xs" value={step.title.ro} onChange={e => updateTimeline(i, 'title', 'ro', e.target.value)} />
                <input className="w-2/3 bg-surface-2 border border-border p-3 text-xs" value={step.desc.ro} onChange={e => updateTimeline(i, 'desc', 'ro', e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* CLIENTS */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-accent mb-6 border-b border-border pb-2">5. Clienți</h2>
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted">Rezidențial Desc (RO)</label>
                <textarea className="w-full bg-surface-2 border border-border p-3 text-xs h-20" value={data.clients.resDesc.ro} onChange={e => updateNested('clients', 'resDesc', 'ro', e.target.value)} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted">Comercial Desc (RO)</label>
                <textarea className="w-full bg-surface-2 border border-border p-3 text-xs h-20" value={data.clients.comDesc.ro} onChange={e => updateNested('clients', 'comDesc', 'ro', e.target.value)} />
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};
