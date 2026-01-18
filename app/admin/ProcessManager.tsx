
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { ProcessStep, Media } from '../../types';

export const ProcessManager: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [editing, setEditing] = useState<ProcessStep | null>(null);

  const load = async () => {
    setSteps(await dbService.getProcessSteps());
    setMedia(await dbService.getMedia());
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    await dbService.upsertProcessStep(editing);
    setEditing(null);
    load();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    
    // Swap orders
    const tempOrder = newSteps[index].order;
    newSteps[index].order = newSteps[targetIndex].order;
    newSteps[targetIndex].order = tempOrder;
    
    await dbService.upsertProcessStep(newSteps[index]);
    await dbService.upsertProcessStep(newSteps[targetIndex]);
    load();
  };

  const addArrayItem = () => {
    if (!editing) return;
    setEditing({ ...editing, bullets: [...editing.bullets, { ro: '', en: '' }] });
  };

  const updateBullet = (idx: number, lang: 'ro'|'en', val: string) => {
    if (!editing) return;
    const bullets = [...editing.bullets];
    bullets[idx][lang] = val;
    setEditing({ ...editing, bullets });
  };

  return (
    <div className="p-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="font-serif text-4xl mb-2">Workflow Manager</h1>
           <p className="text-muted text-xs uppercase tracking-widest font-bold">Editează pașii din pagina Proces</p>
        </div>
        <button 
           onClick={() => setEditing({
              id: Math.random().toString(36).substr(2,9),
              order: steps.length,
              isVisible: true,
              title: { ro: 'Pas Nou', en: 'New Step' },
              description: { ro: '', en: '' },
              bullets: [],
              mediaId: null,
              cta: { label: { ro: 'Vezi detalii', en: 'View details' }, href: '/contact' }
           })}
           className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
        >
          Adaugă Pas
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="bg-surface border border-border p-6 flex justify-between items-center group hover:border-accent transition-colors">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-surface-2 border border-border flex items-center justify-center font-bold text-lg font-serif">
                   {step.order}
                </div>
                <div>
                   <h3 className="font-bold text-lg">{step.title.ro}</h3>
                   <p className="text-xs text-muted truncate max-w-md">{step.description.ro}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => handleMove(idx, 'up')} disabled={idx===0} className="px-3 py-1 border border-border text-xs disabled:opacity-30">↑</button>
                <button onClick={() => handleMove(idx, 'down')} disabled={idx===steps.length-1} className="px-3 py-1 border border-border text-xs disabled:opacity-30">↓</button>
                <button onClick={() => setEditing(step)} className="bg-foreground text-background px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-accent transition-colors">Editează</button>
             </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center p-6 overflow-y-auto">
           <div className="bg-background w-full max-w-3xl p-10 border border-border shadow-2xl h-fit mb-20 animate-slide-up">
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                 <h2 className="font-serif text-3xl">Editare Pas {editing.order}</h2>
                 <div className="flex gap-4">
                    <button onClick={() => setEditing(null)} className="px-6 py-2 border border-border text-xs uppercase font-bold">Anulează</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-accent text-white text-xs uppercase font-bold">Salvează</button>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <input type="checkbox" checked={editing.isVisible} onChange={e => setEditing({...editing, isVisible: e.target.checked})} className="w-5 h-5 accent-accent"/>
                    <label className="text-xs uppercase font-bold">Vizibil pe site</label>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-muted">Titlu (RO)</label>
                       <input className="w-full bg-surface-2 border border-border p-3 text-xs font-bold" value={editing.title.ro} onChange={e => setEditing({...editing, title: {...editing.title, ro: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-muted">Titlu (EN)</label>
                       <input className="w-full bg-surface-2 border border-border p-3 text-xs" value={editing.title.en} onChange={e => setEditing({...editing, title: {...editing.title, en: e.target.value}})} />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted">Descriere (RO)</label>
                    <textarea className="w-full bg-surface-2 border border-border p-3 text-xs h-20" value={editing.description.ro} onChange={e => setEditing({...editing, description: {...editing.description, ro: e.target.value}})} />
                 </div>

                 <div>
                    <label className="text-[10px] uppercase font-bold text-accent border-b border-border pb-1 block mb-4">Bullets (Listă punctată)</label>
                    {editing.bullets.map((b, i) => (
                       <div key={i} className="flex gap-2 mb-2">
                          <input className="w-1/2 bg-surface-2 border border-border p-2 text-xs" value={b.ro} onChange={e => updateBullet(i, 'ro', e.target.value)} placeholder="RO" />
                          <input className="w-1/2 bg-surface-2 border border-border p-2 text-xs" value={b.en} onChange={e => updateBullet(i, 'en', e.target.value)} placeholder="EN" />
                          <button onClick={() => { const b = [...editing.bullets]; b.splice(i,1); setEditing({...editing, bullets: b}); }} className="text-red-500 font-bold px-2">×</button>
                       </div>
                    ))}
                    <button onClick={addArrayItem} className="text-[9px] uppercase font-bold text-muted mt-2">+ Adaugă Punct</button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted">Imagine (Media ID)</label>
                    <select className="w-full bg-surface-2 border border-border p-3 text-xs" value={editing.mediaId || ''} onChange={e => setEditing({...editing, mediaId: e.target.value})}>
                       <option value="">Select Media...</option>
                       {media.filter(m => m.kind === 'image').map(m => <option key={m.id} value={m.id}>Image: {m.id}</option>)}
                    </select>
                    {editing.mediaId && <img src={media.find(m => m.id === editing.mediaId)?.url} className="h-20 object-cover border border-border mt-2" />}
                 </div>

                 <div className="grid grid-cols-2 gap-6 bg-surface-2 p-4 border border-border">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-muted">CTA Label (RO)</label>
                       <input className="w-full bg-background border border-border p-2 text-xs" value={editing.cta.label.ro} onChange={e => setEditing({...editing, cta: {...editing.cta, label: {...editing.cta.label, ro: e.target.value}}})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-muted">CTA Link</label>
                       <input className="w-full bg-background border border-border p-2 text-xs" value={editing.cta.href} onChange={e => setEditing({...editing, cta: {...editing.cta, href: e.target.value}})} />
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
};
