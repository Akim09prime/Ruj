
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Project, Media, ProjectStage } from '../../types';
import { Link } from 'react-router-dom';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMedia, setProjectMedia] = useState<Media[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'process' | 'tech' | 'media'>('basic');

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
    setActiveTab('basic');
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

  // --- HELPER UPDATERS ---
  const updateMetric = (key: keyof Project['metrics'], val: any) => {
    if (!editing) return;
    setEditing({
      ...editing,
      metrics: {
        duration: '', finish: '', materials: '', hardware: '', services: [],
        ...(editing.metrics || {}),
        [key]: val
      }
    });
  };

  const addStage = () => {
    if (!editing) return;
    const newStage: ProjectStage = { title: { ro: 'Etape Nouă', en: 'New Stage' }, description: { ro: '', en: '' }, highlights: [], images: [] };
    setEditing({ ...editing, stages: [...(editing.stages || []), newStage] });
  };

  const updateStage = (idx: number, field: string, val: any) => {
    if (!editing || !editing.stages) return;
    const stages = [...editing.stages];
    if (field === 'highlights') {
      stages[idx].highlights = typeof val === 'string' ? val.split(',').map(s => s.trim()) : val;
    } else if (field === 'images') {
      stages[idx].images = typeof val === 'string' ? [val] : val;
    } else if (field.includes('.')) {
      const [key, lang] = field.split('.');
      // @ts-ignore
      stages[idx][key][lang] = val;
    } else {
      // @ts-ignore
      stages[idx][field] = val;
    }
    setEditing({ ...editing, stages });
  };

  const removeStage = (idx: number) => {
    if (!editing || !editing.stages) return;
    const stages = [...editing.stages];
    stages.splice(idx, 1);
    setEditing({ ...editing, stages });
  };

  const addTechSpec = () => {
    if (!editing) return;
    setEditing({ ...editing, techSpecs: [...(editing.techSpecs || []), { label: '', value: '' }] });
  };

  const updateTechSpec = (idx: number, field: 'label' | 'value', val: string) => {
    if (!editing || !editing.techSpecs) return;
    const specs = [...editing.techSpecs];
    specs[idx][field] = val;
    setEditing({ ...editing, techSpecs: specs });
  };

  const removeTechSpec = (idx: number) => {
    if (!editing || !editing.techSpecs) return;
    const specs = [...editing.techSpecs];
    specs.splice(idx, 1);
    setEditing({ ...editing, techSpecs: specs });
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl mb-2">Gestiune Proiecte</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Catalogul de Referințe CARVELLO</p>
        </div>
        <button 
          onClick={() => setEditing({ 
            id: Math.random().toString(36).substr(2, 9), 
            title: { ro: '', en: '' }, 
            summary: { ro: '', en: '' }, 
            location: { ro: '', en: '' }, 
            publishedAt: new Date().toISOString(), 
            timelineDate: new Date().toISOString().split('T')[0],
            isPublished: true, 
            createdAt: new Date().toISOString(), 
            projectType: 'Rezidențial', 
            coverMediaId: null,
            stages: [],
            techSpecs: [],
            metrics: { duration: '', finish: '', materials: '', hardware: '', services: [] }
          })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all"
        >
          Proiect Nou
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-surface p-8 border border-border flex flex-col md:flex-row justify-between items-center shadow-sm hover:border-accent/40 transition-all group">
            <div className="flex items-center space-x-6 w-full md:w-auto mb-6 md:mb-0">
              <div className="w-16 h-16 bg-surface-2 border border-border flex items-center justify-center font-bold text-lg text-muted">
                {new Date(p.timelineDate || p.publishedAt).getFullYear()}
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
            <h2 className="font-serif text-3xl mb-4">Ești sigur?</h2>
            <p className="text-muted text-sm mb-10 leading-relaxed uppercase tracking-widest font-bold">Această acțiune este ireversibilă.</p>
            <div className="flex flex-col space-y-4">
              <button onClick={executeDelete} className="w-full py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all">Confirmă</button>
              <button onClick={() => setConfirmDelete(null)} className="w-full py-4 border border-border text-muted font-bold uppercase tracking-widest text-[10px] hover:bg-surface-2 transition-all">Anulează</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <div className="bg-background w-full max-w-5xl p-10 border border-border shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
               <h2 className="font-serif text-3xl">Editor Proiect</h2>
               <button onClick={() => setEditing(null)} className="text-3xl font-light hover:text-accent transition-colors">×</button>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {['basic', 'story', 'process', 'tech', 'media'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-accent text-white' : 'bg-surface-2 hover:bg-surface text-muted'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="space-y-8">
              
              {/* BASIC TAB */}
              {activeTab === 'basic' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Titlu (RO)</label>
                      <input className="w-full bg-surface-2 border border-border p-4 text-sm" value={editing.title?.ro} onChange={e => setEditing({...editing, title: {...editing.title!, ro: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Titlu (EN)</label>
                      <input className="w-full bg-surface-2 border border-border p-4 text-sm" value={editing.title?.en} onChange={e => setEditing({...editing, title: {...editing.title!, en: e.target.value}})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Slug (URL)</label>
                       <input className="w-full bg-surface-2 border border-border p-4 text-sm" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Data Timeline (YYYY-MM-DD)</label>
                       <input type="date" className="w-full bg-surface-2 border border-border p-4 text-sm" value={editing.timelineDate || ''} onChange={e => setEditing({...editing, timelineDate: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Tip Proiect</label>
                    <select className="w-full bg-surface-2 border border-border p-4 text-sm" value={editing.projectType} onChange={e => setEditing({...editing, projectType: e.target.value})}>
                      <option value="Rezidențial">Rezidențial</option>
                      <option value="HoReCa">HoReCa</option>
                      <option value="Office">Office</option>
                      <option value="Comercial">Comercial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Summary (Pt. Card)</label>
                    <textarea className="w-full bg-surface-2 border border-border p-4 text-sm h-24" value={editing.summary?.ro} onChange={e => setEditing({...editing, summary: { ...editing.summary!, ro: e.target.value }})} />
                  </div>
                </div>
              )}

              {/* STORY TAB */}
              {activeTab === 'story' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-accent">Provocarea (Brief Client)</label>
                    <textarea className="bg-surface-2 border border-border p-4 w-full h-32 text-sm" value={editing.clientBrief?.ro || ''} onChange={e => setEditing({...editing, clientBrief: {...(editing.clientBrief || {ro:'',en:''}), ro: e.target.value}})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-accent">Soluția Noastră</label>
                    <textarea className="bg-surface-2 border border-border p-4 w-full h-32 text-sm" value={editing.ourSolution?.ro || ''} onChange={e => setEditing({...editing, ourSolution: {...(editing.ourSolution || {ro:'',en:''}), ro: e.target.value}})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-accent">Rezultatul</label>
                    <textarea className="bg-surface-2 border border-border p-4 w-full h-32 text-sm" value={editing.result?.ro || ''} onChange={e => setEditing({...editing, result: {...(editing.result || {ro:'',en:''}), ro: e.target.value}})} />
                  </div>
                </div>
              )}

              {/* PROCESS TAB */}
              {activeTab === 'process' && (
                <div className="space-y-6 animate-fade-in">
                   {(editing.stages || []).map((step, idx) => (
                     <div key={idx} className="border border-border p-6 bg-surface-2 relative">
                        <button className="absolute top-2 right-2 text-red-500 text-[10px] font-bold uppercase border border-red-500/20 px-3 py-1 hover:bg-red-500 hover:text-white" onClick={() => removeStage(idx)}>Șterge Etapa</button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                             <label className="text-[9px] uppercase font-bold text-muted block mb-1">Titlu (RO)</label>
                             <input className="w-full bg-white border border-border p-2 text-sm font-bold" value={step.title.ro} onChange={e => updateStage(idx, 'title.ro', e.target.value)} />
                           </div>
                           <div>
                             <label className="text-[9px] uppercase font-bold text-muted block mb-1">Descriere (RO)</label>
                             <input className="w-full bg-white border border-border p-2 text-sm" value={step.description.ro} onChange={e => updateStage(idx, 'description.ro', e.target.value)} />
                           </div>
                        </div>
                        <div className="mb-4">
                           <label className="text-[9px] uppercase font-bold text-muted block mb-1">Highlights (virgulă)</label>
                           <input className="w-full bg-white border border-border p-2 text-sm" value={step.highlights.join(', ')} onChange={e => updateStage(idx, 'highlights', e.target.value)} />
                        </div>
                        <div>
                           <label className="text-[9px] uppercase font-bold text-muted block mb-1">Imagine URL (doar 1)</label>
                           <input className="w-full bg-white border border-border p-2 text-sm" value={step.images[0] || ''} onChange={e => updateStage(idx, 'images', e.target.value)} />
                        </div>
                     </div>
                   ))}
                   <button onClick={addStage} className="w-full py-4 border border-dashed border-accent text-accent text-xs font-bold uppercase hover:bg-accent hover:text-white transition-all">+ Adaugă Etapă Proces</button>
                </div>
              )}

              {/* TECH SPECS TAB */}
              {activeTab === 'tech' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-surface-2 p-6 border border-border">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted">Tabel Specificații</h3>
                    {editing.techSpecs?.map((spec, i) => (
                      <div key={i} className="flex gap-4 mb-2">
                        <input className="w-1/3 bg-white border border-border p-2 text-sm" placeholder="Label (ex: Blat)" value={spec.label} onChange={e => updateTechSpec(i, 'label', e.target.value)} />
                        <input className="w-2/3 bg-white border border-border p-2 text-sm" placeholder="Valoare" value={spec.value} onChange={e => updateTechSpec(i, 'value', e.target.value)} />
                        <button className="text-red-500 px-2" onClick={() => removeTechSpec(i)}>×</button>
                      </div>
                    ))}
                    <button onClick={addTechSpec} className="mt-4 text-[10px] font-bold uppercase text-accent hover:underline">+ Adaugă Rând</button>
                  </div>

                  <div className="bg-surface-2 p-6 border border-border">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted">Metrici Rapide</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <input className="bg-white p-2 border border-border text-sm" placeholder="Durată" value={editing.metrics?.duration} onChange={e => updateMetric('duration', e.target.value)} />
                       <input className="bg-white p-2 border border-border text-sm" placeholder="Finisaj" value={editing.metrics?.finish} onChange={e => updateMetric('finish', e.target.value)} />
                       <input className="bg-white p-2 border border-border text-sm" placeholder="Materiale" value={editing.metrics?.materials} onChange={e => updateMetric('materials', e.target.value)} />
                       <input className="bg-white p-2 border border-border text-sm" placeholder="Feronerie" value={editing.metrics?.hardware} onChange={e => updateMetric('hardware', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA TAB (Cover Only) */}
              {activeTab === 'media' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-muted mb-4">Selectează imaginea de copertă (Hero).</p>
                  <div className="grid grid-cols-4 gap-4 border border-border p-4 bg-surface-2 max-h-[400px] overflow-y-auto">
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
              )}

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
