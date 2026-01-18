
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Project, Media, ProjectStage } from '../../types';
import { Link } from 'react-router-dom';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allMedia, setAllMedia] = useState<Media[]>([]); 
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'hero' | 'story' | 'stages' | 'tech'>('basic');
  const [mediaPickerOpen, setMediaPickerOpen] = useState<{ field: string, multiple: boolean, context?: any } | null>(null);

  const loadData = async () => {
    setProjects(await dbService.getProjects());
    setAllMedia(await dbService.getMedia());
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!editing?.id) return;
    const fullProject = { ...editing, updatedAt: new Date().toISOString() } as Project;
    await dbService.upsertProject(fullProject);
    setEditing(null);
    loadData();
  };

  // calculate completeness
  const getScore = (p: Partial<Project>) => {
    let score = 0;
    if (p.coverMediaId) score += 10;
    if (p.heroConfig?.imageId || p.heroConfig?.videoId) score += 10;
    if (p.stages && p.stages.length >= 3) score += 20;
    if (p.techSpecs && p.techSpecs.length >= 4) score += 10;
    if (p.clientBrief?.ro && p.ourSolution?.ro && p.result?.ro) score += 20;
    if (p.tags && p.tags.length > 0) score += 10;
    return Math.min(score + 20, 100); // base 20
  };

  // --- MEDIA PICKER ---
  const openMediaPicker = (field: string, multiple: boolean, context?: any) => {
    setMediaPickerOpen({ field, multiple, context });
  };

  const handleMediaSelect = (mediaId: string) => {
    if (!mediaPickerOpen || !editing) return;
    const { field, multiple, context } = mediaPickerOpen;

    if (field.startsWith('stage.')) {
        const stageIdx = context.index;
        const subField = field.split('.')[1];
        const newStages = [...(editing.stages || [])];
        if (!newStages[stageIdx].media) newStages[stageIdx].media = { galleryIds: [] };

        if (multiple && subField === 'galleryIds') {
            const current = newStages[stageIdx].media.galleryIds;
            if (!current.includes(mediaId)) newStages[stageIdx].media.galleryIds.push(mediaId);
        } else {
            // @ts-ignore
            newStages[stageIdx].media[subField] = mediaId;
        }
        setEditing({ ...editing, stages: newStages });
    } else if (field.startsWith('hero.')) {
        const subField = field.split('.')[1];
        setEditing({
            ...editing,
            heroConfig: { ...editing.heroConfig!, [subField]: mediaId }
        });
    } else {
        // @ts-ignore
        setEditing({ ...editing, [field]: mediaId });
    }
    if (!multiple) setMediaPickerOpen(null);
  };

  // --- STAGE HELPERS ---
  const updateStage = (idx: number, field: string, val: any) => {
    if (!editing || !editing.stages) return;
    const stages = [...editing.stages];
    if (field.includes('.')) {
      const [key, sub] = field.split('.');
      // @ts-ignore
      stages[idx][key][sub] = val;
    } else {
      // @ts-ignore
      stages[idx][field] = val;
    }
    setEditing({ ...editing, stages });
  };

  const addStage = () => {
    const newStage: ProjectStage = {
        id: Math.random().toString(36).substr(2, 5),
        title: { ro: 'Etapă Nouă', en: 'New Stage' },
        description: { ro: '', en: '' },
        highlights: [],
        media: { galleryIds: [] }
    };
    setEditing({ ...editing, stages: [...(editing?.stages || []), newStage] });
  };

  const moveStage = (idx: number, direction: 'up' | 'down') => {
    if (!editing?.stages) return;
    const newStages = [...editing.stages];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < newStages.length) {
        [newStages[idx], newStages[targetIdx]] = [newStages[targetIdx], newStages[idx]];
        setEditing({ ...editing, stages: newStages });
    }
  };

  // --- TECH SPEC HELPERS ---
  const updateSpec = (idx: number, key: 'label' | 'value', val: string) => {
    const newSpecs = [...(editing?.techSpecs || [])];
    newSpecs[idx][key] = val;
    setEditing({...editing, techSpecs: newSpecs});
  };
  const addSpec = () => setEditing({...editing, techSpecs: [...(editing?.techSpecs || []), {label: '', value: ''}]});
  const removeSpec = (idx: number) => {
    const newSpecs = [...(editing?.techSpecs || [])];
    newSpecs.splice(idx, 1);
    setEditing({...editing, techSpecs: newSpecs});
  };

  return (
    <div className="p-8 animate-fade-in relative">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl mb-2">Editor Proiecte</h1>
        <button 
          onClick={() => setEditing({ 
            id: Math.random().toString(36).substr(2, 9), 
            title: { ro: '', en: '' }, summary: { ro: '', en: '' }, location: { ro: '', en: '' }, 
            publishedAt: new Date().toISOString(), timelineDate: new Date().toISOString().split('T')[0],
            isPublished: true, createdAt: new Date().toISOString(), projectType: 'Rezidențial', 
            coverMediaId: null, stages: [], techSpecs: [], tags: [],
            heroConfig: { mode: 'image', overlay: { intensity: 40, vignette: true, grain: false } }
          })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
        >
          Proiect Nou
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {projects.map(p => {
          const score = getScore(p);
          return (
          <div key={p.id} className="bg-surface p-6 border border-border flex justify-between items-center group hover:border-accent">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-2 overflow-hidden border border-border">
                    {p.coverMediaId && <img src={allMedia.find(m => m.id === p.coverMediaId)?.url} className="w-full h-full object-cover"/>}
                </div>
                <div>
                    <h3 className="font-serif text-xl">{p.title.ro}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] uppercase text-muted">{p.projectType}</span>
                        {p.isFeatured && <span className="text-[8px] bg-accent text-white px-2 py-0.5 uppercase font-bold">Featured</span>}
                        {p.timelineDate && <span className="text-[8px] border border-border px-2 py-0.5 font-mono">{p.timelineDate}</span>}
                    </div>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="text-right">
                    <span className="block text-[9px] font-bold uppercase text-muted">Completeness</span>
                    <div className="w-24 h-1 bg-surface-2 mt-1">
                        <div className={`h-full ${score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                    </div>
                </div>
                <button onClick={() => setEditing(p)} className="px-6 py-2 border border-border hover:bg-accent hover:text-white transition-colors text-xs uppercase font-bold">Editează</button>
             </div>
          </div>
        )})}
      </div>

      {/* EDITOR MODAL */}
      {editing && (
        <div className="fixed inset-0 z-40 bg-black/95 flex justify-center p-6 overflow-hidden">
           <div className="bg-background w-full max-w-6xl h-full flex flex-col border border-border shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface">
                 <h2 className="font-serif text-2xl">Editare: {editing.title?.ro || 'Proiect Nou'}</h2>
                 <div className="flex gap-2">
                    <button onClick={() => setEditing(null)} className="px-6 py-2 border border-border hover:bg-surface-2 text-xs uppercase font-bold">Anulează</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-accent text-white font-bold text-xs uppercase">Salvează</button>
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border bg-surface-2">
                 {['basic', 'hero', 'story', 'stages', 'tech'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-4 text-xs uppercase font-bold tracking-widest ${activeTab === t ? 'bg-background border-t-2 border-accent' : 'text-muted hover:text-foreground'}`}>{t}</button>
                 ))}
              </div>

              {/* Content Area */}
              <div className="flex-grow overflow-y-auto p-8 bg-background">
                 
                 {/* BASIC */}
                 {activeTab === 'basic' && (
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-xs font-bold uppercase">Titlu (RO)</label>
                          <input className="w-full bg-surface-2 border border-border p-3" value={editing.title?.ro} onChange={e => setEditing({...editing, title: {...editing.title!, ro: e.target.value}})} />
                          <label className="text-xs font-bold uppercase">Tags (virgulă)</label>
                          <input className="w-full bg-surface-2 border border-border p-3" value={editing.tags?.join(', ')} onChange={e => setEditing({...editing, tags: e.target.value.split(',').map(s=>s.trim())})} />
                          <div className="flex items-center gap-2 mt-2">
                             <input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} />
                             <span className="text-xs uppercase font-bold">Featured Project</span>
                          </div>
                          <label className="text-xs font-bold uppercase mt-4 block">Cover Image</label>
                          <div className="w-32 h-20 bg-surface-2 border border-border cursor-pointer hover:border-accent" onClick={() => openMediaPicker('coverMediaId', false)}>
                                {editing.coverMediaId ? <img src={allMedia.find(m => m.id === editing.coverMediaId)?.url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs text-muted">+ Select</div>}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-xs font-bold uppercase">Summary</label>
                          <textarea className="w-full bg-surface-2 border border-border p-3 h-32" value={editing.summary?.ro} onChange={e => setEditing({...editing, summary: {...editing.summary!, ro: e.target.value}})} />
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-bold uppercase">Tip</label>
                                <select className="w-full bg-surface-2 border border-border p-3 text-xs" value={editing.projectType} onChange={e => setEditing({...editing, projectType: e.target.value})}>
                                   {['Rezidențial', 'Comercial', 'Hotel', 'Restaurant', 'Office'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                             </div>
                             
                             {/* TIMELINE DATE - PROMINENT */}
                             <div className="bg-accent/5 border border-accent/20 p-2">
                                <label className="text-xs font-bold uppercase text-accent block mb-1">Data Timeline (Afisare)</label>
                                <input type="date" className="w-full bg-surface-2 border border-border p-2 text-sm font-bold" value={editing.timelineDate || editing.publishedAt?.split('T')[0]} onChange={e => setEditing({...editing, timelineDate: e.target.value})} />
                                <span className="text-[9px] text-muted italic">Determină ordinea în Portofoliu.</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* HERO */}
                 {activeTab === 'hero' && (
                    <div className="space-y-8 max-w-3xl">
                       <div className="flex items-center gap-8 p-4 border border-border bg-surface-2">
                          <label className="flex items-center gap-2"><input type="radio" checked={editing.heroConfig?.mode === 'image'} onChange={() => setEditing({...editing, heroConfig: {...editing.heroConfig!, mode: 'image'}})} /> <span className="text-xs font-bold uppercase">Image</span></label>
                          <label className="flex items-center gap-2"><input type="radio" checked={editing.heroConfig?.mode === 'video'} onChange={() => setEditing({...editing, heroConfig: {...editing.heroConfig!, mode: 'video'}})} /> <span className="text-xs font-bold uppercase">Video</span></label>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="text-xs font-bold uppercase block mb-2">Media</label>
                             {editing.heroConfig?.mode === 'image' ? (
                                <div className="border border-border p-4 text-center cursor-pointer hover:bg-surface-2 h-40 flex items-center justify-center" onClick={() => openMediaPicker('hero.imageId', false)}>
                                   {editing.heroConfig.imageId ? <img src={allMedia.find(m => m.id === editing.heroConfig?.imageId)?.url} className="h-full w-full object-cover"/> : <span className="text-accent">+ Select Image</span>}
                                </div>
                             ) : (
                                <div className="space-y-4">
                                   <button onClick={() => openMediaPicker('hero.videoId', false)} className="w-full p-3 border border-border text-xs text-left">Video: {editing.heroConfig?.videoId || 'Select...'}</button>
                                   <button onClick={() => openMediaPicker('hero.posterId', false)} className="w-full p-3 border border-border text-xs text-left">Poster: {editing.heroConfig?.posterId || 'Select...'}</button>
                                </div>
                             )}
                          </div>
                          <div className="space-y-4">
                             <label className="text-xs font-bold uppercase block">Overlay</label>
                             <input type="range" min="0" max="90" className="w-full" value={editing.heroConfig?.overlay.intensity} onChange={e => setEditing({...editing, heroConfig: {...editing.heroConfig!, overlay: {...editing.heroConfig!.overlay, intensity: parseInt(e.target.value)}}})} />
                             <span className="text-xs">Opacity: {editing.heroConfig?.overlay.intensity}%</span>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* STAGES */}
                 {activeTab === 'stages' && (
                    <div className="space-y-8">
                       {editing.stages?.map((stage, idx) => (
                          <div key={idx} className="border border-border p-6 bg-surface-2 relative group">
                             <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => moveStage(idx, 'up')} className="text-xs px-2 border border-border">↑</button>
                                <button onClick={() => moveStage(idx, 'down')} className="text-xs px-2 border border-border">↓</button>
                                <button onClick={() => { const s = [...editing.stages!]; s.splice(idx,1); setEditing({...editing, stages: s}); }} className="text-red-500 text-xs px-2 border border-red-500">DEL</button>
                             </div>
                             <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-2 flex flex-col items-center">
                                   <div className="w-full aspect-video border border-border bg-background mb-2 cursor-pointer hover:border-accent" onClick={() => openMediaPicker(`stage.coverId`, false, { index: idx })}>
                                      {stage.media.coverId ? <img src={allMedia.find(m => m.id === stage.media.coverId)?.url} className="w-full h-full object-cover"/> : <span className="text-[9px] flex h-full items-center justify-center text-center">Cover Media</span>}
                                   </div>
                                </div>
                                <div className="col-span-5 space-y-2">
                                   <input className="w-full bg-background border border-border p-2 text-xs font-bold" placeholder="Titlu" value={stage.title.ro} onChange={e => updateStage(idx, 'title.ro', e.target.value)} />
                                   <input className="w-full bg-background border border-border p-2 text-xs" placeholder="Date Label (ex: Week 1)" value={stage.dateLabel} onChange={e => updateStage(idx, 'dateLabel', e.target.value)} />
                                   <input className="w-full bg-background border border-border p-2 text-xs" placeholder="Highlights (comma)" value={stage.highlights.join(', ')} onChange={e => updateStage(idx, 'highlights', e.target.value.split(','))} />
                                </div>
                                <div className="col-span-5">
                                   <textarea className="w-full bg-background border border-border p-2 text-xs h-full" placeholder="Descriere" value={stage.description.ro} onChange={e => updateStage(idx, 'description.ro', e.target.value)} />
                                </div>
                             </div>
                          </div>
                       ))}
                       <button onClick={addStage} className="w-full py-4 border-2 border-dashed border-border text-muted hover:border-accent hover:text-accent font-bold uppercase text-xs">+ Adaugă Etapă</button>
                    </div>
                 )}

                 {/* TECH */}
                 {activeTab === 'tech' && (
                    <div className="max-w-3xl space-y-4">
                       {editing.techSpecs?.map((spec, i) => (
                          <div key={i} className="flex gap-4">
                             <input className="w-1/3 bg-surface-2 border border-border p-3 text-xs" placeholder="Label (ex: Fronturi)" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} />
                             <input className="w-2/3 bg-surface-2 border border-border p-3 text-xs" placeholder="Valoare" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} />
                             <button onClick={() => removeSpec(i)} className="text-red-500 px-2">×</button>
                          </div>
                       ))}
                       <button onClick={addSpec} className="text-accent text-xs uppercase font-bold tracking-widest">+ Add Spec Row</button>
                    </div>
                 )}

                 {/* STORY */}
                 {activeTab === 'story' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-accent">1. Challenge</label>
                            <textarea className="w-full h-24 bg-surface-2 border border-border p-3 text-sm" value={editing.clientBrief?.ro} onChange={e => setEditing({...editing, clientBrief: {...editing.clientBrief!, ro: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-accent">2. Solution</label>
                            <textarea className="w-full h-24 bg-surface-2 border border-border p-3 text-sm" value={editing.ourSolution?.ro} onChange={e => setEditing({...editing, ourSolution: {...editing.ourSolution!, ro: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-accent">3. Result</label>
                            <textarea className="w-full h-24 bg-surface-2 border border-border p-3 text-sm" value={editing.result?.ro} onChange={e => setEditing({...editing, result: {...editing.result!, ro: e.target.value}})} />
                        </div>
                    </div>
                 )}

              </div>
           </div>

           {/* MEDIA PICKER OVERLAY */}
           {mediaPickerOpen && (
              <div className="absolute inset-0 z-50 bg-surface flex flex-col p-8 animate-fade-in">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-3xl">Alege Media</h3>
                    <button onClick={() => setMediaPickerOpen(null)} className="text-3xl">×</button>
                 </div>
                 <div className="grid grid-cols-6 gap-4 overflow-y-auto">
                    {allMedia.map(m => (
                       <div key={m.id} className="aspect-square bg-surface-2 border border-border hover:border-accent cursor-pointer relative group" onClick={() => handleMediaSelect(m.id)}>
                          <img src={m.url} className="w-full h-full object-cover" />
                          {m.kind === 'video' && <span className="absolute bottom-2 right-2 bg-black text-white text-[9px] px-1">VIDEO</span>}
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};
