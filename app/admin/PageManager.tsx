
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Page, SectionBlock, I18nString } from '../../types';

export const PageManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Partial<Page> | null>(null);
  const [editingSection, setEditingSection] = useState<{index: number, block: SectionBlock} | null>(null);

  useEffect(() => {
    dbService.getPages().then(setPages);
  }, []);

  const handleSavePage = async () => {
    if (!editing?.slug) return;
    const fullPage = {
      ...editing,
      id: editing.id || Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
      sections: editing.sections || []
    } as Page;
    await dbService.upsertPage(fullPage);
    setEditing(null);
    dbService.getPages().then(setPages);
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

  const updateSectionContent = (index: number, content: any) => {
    const newSections = [...(editing?.sections || [])];
    newSections[index].content = content;
    setEditing({ ...editing, sections: newSections });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-3xl">Pagini Dinamice (CMS)</h1>
        <button 
          onClick={() => setEditing({ 
            slug: '', 
            hero: { title: { ro: '', en: '' }, subtitle: { ro: '', en: '' }, darkImageUrl: '', lightImageUrl: '', overlayStrength: 0.5 },
            sections: [],
            isPublished: true,
            template: 'standard',
            seo: { title: { ro: '', en: '' }, description: { ro: '', en: '' } }
          })}
          className="bg-accent text-white px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-lg shadow-accent/20"
        >
          Creează Pagină Nouă
        </button>
      </div>

      <div className="grid gap-6">
        {pages.map(p => (
          <div key={p.id} className="bg-surface p-6 border border-border flex justify-between items-center hover:border-accent transition-colors shadow-sm">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-bold text-lg">/p/{p.slug}</h3>
                {!p.isPublished && <span className="bg-red-500/10 text-red-500 text-[8px] px-2 py-0.5 rounded font-bold uppercase">Draft</span>}
              </div>
              <p className="text-[10px] text-muted uppercase tracking-widest">
                Template: {p.template} • {p.sections.length} Secțiuni • Actualizat {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setEditing(p)} className="text-[10px] font-bold uppercase tracking-widest border border-border px-4 py-2 hover:bg-surface-2">Editează</button>
              <button onClick={() => dbService.deletePage(p.id).then(() => dbService.getPages().then(setPages))} className="text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-500/10 px-4 py-2 hover:bg-red-500/5">Șterge</button>
            </div>
          </div>
        ))}
        {pages.length === 0 && <div className="text-center py-20 border-2 border-dashed border-border text-muted">Nicio pagină creată încă.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-background w-full max-w-5xl p-10 border border-border shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
              <h2 className="font-serif text-3xl">Editor Pagină: <span className="text-accent">/p/{editing.slug || '...'}</span></h2>
              <button onClick={() => setEditing(null)} className="text-3xl font-light hover:text-accent transition-colors">×</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Setări de bază</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted">URL Slug</label>
                    <input className="w-full bg-surface border border-border p-3 text-sm outline-none focus:border-accent" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} placeholder="ex: reduceri-bucatarii" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted">Vizibilitate</label>
                    <div className="flex items-center space-x-3 p-3 bg-surface border border-border">
                      <input type="checkbox" id="pub-page" checked={editing.isPublished} onChange={e => setEditing({...editing, isPublished: e.target.checked})} />
                      <label htmlFor="pub-page" className="text-xs font-bold uppercase cursor-pointer">Publicat</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Hero Section</h3>
                  <input placeholder="Imagine Hero URL" className="w-full bg-surface border border-border p-3 text-sm" value={editing.hero?.darkImageUrl} onChange={e => setEditing({...editing, hero: {...editing.hero!, darkImageUrl: e.target.value}})} />
                  <input placeholder="Titlu RO" className="w-full bg-surface border border-border p-3 text-sm" value={editing.hero?.title.ro} onChange={e => setEditing({...editing, hero: {...editing.hero!, title: {...editing.hero!.title, ro: e.target.value}}})} />
                  <textarea placeholder="Subtitlu RO" className="w-full bg-surface border border-border p-3 text-sm h-20" value={editing.hero?.subtitle.ro} onChange={e => setEditing({...editing, hero: {...editing.hero!, subtitle: {...editing.hero!.subtitle, ro: e.target.value}}})} />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Secțiuni Conținut ({editing.sections?.length || 0})</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => addSection('text')} className="text-[9px] bg-accent text-white px-3 py-1.5 uppercase font-bold">+ Text</button>
                    <button onClick={() => addSection('imageText')} className="text-[9px] bg-accent text-white px-3 py-1.5 uppercase font-bold">+ Img+Text</button>
                    <button onClick={() => addSection('cta')} className="text-[9px] bg-accent text-white px-3 py-1.5 uppercase font-bold">+ CTA</button>
                  </div>
                </div>

                <div className="space-y-4 min-h-[400px] border-2 border-dashed border-border p-4 bg-surface-2/50">
                  {editing.sections?.map((s, idx) => (
                    <div key={s.id} className="bg-surface border border-border p-5 flex flex-col space-y-4 shadow-sm group">
                      <div className="flex justify-between items-center border-b border-border/50 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">#{idx + 1} — {s.type.toUpperCase()}</span>
                        <button onClick={() => setEditing({...editing, sections: editing.sections?.filter(sec => sec.id !== s.id)})} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase">Șterge</button>
                      </div>
                      
                      {/* Editori Inline simplificați */}
                      {s.type === 'text' && (
                        <textarea 
                          placeholder="Introduceți textul aici..."
                          className="w-full bg-surface-2 border border-border p-3 text-sm min-h-[100px]"
                          value={s.content.text.ro}
                          onChange={e => updateSectionContent(idx, { text: { ro: e.target.value, en: s.content.text.en } })}
                        />
                      )}
                      
                      {s.type === 'cta' && (
                        <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Titlu Buton" className="bg-surface-2 border border-border p-2 text-xs" value={s.content.buttonLabel.ro} onChange={e => updateSectionContent(idx, {...s.content, buttonLabel: {ro: e.target.value, en: s.content.buttonLabel.en}})} />
                          <input placeholder="Link (ex: /contact)" className="bg-surface-2 border border-border p-2 text-xs" value={s.content.link} onChange={e => updateSectionContent(idx, {...s.content, link: e.target.value})} />
                        </div>
                      )}

                      {s.type === 'imageText' && (
                        <div className="space-y-2">
                          <input placeholder="URL Imagine" className="w-full bg-surface-2 border border-border p-2 text-xs" value={s.content.imageUrl} onChange={e => updateSectionContent(idx, {...s.content, imageUrl: e.target.value})} />
                          <input placeholder="Titlu Secțiune" className="w-full bg-surface-2 border border-border p-2 text-xs" value={s.content.title.ro} onChange={e => updateSectionContent(idx, {...s.content, title: {ro: e.target.value, en: s.content.title.en}})} />
                        </div>
                      )}
                    </div>
                  ))}
                  {editing.sections?.length === 0 && <div className="text-center py-20 text-muted/40 text-[10px] uppercase font-bold">Nicio secțiune adăugată. Folosește butoanele de mai sus.</div>}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 mt-10 border-t border-border">
              <button onClick={() => setEditing(null)} className="px-8 py-3 text-[10px] uppercase font-bold tracking-widest border border-border">Anulează</button>
              <button onClick={handleSavePage} className="bg-accent text-white px-12 py-3 text-[10px] uppercase font-bold tracking-widest shadow-xl shadow-accent/20">Salvează Pagina Completă</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
