
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Settings, NavItem, Theme } from '../../types';
import { useTheme } from '../../lib/theme';

export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { setTheme } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (settings) {
      await dbService.updateSettings(settings);
      setTheme(settings.activeTheme);
      alert('Setările au fost salvate!');
      window.location.reload();
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    
    try {
      const success = await dbService.changePassword(newPassword);
      if (success) {
        setPasswordStatus({ type: 'success', text: 'Parola a fost schimbată cu succes!' });
        setNewPassword('');
      } else {
        setPasswordStatus({ type: 'error', text: 'Eroare la schimbarea parolei.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', text: 'Eroare la schimbarea parolei.' });
    }
  };

  const themePresets: { id: Theme; label: string; colors: string[] }[] = [
    { id: 'dark', label: 'Dark', colors: ['#0B0D10', '#C9A24A'] },
    { id: 'light', label: 'Light', colors: ['#F5F0E8', '#B8923B'] },
    { id: 'obsidian', label: 'Obsidian', colors: ['#050505', '#9C7B2E'] },
  ];

  if (!settings) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Setări Sistem</h1>
        <button onClick={handleSave} className="bg-accent text-white px-10 py-3 text-[10px] font-bold uppercase tracking-widest">Salvează Tot</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* MAINTENANCE TOGGLE */}
        <section className="bg-surface p-8 border border-border shadow-sm">
          <h2 className="text-xs uppercase font-bold text-accent mb-6">Status Site</h2>
          <div className={`p-6 border ${settings.maintenanceMode ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'}`}>
             <div className="flex items-center justify-between">
                <div>
                   <span className="block font-serif text-xl">{settings.maintenanceMode ? 'Mod Mentenanță ACTIV' : 'Site Online'}</span>
                   <p className="text-[10px] text-muted mt-1 uppercase tracking-widest">{settings.maintenanceMode ? 'Vizitatorii văd pagina de construcție' : 'Site-ul este public'}</p>
                </div>
                <div 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`}
                >
                   <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
             </div>
          </div>
        </section>

        {/* THEMES */}
        <section className="bg-surface p-8 border border-border shadow-sm md:col-span-2">
          <h2 className="text-xs uppercase font-bold text-accent mb-6">Teme Vizuale</h2>
          <div className="grid grid-cols-3 gap-4">
            {themePresets.map(t => (
              <button key={t.id} onClick={() => setSettings({...settings, activeTheme: t.id})} className={`p-4 border text-left ${settings.activeTheme === t.id ? 'border-accent bg-accent/5' : 'border-border'}`}>
                <div className="flex gap-1 mb-2">
                  {t.colors.map(c => <div key={c} className="w-3 h-3 rounded-full" style={{backgroundColor: c}}></div>)}
                </div>
                <span className="text-[10px] uppercase font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-surface p-8 border border-border shadow-sm md:col-span-2">
          <h2 className="text-xs uppercase font-bold text-accent mb-6">Securitate</h2>
          <div className="max-w-md">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Noua Parolă</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none"
                  placeholder="Introduceți noua parolă"
                  required
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-surface-2 border border-border hover:bg-accent hover:text-white text-[10px] uppercase font-bold transition-colors"
              >
                Schimbă Parola
              </button>
              {passwordStatus && (
                <p className={`text-xs mt-2 ${passwordStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordStatus.text}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* DATA MANAGEMENT */}
        <section className="bg-surface p-8 border border-border shadow-sm md:col-span-2">
          <h2 className="text-xs uppercase font-bold text-accent mb-6">Management Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-border">
              <h3 className="text-[10px] uppercase font-bold mb-2">Exportă Baza de Date</h3>
              <p className="text-xs text-muted mb-4">Descarcă o copie completă a tuturor datelor (proiecte, setări, texte).</p>
              <button 
                onClick={() => dbService.exportDB()}
                className="w-full py-3 bg-surface-2 border border-border hover:bg-accent hover:text-white text-[10px] uppercase font-bold transition-colors"
              >
                Descarcă Backup JSON
              </button>
            </div>

            <div className="p-4 border border-border">
              <h3 className="text-[10px] uppercase font-bold mb-2">Importă Baza de Date</h3>
              <p className="text-xs text-muted mb-4">Restaurează date dintr-un fișier JSON anterior.</p>
              <label className="block w-full py-3 bg-surface-2 border border-border hover:bg-accent hover:text-white text-[10px] uppercase font-bold transition-colors text-center cursor-pointer">
                Selectează Fișier
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      try {
                        const content = ev.target?.result as string;
                        if (confirm('Ești sigur? Această acțiune va înlocui TOATE datele curente.')) {
                          await dbService.importDB(content);
                        }
                      } catch (err) {
                        alert('Eroare la import: Fișier invalid.');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>

            <div className="p-4 border border-red-500/20 bg-red-500/5">
              <h3 className="text-[10px] uppercase font-bold mb-2 text-red-500">Resetare Totală</h3>
              <p className="text-xs text-muted mb-4">Șterge toate datele și revine la setările din fabrică.</p>
              <button 
                onClick={async () => {
                  if (confirm('ATENȚIE! Această acțiune este ireversibilă. Toate datele vor fi șterse. Continui?')) {
                    if (confirm('Sigur? Confirmă a doua oară.')) {
                      await dbService.resetToSeed();
                    }
                  }
                }}
                className="w-full py-3 bg-red-500 text-white text-[10px] uppercase font-bold hover:bg-red-600 transition-colors"
              >
                Resetare la Default
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
