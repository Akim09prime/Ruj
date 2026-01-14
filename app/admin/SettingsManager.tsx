
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Settings, NavItem, Theme } from '../../types';
import { useTheme } from '../../lib/theme';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (settings) {
      await dbService.updateSettings(settings);
      setTheme(settings.activeTheme);
      alert('Setările globale și tema au fost salvate cu succes!');
    }
  };

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    if (!settings) return;
    const newNav = settings.nav.map(item => item.id === id ? { ...item, ...updates } : item);
    setSettings({ ...settings, nav: newNav });
  };

  const themePresets: { id: Theme; label: string; colors: string[] }[] = [
    { id: 'dark', label: 'Dark Default', colors: ['#0B0D10', '#C9A24A'] },
    { id: 'light', label: 'Classic Ivory', colors: ['#F5F0E8', '#B8923B'] },
    { id: 'obsidian', label: 'Obsidian Gold', colors: ['#050505', '#9C7B2E'] },
    { id: 'champagne', label: 'Champagne Minimal', colors: ['#FDFCF0', '#A68D7B'] },
    { id: 'marble', label: 'Architect Marble', colors: ['#F7F7F7', '#333333'] },
    { id: 'navy', label: 'Royal Navy', colors: ['#0A1128', '#B08D57'] },
    { id: 'emerald', label: 'Emerald Velvet', colors: ['#062C21', '#CD7F32'] },
    { id: 'desert', label: 'Desert Modern', colors: ['#EAE2D6', '#A0522D'] },
    { id: 'industrial', label: 'Industrial Loft', colors: ['#2B2D2F', '#E67E22'] },
    { id: 'nordic', label: 'Nordic Pine', colors: ['#F0F4F7', '#2C3E50'] },
    { id: 'rose', label: 'Rose Copper', colors: ['#FFF5F5', '#E5989B'] },
  ];

  if (!settings) return <div className="p-8 text-muted uppercase text-[10px] animate-pulse">Se încarcă configurația...</div>;

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="flex justify-between items-end mb-12 border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-4xl mb-2">Configurare Platformă</h1>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Control vizual și tehnic global</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-accent text-white px-12 py-3 text-[10px] uppercase font-bold tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all"
        >
          Salvează Tot
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <section className="bg-surface p-8 border border-border shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-8 border-b border-border pb-4">Theme Engine (Luxury Presets)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {themePresets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSettings({...settings, activeTheme: t.id})}
                  className={`relative p-4 border transition-all text-left group flex flex-col justify-between ${settings.activeTheme === t.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}
                >
                  <div>
                    <div className="flex space-x-1 mb-3">
                      {t.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-widest leading-tight ${settings.activeTheme === t.id ? 'text-accent' : 'text-muted'}`}>{t.label}</span>
                  </div>
                  {settings.activeTheme === t.id && <span className="absolute top-2 right-2 text-[10px]">✔</span>}
                </button>
              ))}
            </div>
            <p className="mt-6 text-[9px] text-muted italic">Schimbarea temei aici va afecta aspectul site-ului pentru toți vizitatorii.</p>
          </section>

          <section className="bg-surface p-8 border border-border shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-8 border-b border-border pb-4">Nomenclatoare Producție</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Categorii Proiecte</label>
                <textarea 
                  className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent min-h-[100px] leading-relaxed"
                  value={settings.projectTypes.join(', ')}
                  onChange={e => setSettings({...settings, projectTypes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="Rezidențial, HoReCa, Office..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Încăperi</label>
                <textarea 
                  className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent min-h-[100px] leading-relaxed"
                  value={settings.rooms.join(', ')}
                  onChange={e => setSettings({...settings, rooms: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                />
              </div>
            </div>
          </section>

          <section className="bg-surface p-8 border border-border shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-8 border-b border-border pb-4">Branding & Logo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted">Logo Dark Theme (URL)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={settings.brand.logoDarkUrl} onChange={e => setSettings({...settings, brand: {...settings.brand, logoDarkUrl: e.target.value}})} />
                </div>
                <div className="h-20 bg-black flex items-center justify-center border border-border">
                  <img src={settings.brand.logoDarkUrl} className="max-h-12" alt="Preview Dark" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted">Logo Light Theme (URL)</label>
                  <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={settings.brand.logoLightUrl} onChange={e => setSettings({...settings, brand: {...settings.brand, logoLightUrl: e.target.value}})} />
                </div>
                <div className="h-20 bg-white flex items-center justify-center border border-border">
                  <img src={settings.brand.logoLightUrl} className="max-h-12" alt="Preview Light" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-surface p-8 border border-border shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-6">Navigație Website</h2>
            <div className="space-y-2">
              {settings.nav.sort((a,b) => a.order - b.order).map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-surface-2 border border-border group hover:border-accent transition-colors">
                  <div className="flex-grow">
                    <input 
                      className="bg-transparent text-xs font-bold w-full outline-none"
                      value={item.label.ro}
                      onChange={e => updateNavItem(item.id, { label: { ro: e.target.value, en: item.label.en } })}
                    />
                    <div className="text-[8px] text-muted font-mono">{item.href}</div>
                  </div>
                  <button 
                    onClick={() => updateNavItem(item.id, { visible: !item.visible })}
                    className={`px-2 py-1 text-[8px] uppercase font-bold rounded ${item.visible ? 'bg-accent text-white' : 'bg-border text-muted'}`}
                  >
                    {item.visible ? 'On' : 'Off'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface p-8 border border-border shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-red-500 mb-6 uppercase">Zonă Periculoasă</h2>
            <div className="space-y-4">
               <button 
                 onClick={() => { if(confirm('Resetăm baza de date? Toate modificările vor fi pierdute.')) dbService.resetToSeed().then(() => window.location.reload()); }}
                 className="w-full p-4 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
               >
                 Resetează la Seed (Factory Reset)
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
