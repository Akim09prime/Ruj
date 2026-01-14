
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Media, Project, Settings } from '../../types';

export const ProjectMediaReorder: React.FC = () => {
  const { id } = useParams();
  const [media, setMedia] = useState<Media[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const loadData = async () => {
    if (!id) return;
    const p = await dbService.getProject(id);
    const m = await dbService.getMedia(id);
    const s = await dbService.getSettings();
    setProject(p || null);
    setMedia(m.sort((a, b) => a.orderInProject - b.orderInProject));
    setSettings(s);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddMedia = async () => {
    if (!newUrl || !id || !settings) return;
    const newMedia: Media = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: id,
      kind: 'image',
      url: newUrl,
      room: settings.rooms[0],
      stage: settings.stages[0],
      pieceTypes: [],
      stars: 0,
      caption: { ro: '', en: '' },
      shotDate: new Date().toISOString(),
      orderInProject: media.length,
      createdAt: new Date().toISOString()
    };
    await dbService.upsertMedia(newMedia);
    setNewUrl('');
    setIsAdding(false);
    loadData();
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newMedia = [...media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMedia.length) return;
    [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
    const updated = newMedia.map((m, i) => ({ ...m, orderInProject: i }));
    setMedia(updated);
  };

  const saveOrder = async () => {
    for (const m of media) {
      await dbService.upsertMedia(m);
    }
    alert('Ordine salvată cu succes!');
  };

  if (!project) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
        <div>
          <Link to="/admin/projects" className="text-[10px] uppercase font-bold text-accent mb-2 block hover:underline">← Înapoi la Proiecte</Link>
          <h1 className="font-serif text-3xl">Galerie Proiect: {project.title.ro}</h1>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsAdding(true)} className="bg-surface border border-border px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors">
            Adaugă Imagine
          </button>
          <button onClick={saveOrder} className="bg-accent text-white px-8 py-2 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20">
            Salvează Ordinea
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((m, idx) => (
          <div key={m.id} className="bg-surface border border-border p-4 flex flex-col group relative shadow-sm">
            <div className="aspect-video overflow-hidden mb-4 bg-surface-2">
              <img src={m.url} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold uppercase text-accent">{m.room}</span>
                <p className="text-[10px] text-muted">Stele: {m.stars} • Ordine: {m.orderInProject}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-2 border border-border disabled:opacity-30 hover:bg-surface-2">↑</button>
                <button onClick={() => moveItem(idx, 'down')} disabled={idx === media.length - 1} className="p-2 border border-border disabled:opacity-30 hover:bg-surface-2">↓</button>
                <button onClick={async () => { if(confirm('Ștergi imaginea?')) { await dbService.deleteMedia(m.id); loadData(); } }} className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/5">×</button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && <div className="col-span-full py-20 text-center border-2 border-dashed border-border text-muted uppercase text-[10px] font-bold">Galeria este goală</div>}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-background w-full max-w-lg p-10 border border-border shadow-2xl">
            <h2 className="font-serif text-2xl mb-6">Adaugă Imagine Nouă</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">URL Imagine</label>
                <input 
                  autoFocus
                  className="w-full bg-surface border border-border p-3 text-sm outline-none focus:border-accent"
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                />
              </div>
              <p className="text-[9px] text-muted italic">Imaginea va fi adăugată la sfârșitul listei.</p>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-[10px] uppercase font-bold border border-border">Anulează</button>
              <button onClick={handleAddMedia} className="bg-accent text-white px-8 py-2 text-[10px] font-bold uppercase tracking-widest">Adaugă în Proiect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
