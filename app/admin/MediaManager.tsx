
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

  // Funcție pentru conversia fișierului în Base64
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

  const handleDelete = async (id: string) => {
    if (confirm('Sigur vrei să ștergi această imagine?')) {
      await dbService.deleteMedia(id);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl mb-1">Gestiune Media Globală</h1>
          <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Total resurse: {media.length} | Filtrate: {filteredMedia.length}</p>
        </div>
        <button 
          onClick={() => setEditing({ kind: 'image', stars: 0, orderInProject: 0, projectId: projects[0]?.id || '', room: settings?.rooms[0] || 'Living', pieceTypes: [], caption: { ro: '', en: '' } })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 shadow-lg shadow-accent/20 transition-all"
        >
          Adaugă Media Nouă
        </button>
      </div>

      {/* Toolbar Filtrare */}
      <div className="bg-surface p-6 border border-border mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Căutare (URL/Descriere)</label>
          <input 
            type="text"
            className="w-full bg-surface-2 border border-border p-2 text-xs outline-none focus:border-accent"
            placeholder="Caută..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Proiect</label>
          <select 
            className="w-full bg-surface-2 border border-border p-2 text-xs outline-none"
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
          >
            <option value="">Toate Proiectele</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title.ro}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Rating (Stele)</label>
          <select 
            className="w-full bg-surface-2 border border-border p-2 text-xs outline-none"
            value={filterStars}
            onChange={e => setFilterStars(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">Orice Rating</option>
            {[5,4,3,2,1,0].map(s => <option key={s} value={s}>{s} Stele</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] uppercase font-bold text-muted tracking-widest">Tip Media</label>
          <select 
            className="w-full bg-surface-2 border border-border p-2 text-xs outline-none"
            value={filterKind}
            onChange={e => setFilterKind(e.target.value as any)}
          >
            <option value="all">Toate Tipurile</option>
            <option value="image">Imagini</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* Grid Rezultate */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredMedia.map(m => (
          <div key={m.id} className="group relative aspect-square bg-surface border border-border overflow-hidden shadow-sm transition-all hover:border-accent">
            <img src={m.url} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-4 text-center">
              <span className="text-[8px] text-accent uppercase font-bold tracking-widest">
                {projects.find(p => p.id === m.projectId)?.title.ro || 'N/A'}
              </span>
              <span className="text-[10px] text-white uppercase font-bold tracking-tighter">{m.room}</span>
              <div className="flex text-accent text-[10px]">
                {'★'.repeat(m.stars)}{'☆'.repeat(5 - m.stars)}
              </div>
              <div className="flex space-x-2 pt-2">
                <button onClick={() => setEditing(m)} className="text-[9px] bg-white text-black px-3 py-1 uppercase font-bold hover:bg-accent hover:text-white transition-colors">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="text-[9px] bg-red-600 text-white px-3 py-1 uppercase font-bold hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filteredMedia.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border">
            <p className="text-muted font-serif text-2xl italic">Nu am găsit nicio resursă media.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <div className="bg-background w-full max-w-xl p-10 border border-border shadow-2xl space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-3xl">Editare Resursă</h2>
              <button onClick={() => setEditing(null)} className="text-2xl font-light">×</button>
            </div>
            
            <div className="space-y-6">
              {/* Secțiune Upload Direct / URL */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted block">Sursă Imagine</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload File */}
                  <div className="space-y-2">
                    <div 
                      className="border-2 border-dashed border-border hover:border-accent transition-colors relative h-40 flex flex-col items-center justify-center bg-surface-2 cursor-pointer group"
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                      {editing.url ? (
                        <img src={editing.url} className="absolute inset-0 w-full h-full object-contain p-2" alt="Preview" />
                      ) : (
                        <div className="text-center p-4">
                          <span className="text-2xl mb-2 block">↑</span>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-muted group-hover:text-accent italic">Încarcă de pe disc</span>
                        </div>
                      )}
                      <input 
                        id="file-upload-input"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual URL */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-muted">Sau lipește URL extern</label>
                    <textarea 
                      className="w-full h-40 bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent font-mono resize-none"
                      placeholder="https://..."
                      value={editing.url || ''} 
                      onChange={e => setEditing({...editing, url: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Proiect Asociat</label>
                  <select 
                    className="w-full bg-surface-2 border border-border p-3 text-sm outline-none"
                    value={editing.projectId}
                    onChange={e => setEditing({...editing, projectId: e.target.value})}
                  >
                    <option value="">Alege Proiect...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title.ro}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Încăpere</label>
                  <select 
                    className="w-full bg-surface-2 border border-border p-3 text-sm outline-none"
                    value={editing.room}
                    onChange={e => setEditing({...editing, room: e.target.value})}
                  >
                    {settings?.rooms.map((r: string) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Rating (0-5 Stele)</label>
                  <input 
                    type="number" min="0" max="5" 
                    className="w-full bg-surface-2 border border-border p-3 text-sm outline-none"
                    value={editing.stars}
                    onChange={e => setEditing({...editing, stars: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Ordine</label>
                  <input 
                    type="number"
                    className="w-full bg-surface-2 border border-border p-3 text-sm outline-none"
                    value={editing.orderInProject}
                    onChange={e => setEditing({...editing, orderInProject: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Descriere (RO)</label>
                <input 
                  className="w-full bg-surface-2 border border-border p-3 text-sm outline-none focus:border-accent"
                  value={editing.caption?.ro || ''}
                  onChange={e => setEditing({...editing, caption: { ro: e.target.value, en: editing.caption?.en || '' }})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-8 py-3 text-[10px] uppercase font-bold tracking-widest border border-border hover:bg-surface-2 transition-colors">Anulează</button>
              <button onClick={handleSave} className="bg-accent text-white px-10 py-3 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 shadow-lg shadow-accent/20">Salvează Modificările</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
