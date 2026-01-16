
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Page, SectionBlock } from '../../types';

export const PageManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Partial<Page> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  const executeDelete = async () => {
    if (confirmDelete) {
      await dbService.deletePage(confirmDelete);
      setConfirmDelete(null);
      load();
    }
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
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-foreground">Pagini Dinamice (CMS)</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Arhitectură de conținut customizabilă</p>
        </div>
        <button 
          onClick={() => setEditing({ 
            slug: '', 
            hero: { title: { ro: '', en: '' }, subtitle: { ro: '', en: '' }, darkImageUrl: '', lightImageUrl: '', overlayStrength: 0.5 },
            sections: [],
            isPublished: true,
            template: 'standard',
            seo: { title: { ro: '', en: '' }, description: { ro: '', en: '' } }
          })}
          className="bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-105 transition-all"
        >
          Pagină Nouă
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map(p => (
          <div key={p.id} className="bg-surface border border-border p-8 shadow-sm hover:border-accent transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-2xl mb-2">/p/{p.slug}</h3>
                <span className={`text-[9px] px-3 py-1 rounded font-bold uppercase tracking-widest ${p.isPublished ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                  {p.isPublished ? 'Publicat' : 'Draft'}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted mb-8 line-clamp-2 italic">{p.hero.title.ro}</p>
            <div className="flex justify-between items-center border-t border-border pt-6">
               <button onClick={() => setEditing(p)} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Configurare</button>
               <button onClick={() => setConfirmDelete(p.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors">Elimină</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-background max-w-sm w-full p-12 border border-border shadow-2xl text-center">
            <h2 className="font-serif text-3xl mb-4">Elimină Pagina</h2>
            <p className="text-muted text-xs mb-10 leading-relaxed uppercase tracking-widest font-bold">Atenție: Pagina va fi ștearsă definitiv de pe serverul local și link-ul va deveni inactiv.</p>
            <div className="flex flex-col space-y-3">
              <button onClick={executeDelete} className="w-full py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-red-600 transition-all">Confirmă Ștergerea</button>
              <button onClick={() => setConfirmDelete(null)} className="w-full py-4 border border-border text-muted font-bold uppercase tracking-widest text-[9px] hover:bg-surface-2 transition-all">Anulează</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-6xl p-10 border border-border shadow-2xl max-h-[95vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
              <h2 className="font-serif text-3xl">Editor CMS: <span className="text-accent">/p/{editing.slug || 'pagina-noua'}</span></h2>
              <button onClick={() => setEditing(null)} className="text-3xl font-light hover:text-accent transition-colors">×</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-10">
                <section className="space-y-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-border pb-2">Configurație Tehnică & SEO</h4>
                  <div className="space-y-4">
                    <input className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="URL Slug (ex: servicii-cnc)" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
                    <input className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="SEO Titlu RO" value={editing.seo?.title.ro} onChange={e => setEditing({...editing, seo: {...editing.seo!, title: {...editing.seo!.title, ro: e.target.value}}})} />
                    <textarea className="w-full bg-surface-2 border border-border p-4 text-xs h-24 outline-none focus:border-accent resize-none" placeholder="SEO Descriere RO" value={editing.seo?.description.ro} onChange={e => setEditing({...editing, seo: {...editing.seo!, description: {...editing.seo!.description, ro: e.target.value}}})} />
                  </div>
                </section>
                
                <section className="space-y-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-border pb-2">Hero Section Visuals</h4>
                  <div className="space-y-4">
                    <input className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Imagine Hero URL" value={editing.hero?.darkImageUrl} onChange={e => setEditing({...editing, hero: {...editing.hero!, darkImageUrl: e.target.value}})} />
                    <input className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Titlu Principal RO" value={editing.hero?.title.ro} onChange={e => setEditing({...editing, hero: {...editing.hero!, title: {...editing.hero!.title, ro: e.target.value}}})} />
                    <div className="flex items-center space-x-4 p-4 bg-surface-2 border border-border mt-4">
                      <input type="checkbox" className="w-4 h-4 accent-accent" checked={editing.isPublished} id="pub" onChange={e => setEditing({...editing, isPublished: e.target.checked})} />
                      <label htmlFor="pub" className="text-[10px] uppercase font-bold tracking-widest cursor-pointer text-muted">Vizibil în site</label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-accent">Secțiuni Pagină ({editing.sections?.length || 0})</h4>
                  <div className="flex space-x-3">
                    <button onClick={() => addSection('text')} className="bg-surface-2 border border-border px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-all">+ Text</button>
                    <button onClick={() => addSection('imageText')} className="bg-surface-2 border border-border px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-all">+ Media</button>
                    <button onClick={() => addSection('cta')} className="bg-surface-2 border border-border px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-all">+ CTA</button>
                  </div>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto p-6 border border-border bg-surface-2/30">
                  {editing.sections?.map((s, idx) => (
                    <div key={s.id} className="bg-surface border border-border p-6 shadow-sm relative group">
                       <div className="flex justify-between items-center mb-4">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Secțiunea {idx + 1} — {s.type}</span>
                         <button onClick={() => setEditing({...editing, sections: editing.sections?.filter(sec => sec.id !== s.id)})} className="text-red-500 text-[10px] uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Sterge</button>
                       </div>
                       {s.type === 'text' && (
                         <textarea className="w-full bg-surface-2 border border-border p-4 text-sm outline-none focus:border-accent min-h-[150px] leading-relaxed" value={s.content.text.ro} onChange={e => {
                           const updated = [...(editing.sections || [])];
                           updated[idx].content.text.ro = e.target.value;
                           setEditing({...editing, sections: updated});
                         }} />
                       )}
                       {s.type === 'cta' && (
                         <div className="grid grid-cols-2 gap-6">
                            <input className="bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Text Buton (RO)" value={s.content.buttonLabel.ro} onChange={e => {
                               const updated = [...(editing.sections || [])];
                               updated[idx].content.buttonLabel.ro = e.target.value;
                               setEditing({...editing, sections: updated});
                            }} />
                            <input className="bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Destinație (ex: /contact)" value={s.content.link} onChange={e => {
                               const updated = [...(editing.sections || [])];
                               updated[idx].content.link = e.target.value;
                               setEditing({...editing, sections: updated});
                            }} />
                         </div>
                       )}
                    </div>
                  ))}
                  {editing.sections?.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-border/50">
                      <p className="font-serif text-2xl text-muted/30 italic">Pagină fără conținut. Adaugă prima secțiune.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-border mt-12">
              <button onClick={() => setEditing(null)} className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest border border-border hover:bg-surface-2 transition-all">Închide Editorul</button>
              <button onClick={handleSavePage} className="bg-accent text-white px-16 py-4 text-[10px] font-bold uppercase tracking-widest shadow-2xl shadow-accent/20 hover:opacity-90 transition-all">Publică Modificările</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
