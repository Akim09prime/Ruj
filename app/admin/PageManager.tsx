
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Page, SectionBlock } from '../../types';

export const PageManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Partial<Page> | null>(null);

  const load = () => dbService.getPages().then(setPages);
  useEffect(() => { load(); }, []);

  const handleSavePage = async () => {
    if (!editing?.slug) { alert('Slug-ul este obligatoriu!'); return; }
    const fullPage = {
      ...editing,
      id: editing.id || Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
      sections: editing.sections || [],
      order: editing.order || 0
    } as Page;
    await dbService.upsertPage(fullPage);
    setEditing(null);
    load();
  };

  const addSection = (type: any) => {
    const newSection: SectionBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      order: (editing?.sections?.length || 0),
      content: type === 'text' 
        ? { text: { ro: '', en: '' } } 
        : type === 'cta' 
          ? { title: { ro: '', en: '' }, buttonLabel: { ro: '', en: '' }, link: '' }
          : { title: { ro: '', en: '' }, body: { ro: '', en: '' }, imageUrl: '', reverse: false }
    };
    setEditing({ ...editing, sections: [...(editing?.sections || []), newSection] });
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-3xl text-foreground">Pagini Dinamice (CMS)</h1>
        <button 
          onClick={() => setEditing({ 
            slug: '', 
            hero: { title: { ro: '', en: '' }, subtitle: { ro: '', en: '' }, darkImageUrl: '', lightImageUrl: '', overlayStrength: 0.5 },
            sections: [],
            isPublished: true,
            template: 'standard',
            seo: { title: { ro: '', en: '' }, description: { ro: '', en: '' } }
          })}
          className="bg-accent text-white px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-accent/20"
        >
          Pagină Nouă
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map(p => (
          <div key={p.id} className="bg-surface border border-border p-6 shadow-sm hover:border-accent transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-xl mb-1">/p/{p.slug}</h3>
                <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${p.isPublished ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                  {p.isPublished ? 'Publicat' : 'Draft'}
                </span>
              </div>
              <span className="text-[10px] text-muted font-mono">ID: {p.id.substr(0, 4)}</span>
            </div>
            <p className="text-xs text-muted mb-6 line-clamp-2">{p.hero.title.ro}</p>
            <div className="flex justify-between border-t border-border pt-4">
               <button onClick={() => setEditing(p)} className="text-[10px] font-bold uppercase text-accent hover:underline">Editează</button>
               <button onClick={async () => { if(confirm('Ștergi pagina?')) { await dbService.deletePage(p.id); load(); } }} className="text-[10px] font-bold uppercase text-red-500/50 hover:text-red-500">Elimină</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-6xl p-10 border border-border shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-border">
              <h2 className="font-serif text-3xl">Configurare Pagină: <span className="text-accent">/p/{editing.slug || '...'}</span></h2>
              <button onClick={() => setEditing(null)} className="text-3xl font-light">×</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-8">
                <section className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent">Setări URL & SEO</h4>
                  <input className="w-full bg-surface border border-border p-3 text-sm" placeholder="URL Slug (ex: servicii-cnc)" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
                  <input className="w-full bg-surface border border-border p-3 text-sm" placeholder="Meta Titlu RO" value={editing.seo?.title.ro} onChange={e => setEditing({...editing, seo: {...editing.seo!, title: {...editing.seo!.title, ro: e.target.value}}})} />
                  <textarea className="w-full bg-surface border border-border p-3 text-sm h-20" placeholder="Meta Descriere RO" value={editing.seo?.description.ro} onChange={e => setEditing({...editing, seo: {...editing.seo!, description: {...editing.seo!.description, ro: e.target.value}}})} />
                </section>
                
                <section className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent">Hero Branding</h4>
                  <input className="w-full bg-surface border border-border p-3 text-sm" placeholder="Imagine Hero URL" value={editing.hero?.darkImageUrl} onChange={e => setEditing({...editing, hero: {...editing.hero!, darkImageUrl: e.target.value}})} />
                  <input className="w-full bg-surface border border-border p-3 text-sm" placeholder="Titlu Hero RO" value={editing.hero?.title.ro} onChange={e => setEditing({...editing, hero: {...editing.hero!, title: {...editing.hero!.title, ro: e.target.value}}})} />
                  <div className="flex items-center space-x-4 p-3 bg-surface border border-border">
                    <input type="checkbox" checked={editing.isPublished} id="pub" onChange={e => setEditing({...editing, isPublished: e.target.checked})} />
                    <label htmlFor="pub" className="text-[10px] uppercase font-bold cursor-pointer">Publicat pe site</label>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent">Arhitectură Secțiuni ({editing.sections?.length || 0})</h4>
                  <div className="flex space-x-2">
                    <button onClick={() => addSection('text')} className="bg-surface-2 border border-border px-3 py-1 text-[9px] font-bold uppercase hover:bg-border">+ Text</button>
                    <button onClick={() => addSection('imageText')} className="bg-surface-2 border border-border px-3 py-1 text-[9px] font-bold uppercase hover:bg-border">+ Media</button>
                    <button onClick={() => addSection('cta')} className="bg-surface-2 border border-border px-3 py-1 text-[9px] font-bold uppercase hover:bg-border">+ Buton CTA</button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 border border-border bg-surface-2/30 rounded">
                  {editing.sections?.map((s, idx) => (
                    <div key={s.id} className="bg-surface border border-border p-4 shadow-sm relative">
                       <div className="flex justify-between mb-2">
                         <span className="text-[9px] font-bold uppercase text-accent">Secțiunea {idx + 1} — {s.type}</span>
                         <button onClick={() => setEditing({...editing, sections: editing.sections?.filter(sec => sec.id !== s.id)})} className="text-red-500 text-[10px]">Elimină</button>
                       </div>
                       {s.type === 'text' && (
                         <textarea className="w-full bg-surface-2 border border-border p-2 text-sm" value={s.content.text.ro} onChange={e => {
                           const updated = [...(editing.sections || [])];
                           updated[idx].content.text.ro = e.target.value;
                           setEditing({...editing, sections: updated});
                         }} />
                       )}
                       {s.type === 'cta' && (
                         <div className="grid grid-cols-2 gap-4">
                            <input className="bg-surface-2 border border-border p-2 text-xs" placeholder="Text Buton" value={s.content.buttonLabel.ro} onChange={e => {
                               const updated = [...(editing.sections || [])];
                               updated[idx].content.buttonLabel.ro = e.target.value;
                               setEditing({...editing, sections: updated});
                            }} />
                            <input className="bg-surface-2 border border-border p-2 text-xs" placeholder="Link (ex: /contact)" value={s.content.link} onChange={e => {
                               const updated = [...(editing.sections || [])];
                               updated[idx].content.link = e.target.value;
                               setEditing({...editing, sections: updated});
                            }} />
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-border mt-10">
              <button onClick={() => setEditing(null)} className="px-10 py-3 text-[10px] font-bold uppercase tracking-widest border border-border">Închide</button>
              <button onClick={handleSavePage} className="bg-accent text-white px-16 py-3 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20">Salvează Pagina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
