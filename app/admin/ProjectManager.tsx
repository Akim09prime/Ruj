
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Project, Media } from '../../types';
import { Link } from 'react-router-dom';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMedia, setProjectMedia] = useState<Media[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  const executeDelete = async () => {
    if (confirmDelete) {
      await dbService.deleteProject(confirmDelete);
      setConfirmDelete(null);
      loadData();
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl mb-2">Gestiune Proiecte</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Catalogul de Referințe CARVELLO</p>
        </div>
        <button 
          onClick={() => setEditing({ id: Math.random().toString(36).substr(2, 9), title: { ro: '', en: '' }, summary: { ro: '', en: '' }, location: { ro: '', en: '' }, publishedAt: new Date().toISOString(), isPublished: true, createdAt: new Date().toISOString(), projectType: 'Rezidențial', coverMediaId: null })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all"
        >
          Proiect Nou
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-surface p-8 border border-border flex flex-col md:flex-row justify-between items-center shadow-sm hover:border-accent/40 transition-all group">
            <div className="flex items-center space-x-6 w-full md:w-auto mb-6 md:mb-0">
              <div className="w-20 h-20 bg-surface-2 border border-border flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-[8px] text-muted uppercase font-bold tracking-widest">Preview</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-1 group-hover:text-accent transition-colors">{p.title.ro || 'Fără titlu'}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{p.projectType}</span>
                  <span className="w-1 h-1 bg-border rounded-full"></span>
                  <span className="text-[10px] text-muted">{p.location.ro}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 items-center w-full md:w-auto justify-end">
              <Link to={`/admin/projects/${p.id}/media`} className="text-[9px] font-bold uppercase tracking-widest bg-surface-2 px-5 py-2 border border-border hover:bg-foreground hover:text-white transition-all">
                Galerie
              </Link>
              <button onClick={() => handleEdit(p)} className="text-[9px] font-bold uppercase tracking-widest text-accent border border-accent/20 px-5 py-2 hover:bg-accent hover:text-white transition-all">Editează</button>
              <button onClick={() => setConfirmDelete(p.id)} className="text-[9px] font-bold uppercase tracking-widest text-red-500 border border-red-500/20 px-5 py-2 hover:bg-red-500 hover:text-white transition-all">Elimină</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-background max-w-md w-full p-12 border border-border shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9 2 2 4-4"/></svg>
            </div>
            <h2 className="font-serif text-3xl mb-4">Ești sigur?</h2>
            <p className="text-muted text-sm mb-10 leading-relaxed uppercase tracking-widest font-bold">Această acțiune este ireversibilă și va șterge automat toate pozele asociate proiectului.</p>
            <div className="flex flex-col space-y-4">
              <button onClick={executeDelete} className="w-full py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">
                Confirmă Ștergerea
              </button>
              <button onClick={() => setConfirmDelete(null)} className="w-full py-4 border border-border text-muted font-bold uppercase tracking-widest text-[10px] hover:bg-surface-2 transition-all">
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <div className="bg-background w-full max-w-2xl p-10 border border-border shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
               <h2 className="font-serif text-3xl">Configurare Proiect</h2>
               <button onClick={() => setEditing(null)} className="text-3xl font-light hover:text-accent transition-colors">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Titlu RO</label>
                  <input className="w-full bg-surface-2 border border-border p-4 outline-none focus:border-accent text-sm" value={editing.title?.ro} onChange={e => setEditing({...editing, title: {...editing.title!, ro: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Titlu EN</label>
                  <input className="w-full bg-surface-2 border border-border p-4 outline-none focus:border-accent text-sm" value={editing.title?.en} onChange={e => setEditing({...editing, title: {...editing.title!, en: e.target.value}})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Sumar (RO)</label>
                <textarea className="bg-surface-2 border border-border p-4 w-full h-32 outline-none focus:border-accent text-sm leading-relaxed" value={editing.summary?.ro} onChange={e => setEditing({...editing, summary: {...editing.summary!, ro: e.target.value}})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Locație RO</label>
                  <input className="w-full bg-surface-2 border border-border p-4 outline-none focus:border-accent text-sm" value={editing.location?.ro} onChange={e => setEditing({...editing, location: {...editing.location!, ro: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Tip Proiect</label>
                  <select className="w-full bg-surface-2 border border-border p-4 outline-none focus:border-accent text-sm" value={editing.projectType} onChange={e => setEditing({...editing, projectType: e.target.value})}>
                    <option value="Rezidențial">Rezidențial</option>
                    <option value="HoReCa">HoReCa</option>
                    <option value="Office">Office</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Imagine Copertă</label>
                <div className="grid grid-cols-4 gap-4 border border-border p-4 bg-surface-2">
                  {projectMedia.length > 0 ? projectMedia.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => setEditing({...editing, coverMediaId: m.id})}
                      className={`aspect-square cursor-pointer border-2 transition-all overflow-hidden ${editing.coverMediaId === m.id ? 'border-accent ring-2 ring-accent/20 scale-95' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                      <img src={m.url} className="w-full h-full object-cover" alt="" />
                    </div>
                  )) : (
                    <div className="col-span-4 py-8 text-center text-[10px] uppercase text-muted italic border border-dashed border-border/50">Încarcă imagini în galeria proiectului întâi</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-accent/5 p-6 border border-accent/20">
                 <input type="checkbox" id="published" className="w-4 h-4 accent-accent" checked={editing.isPublished} onChange={e => setEditing({...editing, isPublished: e.target.checked})} />
                 <label htmlFor="published" className="text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer text-accent">Afișează public în Portofoliu</label>
              </div>

              <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-border">
                <button onClick={() => setEditing(null)} className="px-8 py-3 text-[10px] uppercase font-bold tracking-widest border border-border hover:bg-surface-2 transition-all">Închide</button>
                <button onClick={handleSave} className="bg-accent text-white px-12 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 shadow-2xl shadow-accent/20 transition-all">Salvează Proiectul</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
