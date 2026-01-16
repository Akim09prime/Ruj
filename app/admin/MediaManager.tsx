
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
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');
  const [filterKind, setFilterKind] = useState<'all' | 'image' | 'video'>('all');

  const loadData = async () => {
    setMedia(await dbService.getMedia());
    setProjects(await dbService.getProjects());
    setSettings(await dbService.getSettings());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditing(prev => prev ? { ...prev, url: base64String } : null);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Eroare la citirea fișierului.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editing?.url || !editing.projectId) {
      alert('Te rugăm să încarci o imagine sau să introduci un URL și să selectezi un proiect.');
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

  const executeDelete = async () => {
    if (confirmDelete) {
      await dbService.deleteMedia(confirmDelete);
      setConfirmDelete(null);
      loadData();
    }
  };

  const filteredMedia = media.filter(m => {
    const matchesSearch = (m.url && m.url.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (m.caption?.ro?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (m.caption?.en?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProject = filterProject === '' || m.projectId === filterProject;
    const matchesStars = filterStars === 'all' || m.stars === filterStars;
    const matchesKind = filterKind === 'all' || m.kind === filterKind;
    
    return matchesSearch && matchesProject && matchesStars && matchesKind;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="font-serif text-4xl mb-2">Gestiune Media Globală</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Total resurse arhivate: {media.length}</p>
        </div>
        <button 
          onClick={() => setEditing({ kind: 'image', stars: 0, orderInProject: 0, projectId: projects[0]?.id || '', room: settings?.rooms[0] || 'Living', pieceTypes: [], caption: { ro: '', en: '' } })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 shadow-xl shadow-accent/20 transition-all"
        >
          Adaugă Media Nouă
        </button>
      </div>

      <div className="bg-surface p-8 border border-border mb-12 grid grid-cols-1 md:grid-cols-4 gap-8 shadow-sm">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Căutare Globală</label>
          <input 
            type="text"
            className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent"
            placeholder="URL, descriere..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Proiect</label>
          <select 
            className="w-full bg-surface-2 border border-border p-3 text-xs outline-none"
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
          >
            <option value="">Toate Proiectele</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title.ro}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Stele (Minim)</label>
          <select 
            className="w-full bg-surface-2 border border-border p-3 text-xs outline-none"
            value={filterStars}
            onChange={e => setFilterStars(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">Oricâte</option>
            {[5,4,3,2,1,0].map(s => <option key={s} value={s}>{s} Stele</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Modalitate</label>
          <select 
            className="w-full bg-surface-2 border border-border p-3 text-xs outline-none"
            value={filterKind}
            onChange={e => setFilterKind(e.target.value as any)}
          >
            <option value="all">Imagini & Video</option>
            <option value="image">Doar Imagini</option>
            <option value="video">Doar Video</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredMedia.map(m => (
          <div key={m.id} className="group relative aspect-square bg-surface border border-border overflow-hidden shadow-sm hover:border-accent transition-all">
            <img src={m.url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 p-6 text-center">
              <span className="text-[8px] text-accent uppercase font-bold tracking-[0.2em]">{projects.find(p => p.id === m.projectId)?.title.ro}</span>
              <div className="flex text-accent text-[9px]">
                {'★'.repeat(m.stars)}{'☆'.repeat(5 - m.stars)}
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <button onClick={() => setEditing(m)} className="w-full text-[9px] bg-white text-black py-2 uppercase font-bold hover:bg-accent hover:text-white transition-all">Edit</button>
                <button onClick={() => setConfirmDelete(m.id)} className="w-full text-[9px] bg-red-600/20 text-red-500 py-2 uppercase font-bold hover:bg-red-500 hover:text-white transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-background max-w-sm w-full p-12 border border-border shadow-2xl text-center">
            <h2 className="font-serif text-3xl mb-4">Elimină Resursa</h2>
            <p className="text-muted text-xs mb-10 leading-relaxed uppercase tracking-widest font-bold italic">Ești pe cale să ștergi definitiv acest fișier media din arhivă.</p>
            <div className="flex flex-col space-y-3">
              <button onClick={executeDelete} className="w-full py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-red-600 transition-all">Șterge Definitiv</button>
              <button onClick={() => setConfirmDelete(null)} className="w-full py-4 border border-border text-muted font-bold uppercase tracking-widest text-[9px] hover:bg-surface-2 transition-all">Păstrează</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <div className="bg-background w-full max-w-xl p-10 border border-border shadow-2xl space-y-8 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-3xl">Editare Media</h2>
              <button onClick={() => setEditing(null)} className="text-3xl font-light">×</button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted block">Sursă Fişier</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    className="border-2 border-dashed border-border hover:border-accent transition-all relative h-48 flex flex-col items-center justify-center bg-surface-2 cursor-pointer"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    {editing.url ? (
                      <img src={editing.url} className="absolute inset-0 w-full h-full object-contain p-2" alt="Preview" />
                    ) : (
                      <div className="text-center p-6">
                        <span className="text-3xl mb-3 block opacity-30">↑</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-muted italic">Alege de pe disc</span>
                      </div>
                    )}
                    <input id="file-upload-input" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-muted">Link Manual</label>
                    <textarea className="w-full h-48 bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent font-mono resize-none leading-relaxed" placeholder="https://..." value={editing.url || ''} onChange={e => setEditing({...editing, url: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Proiect Asociat</label>
                  <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none" value={editing.projectId} onChange={e => setEditing({...editing, projectId: e.target.value})}>
                    <option value="">Selectează proiectul...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title.ro}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Încăpere</label>
                  <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none" value={editing.room} onChange={e => setEditing({...editing, room: e.target.value})}>
                    {settings?.rooms.map((r: string) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Rating Master (0-5)</label>
                  <input type="number" min="0" max="5" className="w-full bg-surface-2 border border-border p-4 text-xs outline-none" value={editing.stars} onChange={e => setEditing({...editing, stars: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Ordine în Proiect</label>
                  <input type="number" className="w-full bg-surface-2 border border-border p-4 text-xs outline-none" value={editing.orderInProject} onChange={e => setEditing({...editing, orderInProject: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-border mt-8">
              <button onClick={() => setEditing(null)} className="px-10 py-3 text-[10px] uppercase font-bold tracking-widest border border-border hover:bg-surface-2 transition-all">Anulează</button>
              <button onClick={handleSave} className="bg-accent text-white px-12 py-3 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 shadow-2xl shadow-accent/20 transition-all">Salvează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
