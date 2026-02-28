
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { HeroConfig, Settings, HeroSlide } from '../../types';

export const HeroManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'media' | 'slider'>('general');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dbService.getSettings().then(s => {
      setSettings(s);
      setHero(s.hero);
    });
  }, []);

  const handleSave = async () => {
    if (!settings || !hero) return;
    
    // Validation for Slider Mode
    if (hero.mode === 'slider') {
      const validSlides = hero.slides.filter(s => s.imageUrl && s.imageUrl.trim() !== '');
      if (validSlides.length === 0) {
        alert('Eroare: Modul Slider necesită cel puțin un slide valid (cu imagine)!');
        return;
      }
    }

    setSaving(true);
    const updatedSettings = { ...settings, hero: hero };
    await dbService.updateSettings(updatedSettings);
    setSettings(updatedSettings);
    setSaving(false);
    alert('Configurație Hero salvată!');
  };

  // Helper for File Upload to Server
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'videoUrl' | 'posterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await dbService.uploadFile(file);
      if (hero) {
        setHero({ ...hero, [field]: url });
      }
    } catch (err) {
      console.error(err);
      alert("Eroare la încărcarea fișierului.");
    } finally {
      setUploading(false);
    }
  };

  const updateSlide = (idx: number, field: keyof HeroSlide, val: any) => {
    if (!hero) return;
    const newSlides = [...hero.slides];
    newSlides[idx] = { ...newSlides[idx], [field]: val };
    setHero({ ...hero, slides: newSlides });
  };

  const updateSlideNested = (idx: number, parent: keyof HeroSlide, child: string, val: any) => {
    if (!hero) return;
    const newSlides = [...hero.slides];
    newSlides[idx] = { ...newSlides[idx], [parent]: { ...(newSlides[idx][parent] as any), [child]: val } };
    setHero({ ...hero, slides: newSlides });
  };

  const addSlide = () => {
    if (!hero) return;
    const newSlide: HeroSlide = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
      title: { ro: 'Slide Nou', en: 'New Slide' },
      subtitle: { ro: 'Descriere slide', en: 'Slide description' },
      primaryCta: { label: { ro: 'Vezi', en: 'View' }, href: '#' },
      secondaryCta: { label: { ro: 'Detalii', en: 'Details' }, href: '#' }
    };
    setHero({ ...hero, slides: [...hero.slides, newSlide] });
  };

  const removeSlide = (idx: number) => {
    if (!hero) return;
    setHero({ ...hero, slides: hero.slides.filter((_, i) => i !== idx) });
  };

  if (!hero) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="font-serif text-4xl mb-2">Administrator Hero</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Configurează aspectul primei secțiuni din Home Page</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={async () => {
              if (confirm('Sigur vrei să resetezi Hero la setările implicite? Vei pierde modificările curente.')) {
                const defaultHero: HeroConfig = {
                  mode: 'slider', enabled: true, height: 'fullscreen', overlayStrength: 45, align: 'center',
                  eyebrow: { ro: 'CARVELLO — Mobilier premium', en: 'CARVELLO — Premium furniture' },
                  titleLine1: { ro: 'Mobilier la comandă.', en: 'Custom furniture.' },
                  titleLine2: { ro: 'Executat milimetric.', en: 'Millimetrically executed.' },
                  subtitle: { ro: 'Producție CNC și finisaje de lux.', en: 'CNC production and luxury finishes.' },
                  microFeatures: ['3D', 'CNC', '2K Paint'],
                  primaryCta: { label: { ro: 'Cere ofertă', en: 'Get Quote' }, href: '/cerere-oferta' },
                  secondaryCta: { label: { ro: 'Portofoliu', en: 'Portfolio' }, href: '/portofoliu', visible: true },
                  videoUrl: '', posterUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000',
                  muted: true, loop: true, showPlayButton: false, autoplay: true, interval: 6000, slides: []
                };
                setHero(defaultHero);
                // Auto-save
                if (settings) {
                  await dbService.updateSettings({ ...settings, hero: defaultHero });
                  alert('Hero resetat cu succes!');
                }
              }
            }}
            className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Resetare Implicit
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-accent text-white px-10 py-3 text-[10px] uppercase font-bold tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {saving ? 'Se salvează...' : 'Salvează Modificările'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        {['general', 'content', 'media', 'slider'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === tab ? 'bg-accent text-white' : 'text-muted hover:bg-surface-2'}`}
          >
            {tab === 'general' ? 'General' : tab === 'content' ? 'Conținut' : tab === 'media' ? 'Media' : 'Slider'}
          </button>
        ))}
      </div>

      <div className="bg-surface p-10 border border-border shadow-sm">
        
        {/* --- GENERAL SETTINGS --- */}
        {activeTab === 'general' && (
          <div className="space-y-8 max-w-3xl">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Mod Hero</label>
                  <select 
                    className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent"
                    value={hero.mode}
                    onChange={e => setHero({...hero, mode: e.target.value as any})}
                  >
                    <option value="video">Video Cinematic</option>
                    <option value="slider">Slider Imagini</option>
                    <option value="image">Imagine Statică</option>
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Vizibilitate</label>
                  <div className="flex items-center space-x-4 p-4 bg-surface-2 border border-border">
                    <input type="checkbox" className="w-4 h-4 accent-accent" checked={hero.enabled} onChange={e => setHero({...hero, enabled: e.target.checked})} />
                    <span className="text-xs">Activează Hero Section</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-muted">Opacitate Overlay ({hero.overlayStrength}%)</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-accent"
                value={hero.overlayStrength}
                onChange={e => setHero({...hero, overlayStrength: parseInt(e.target.value)})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Înălțime</label>
                  <select 
                    className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent"
                    value={hero.height}
                    onChange={e => setHero({...hero, height: e.target.value as any})}
                  >
                    <option value="fullscreen">Fullscreen (100vh)</option>
                    <option value="large">Large (80vh)</option>
                    <option value="medium">Medium (60vh)</option>
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Aliniere Text</label>
                  <select 
                    className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent"
                    value={hero.align}
                    onChange={e => setHero({...hero, align: e.target.value as any})}
                  >
                    <option value="center">Centrat</option>
                    <option value="left">Stânga</option>
                  </select>
               </div>
            </div>
          </div>
        )}

        {/* --- CONTENT SETTINGS --- */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <p className="text-[10px] uppercase text-accent font-bold mb-4 bg-accent/10 p-2 inline-block">Configurare text pentru modurile VIDEO și IMAGE</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Eyebrow (Deasupra titlului)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="RO" value={hero.eyebrow.ro} onChange={e => setHero({...hero, eyebrow: {...hero.eyebrow, ro: e.target.value}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="EN" value={hero.eyebrow.en} onChange={e => setHero({...hero, eyebrow: {...hero.eyebrow, en: e.target.value}})} />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Subtitlu</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="RO" value={hero.subtitle.ro} onChange={e => setHero({...hero, subtitle: {...hero.subtitle, ro: e.target.value}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="EN" value={hero.subtitle.en} onChange={e => setHero({...hero, subtitle: {...hero.subtitle, en: e.target.value}})} />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Titlu Linia 1</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="RO" value={hero.titleLine1.ro} onChange={e => setHero({...hero, titleLine1: {...hero.titleLine1, ro: e.target.value}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="EN" value={hero.titleLine1.en} onChange={e => setHero({...hero, titleLine1: {...hero.titleLine1, en: e.target.value}})} />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-accent">Titlu Linia 2 (Highlight Gold)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="RO" value={hero.titleLine2.ro} onChange={e => setHero({...hero, titleLine2: {...hero.titleLine2, ro: e.target.value}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="EN" value={hero.titleLine2.en} onChange={e => setHero({...hero, titleLine2: {...hero.titleLine2, en: e.target.value}})} />
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] uppercase font-bold text-muted">Micro Features (separate prin virgulă)</label>
               <input 
                 className="w-full bg-surface-2 border border-border p-3 text-xs" 
                 placeholder="3D, CNC, etc." 
                 value={hero.microFeatures.join(', ')} 
                 onChange={e => setHero({...hero, microFeatures: e.target.value.split(',').map(s => s.trim())})} 
               />
            </div>

            <div className="border-t border-border pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Buton Principal (CTA)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs mb-2" placeholder="Label RO" value={hero.primaryCta.label.ro} onChange={e => setHero({...hero, primaryCta: {...hero.primaryCta, label: {...hero.primaryCta.label, ro: e.target.value}}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="Link (ex: /contact)" value={hero.primaryCta.href} onChange={e => setHero({...hero, primaryCta: {...hero.primaryCta, href: e.target.value}})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-muted">Buton Secundar (CTA)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs mb-2" placeholder="Label RO" value={hero.secondaryCta.label.ro} onChange={e => setHero({...hero, secondaryCta: {...hero.secondaryCta, label: {...hero.secondaryCta.label, ro: e.target.value}}})} />
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" placeholder="Link (ex: /portofoliu)" value={hero.secondaryCta.href} onChange={e => setHero({...hero, secondaryCta: {...hero.secondaryCta, href: e.target.value}})} />
                  <div className="flex items-center space-x-2 mt-2">
                     <input type="checkbox" checked={hero.secondaryCta.visible} onChange={e => setHero({...hero, secondaryCta: {...hero.secondaryCta, visible: e.target.checked}})} />
                     <span className="text-[10px]">Vizibil</span>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* --- MEDIA SETTINGS (Video/Image UPLOAD) --- */}
        {activeTab === 'media' && (
          <div className="space-y-8 max-w-3xl">
            {/* VIDEO UPLOAD */}
            <div className="space-y-4">
               <label className="text-[10px] uppercase font-bold text-muted">Video (MP4/WebM)</label>
               <div className="flex flex-col gap-4">
                 <input 
                    type="file" 
                    accept="video/mp4,video/webm"
                    className="block w-full text-xs text-muted
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-[10px] file:font-semibold
                      file:bg-accent file:text-white
                      hover:file:bg-accent/80"
                    onChange={(e) => handleFileUpload(e, 'videoUrl')}
                 />
                 {uploading && <p className="text-[10px] text-accent animate-pulse">Se încarcă fișierul...</p>}
                 <input 
                    className="w-full bg-surface-2 border border-border p-4 text-xs font-mono" 
                    placeholder="Sau link direct (https://...)"
                    value={hero.videoUrl} 
                    onChange={e => setHero({...hero, videoUrl: e.target.value})} 
                 />
                 <p className="text-[9px] text-muted italic">Fișierele mari (&gt;5MB) pot încetini browserul (stocare locală).</p>
               </div>
            </div>
            
            {/* POSTER UPLOAD */}
            <div className="space-y-4">
               <label className="text-[10px] uppercase font-bold text-muted">Poster / Imagine Fundal</label>
               <div className="flex flex-col gap-4">
                 <input 
                    type="file" 
                    accept="image/*"
                    className="block w-full text-xs text-muted
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-[10px] file:font-semibold
                      file:bg-accent file:text-white
                      hover:file:bg-accent/80"
                    onChange={(e) => handleFileUpload(e, 'posterUrl')}
                 />
                 <input 
                    className="w-full bg-surface-2 border border-border p-4 text-xs font-mono" 
                    placeholder="Sau link direct (https://...)"
                    value={hero.posterUrl} 
                    onChange={e => setHero({...hero, posterUrl: e.target.value})} 
                 />
                 {hero.posterUrl && (
                    <div className="h-40 w-full overflow-hidden border border-border">
                        <img src={hero.posterUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                 )}
               </div>
            </div>

            <div className="flex space-x-8">
               <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={hero.muted} onChange={e => setHero({...hero, muted: e.target.checked})} />
                  <label className="text-xs">Fără Sunet</label>
               </div>
               <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={hero.loop} onChange={e => setHero({...hero, loop: e.target.checked})} />
                  <label className="text-xs">Buclă (Loop)</label>
               </div>
               <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={hero.autoplay} onChange={e => setHero({...hero, autoplay: e.target.checked})} />
                  <label className="text-xs">Redare Automată</label>
               </div>
               <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={hero.showPlayButton} onChange={e => setHero({...hero, showPlayButton: e.target.checked})} />
                  <label className="text-xs">Arată Buton Play</label>
               </div>
            </div>
          </div>
        )}

        {/* --- SLIDER SETTINGS --- */}
        {activeTab === 'slider' && (
          <div className="space-y-8">
             {/* Unchanged slider logic, mostly link based but can use media manager urls */}
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={hero.autoplay} onChange={e => setHero({...hero, autoplay: e.target.checked})} />
                      <label className="text-xs font-bold uppercase">Autoplay</label>
                   </div>
                   <input 
                     type="number" 
                     className="bg-surface-2 border border-border p-2 w-20 text-xs" 
                     value={hero.interval} 
                     onChange={e => setHero({...hero, interval: parseInt(e.target.value)})} 
                   />
                   <span className="text-[9px] uppercase">ms</span>
                </div>
                <button onClick={addSlide} className="text-[9px] font-bold uppercase bg-surface-2 border border-border px-4 py-2 hover:bg-accent hover:text-white transition-all">+ Adaugă Slide</button>
             </div>

             <div className="space-y-6">
                {hero.slides.map((slide, idx) => (
                  <div key={slide.id} className="border border-border p-6 bg-surface-2 relative group">
                     {/* Existing slider inputs */}
                     <div className="absolute top-4 right-4 flex space-x-2">
                        <span className="text-[9px] font-bold bg-black/10 px-2 py-1">#{idx + 1}</span>
                        <button onClick={() => removeSlide(idx)} className="text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 text-[9px] font-bold">STERGE</button>
                     </div>
                     {/* ... (rest of slider inputs remain same, relying on URLs) ... */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[9px] uppercase font-bold text-muted">Imagine URL</label>
                              <input className="w-full border border-border p-2 text-xs" value={slide.imageUrl} onChange={e => updateSlide(idx, 'imageUrl', e.target.value)} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                              <label className="text-[9px] uppercase font-bold text-muted">Titlu (RO/EN)</label>
                              <div className="flex gap-2">
                                <input className="w-full border border-border p-2 text-xs" value={slide.title.ro} onChange={e => updateSlideNested(idx, 'title', 'ro', e.target.value)} placeholder="RO" />
                                <input className="w-full border border-border p-2 text-xs" value={slide.title.en} onChange={e => updateSlideNested(idx, 'title', 'en', e.target.value)} placeholder="EN" />
                              </div>
                           </div>
                           {/* ... rest of inputs ... */}
                        </div>
                     </div>
                  </div>
                ))}
                {hero.slides.length === 0 && <p className="text-center text-muted italic text-xs p-10">Niciun slide definit.</p>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
