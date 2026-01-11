
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Media, Project, Settings } from '../../types';
import { useI18n } from '../../lib/i18n';

export const MediaManager: React.FC = () => {
  const { t } = useI18n();
  const [media, setMedia] = useState<Media[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Media> | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  const loadData = async () => {
    setMedia(await dbService.getMedia());
    setProjects(await dbService.getProjects());
    setSettings(await dbService.getSettings());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!editing?.url || !editing.projectId) {
      alert('Te rugăm să introduci URL-ul și să selectezi un proiect.');
      return;
    }
    const newMedia = {
      ...editing,
      id: editing.id || Math.random().toString(36).substr(2, 9),
      createdAt: editing.createdAt || new Date().toISOString(),
      pieceTypes: editing.pieceTypes || [],
      stars: editing.stars || 0,
      orderInProject: editing.orderInProject || 0,
    } as Media;
    
    await dbService.upsertMedia(newMedia);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sigur vrei să ștergi această imagine?')) {
      await dbService.deleteMedia(id);
      loadData();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Gestiune Media Globală</h1>
        <button 
          onClick={() => setEditing({ kind: 'image', stars: 0, orderInProject: 0, projectId: projects[0]?.id || '', room: settings?.rooms[0] || 'Living', pieceTypes: [], caption: { ro: '', en: '' } })}
          className="bg-accent text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90"
        >
          Adaugă Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {media.map(m => (
          <div key={m.id} className="group relative aspect-square bg-surface border border-border overflow-hidden shadow-sm">
            <img src={m.url} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-4 text-center">
              <span className="text-[9px] text-white/70 uppercase font-bold tracking-tighter">Proiect: {projects.find(p => p.id === m.projectId)?.title.ro || 'N/A'}</span>
              <span className="text-[10px] text-white uppercase font-bold">{m.room}</span>
              <div className="flex text-accent text-xs">
                {'★'.repeat(m.stars)}{'☆'.repeat(5 - m.stars)}
              </div>
              <div className="flex space-x-2 pt-2">
                <button onClick={() => setEditing(m)} className="text-[9px] bg-white text-black px-2 py-1 uppercase font-bold">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="text-[9px] bg-red-600 text-white px-2 py-1 uppercase font-bold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-background w-full max-w-xl p-10 border border-border shadow-2xl space-y-6">
            <h2 className="font-serif text-2xl mb-4">Editare Resursă Media</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold">URL Imagine</label>
                <input 
                  className="w-full bg-surface border border-border p-3 text-sm outline-none focus:border-accent"
                  value={editing.url || ''} 
                  onChange={e => setEditing({...editing, url: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold">Proiect Asociat</label>
                  <select 
                    className="w-full bg-surface border border-border p-3 text-sm outline-none"
                    value={editing.projectId}
                    onChange={e => setEditing({...editing, projectId: e.target.value})}
                  >
                    <option value="">Alege Proiect...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title.ro}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold">Încăpere</label>
                  <select 
                    className="w-full bg-surface border border-border p-3 text-sm outline-none"
                    value={editing.room}
                    onChange={e => setEditing({...editing, room: e.target.value})}
                  >
                    {settings?.rooms.map((r: string) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold">Rating (Stars)</label>
                  <input 
                    type="number" min="0" max="5" 
                    className="w-full bg-surface border border-border p-3 text-sm outline-none"
                    value={editing.stars}
                    onChange={e => setEditing({...editing, stars: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold">Ordine in Proiect</label>
                  <input 
                    type="number"
                    className="w-full bg-surface border border-border p-3 text-sm outline-none"
                    value={editing.orderInProject}
                    onChange={e => setEditing({...editing, orderInProject: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold">Descriere (RO)</label>
                <input 
                  className="w-full bg-surface border border-border p-3 text-sm outline-none"
                  value={editing.caption?.ro || ''}
                  onChange={e => setEditing({...editing, caption: { ro: e.target.value, en: editing.caption?.en || '' }})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-6 py-2 text-[10px] uppercase font-bold tracking-widest border border-border">Anulează</button>
              <button onClick={handleSave} className="bg-accent text-white px-8 py-2 text-[10px] uppercase font-bold tracking-widest hover:opacity-90">Salvează Media</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
