
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Project, Media } from '../../types';
import { Link } from 'react-router-dom';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMedia, setProjectMedia] = useState<Media[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  const loadData = async () => {
    const p = await dbService.getProjects();
    setProjects(p);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = async (p: Project) => {
    const m = await dbService.getMedia(p.id);
    setProjectMedia(m);
    setEditing(p);
  };

  const handleSave = async () => {
    if (!editing?.id) return;
    const fullProject = {
      ...editing,
      updatedAt: new Date().toISOString()
    } as Project;
    await dbService.upsertProject(fullProject);
    setEditing(null);
    loadData();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Gestiune Proiecte</h1>
        <button 
          onClick={() => setEditing({ id: Math.random().toString(36).substr(2, 9), title: { ro: '', en: '' }, summary: { ro: '', en: '' }, location: { ro: '', en: '' }, publishedAt: new Date().toISOString(), isPublished: true, createdAt: new Date().toISOString(), projectType: 'Rezidențial', coverMediaId: null })}
          className="bg-accent text-white px-6 py-2 text-xs font-bold uppercase tracking-widest"
        >
          Proiect Nou
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p.id} className="bg-surface p-6 border border-border flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-2 border border-border flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-muted">LOGO</span>
              </div>
              <div>
                <h3 className="font-bold">{p.title.ro || 'Fără titlu'}</h3>
                <p className="text-xs text-muted">{p.projectType} — {p.location.ro}</p>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <Link to={`/admin/projects/${p.id}/media`} className="text-[10px] font-bold uppercase tracking-widest bg-surface-2 px-3 py-1 border border-border hover:bg-border transition-colors">
                Media ({p.id})
              </Link>
              <button onClick={() => handleEdit(p)} className="text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/20 px-3 py-1 hover:bg-accent/10">Editează</button>
              <button onClick={() => {
                if(window.confirm('Ești sigur? Această acțiune va șterge și galeria proiectului.')) {
                  dbService.deleteProject(p.id).then(loadData)
                }
              }} className="text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-500/20 px-3 py-1 hover:bg-red-500/10">Șterge</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-background w-full max-w-2xl p-8 border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
               <h2 className="font-serif text-2xl">Editează Proiect</h2>
               <button onClick={() => setEditing(null)} className="text-2xl font-light">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold">Titlu RO</label>
                  <input className="w-full bg-surface border border-border p-3 outline-none focus:border-accent" value={editing.title?.ro} onChange={e => setEditing({...editing, title: {...editing.title!, ro: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold">Titlu EN</label>
                  <input className="w-full bg-surface border border-border p-3 outline-none focus:border-accent" value={editing.title?.en} onChange={e => setEditing({...editing, title: {...editing.title!, en: e.target.value}})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold">Sumar (RO)</label>
                <textarea className="bg-surface border border-border p-3 w-full h-24 outline-none focus:border-accent text-sm" value={editing.summary?.ro} onChange={e => setEditing({...editing, summary: {...editing.summary!, ro: e.target.value}})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold">Locație RO</label>
                  <input className="w-full bg-surface border border-border p-3 outline-none focus:border-accent" value={editing.location?.ro} onChange={e => setEditing({...editing, location: {...editing.location!, ro: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold">Tip Proiect</label>
                  <select className="w-full bg-surface border border-border p-3 outline-none focus:border-accent" value={editing.projectType} onChange={e => setEditing({...editing, projectType: e.target.value})}>
                    <option value="Rezidențial">Rezidențial</option>
                    <option value="HoReCa">HoReCa</option>
                    <option value="Office">Office</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold">Imagine Copertă (Media ID)</label>
                <div className="grid grid-cols-4 gap-2 border border-border p-2 bg-surface-2">
                  {projectMedia.length > 0 ? projectMedia.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => setEditing({...editing, coverMediaId: m.id})}
                      className={`aspect-square cursor-pointer border-2 transition-all ${editing.coverMediaId === m.id ? 'border-accent scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={m.url} className="w-full h-full object-cover" alt="" />
                    </div>
                  )) : (
                    <div className="col-span-4 py-4 text-center text-[10px] uppercase text-muted italic">Incarcă imagini în galeria proiectului întâi</div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 items-center bg-surface-2 p-4 border border-border">
                 <input type="checkbox" id="published" checked={editing.isPublished} onChange={e => setEditing({...editing, isPublished: e.target.checked})} />
                 <label htmlFor="published" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Publicat pe Site (Vizibil public)</label>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
                <button onClick={() => setEditing(null)} className="px-6 py-2 text-[10px] uppercase font-bold tracking-widest border border-border hover:bg-surface-2 transition-colors">Anulează</button>
                <button onClick={handleSave} className="bg-accent text-white px-10 py-2 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 shadow-lg shadow-accent/20">Salvează Modificările</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
