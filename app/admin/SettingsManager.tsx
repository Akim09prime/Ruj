
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Settings, NavItem } from '../../types';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (settings) {
      await dbService.updateSettings(settings);
      alert('Setări globale actualizate!');
    }
  };

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    if (!settings) return;
    const newNav = settings.nav.map(item => item.id === id ? { ...item, ...updates } : item);
    setSettings({ ...settings, nav: newNav });
  };

  if (!settings) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 max-w-6xl animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Configurare Sistem</h1>
        <button 
          onClick={handleSave}
          className="bg-accent text-white px-10 py-3 text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-accent/20 hover:opacity-90 transition-all"
        >
          Salvează Modificările
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <section className="bg-surface p-8 border border-border shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Nomenclatoare Producție</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Tipuri Proiecte</label>
                <textarea 
                  className="w-full bg-surface-2 border border-border p-4 text-sm outline-none focus:border-accent min-h-[80px]"
                  value={settings.projectTypes.join(', ')}
                  onChange={e => setSettings({...settings, projectTypes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Încăperi (Filtre Galerie)</label>
                <textarea 
                  className="w-full bg-surface-2 border border-border p-4 text-sm outline-none focus:border-accent min-h-[80px]"
                  value={settings.rooms.join(', ')}
                  onChange={e => setSettings({...settings, rooms: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Categorii Obiecte</label>
                <textarea 
                  className="w-full bg-surface-2 border border-border p-4 text-sm outline-none focus:border-accent min-h-[80px]"
                  value={settings.pieceTypes.join(', ')}
                  onChange={e => setSettings({...settings, pieceTypes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                />
              </div>
            </div>
          </section>

          <section className="bg-surface p-8 border border-border shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Branding & CMS</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Prag Stele (Best-of)</label>
                <input 
                  type="number" 
                  className="w-full bg-surface-2 border border-border p-3 text-sm outline-none focus:border-accent"
                  value={settings.featuredStarsThreshold}
                  onChange={e => setSettings({...settings, featuredStarsThreshold: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted block">Parolă Admin</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-2 border border-border p-3 text-sm outline-none focus:border-accent"
                  value={settings.adminPassword}
                  onChange={e => setSettings({...settings, adminPassword: e.target.value})}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-surface p-8 border border-border shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Meniu Navigație (Public)</h2>
            <div className="space-y-3">
              {settings.nav.sort((a,b) => a.order - b.order).map((item, idx) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-surface-2 border border-border group">
                  <span className="text-[10px] font-bold text-muted w-4">{idx + 1}.</span>
                  <input 
                    className="flex-grow bg-transparent text-xs font-bold outline-none border-b border-transparent focus:border-accent"
                    value={item.label.ro}
                    onChange={e => updateNavItem(item.id, { label: { ro: e.target.value, en: item.label.en } })}
                  />
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateNavItem(item.id, { visible: !item.visible })}
                      className={`text-[9px] px-2 py-1 uppercase font-bold border transition-colors ${item.visible ? 'bg-accent text-white border-accent' : 'text-muted border-border'}`}
                    >
                      {item.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface p-8 border border-border shadow-sm space-y-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-red-500">Mentenanță Date</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => dbService.exportDB().then(json => {
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `carvello-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                })}
                className="p-4 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors"
              >
                Export JSON (Backup)
              </button>
              <label className="cursor-pointer p-4 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors text-center">
                Import JSON (Restore)
                <input type="file" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const text = await file.text();
                    try {
                      await dbService.importDB(text);
                      window.location.reload();
                    } catch { alert('Format invalid!'); }
                  }
                }} accept=".json" />
              </label>
            </div>
            <button 
              onClick={() => { if(confirm('Sunteți sigur că doriți să resetați TOATE datele la seed-ul inițial?')) dbService.resetToSeed().then(() => window.location.reload()); }}
              className="w-full p-4 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/5 transition-colors"
            >
              Reset to Factory Seed (Destructive)
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
