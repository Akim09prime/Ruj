
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filterType, setFilterType] = useState<'general' | 'project-feedback'>('general');

  const loadData = async () => {
    const l = await dbService.getLeads();
    setLeads(l);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    await dbService.updateLeadStatus(id, status);
    loadData();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const filtered = leads.filter(l => (filterType === 'general' ? l.type !== 'project-feedback' : l.type === 'project-feedback'));

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex gap-4 mb-8 border-b border-border pb-4">
         <button onClick={() => setFilterType('general')} className={`text-xl font-serif ${filterType === 'general' ? 'text-accent' : 'text-muted'}`}>Cereri Ofertă</button>
         <button onClick={() => setFilterType('project-feedback')} className={`text-xl font-serif ${filterType === 'project-feedback' ? 'text-accent' : 'text-muted'}`}>Recenzii & Feedback</button>
      </div>

      <div className="bg-surface border border-border">
         <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-border uppercase font-bold text-muted">
               <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">Nume / Contact</th>
                  {filterType === 'project-feedback' ? (
                     <th className="p-4">Proiect / Rating</th>
                  ) : (
                     <th className="p-4">Tip / Buget</th>
                  )}
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Acțiuni</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map(l => (
                  <tr key={l.id} className="border-b border-border hover:bg-surface-2">
                     <td className="p-4 w-32">{new Date(l.createdAt).toLocaleDateString()}</td>
                     <td className="p-4">
                        <div className="font-bold text-sm">{l.name}</div>
                        <div className="text-muted">{l.email}</div>
                        <div className="text-muted">{l.phone}</div>
                     </td>
                     {filterType === 'project-feedback' ? (
                        <td className="p-4">
                           <div className="font-bold">{l.projectRef?.title}</div>
                           <div className="text-accent">{'★'.repeat(l.rating || 0)}</div>
                        </td>
                     ) : (
                        <td className="p-4">
                           <span className="block font-bold">{l.category || l.projectType}</span>
                           <span className="text-muted">{l.budget || '-'}</span>
                        </td>
                     )}
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded font-bold uppercase text-[9px] ${l.status === 'approved' || l.status === 'won' ? 'bg-green-500 text-white' : l.status === 'new' ? 'bg-accent text-white' : 'bg-gray-200 text-black'}`}>
                           {l.status}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        <button onClick={() => setSelected(l)} className="underline text-muted hover:text-accent">Detalii</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {selected && (
         <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-6" onClick={() => setSelected(null)}>
            <div className="bg-background w-full max-w-lg p-10 border border-border shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
               <h2 className="font-serif text-3xl mb-6">{selected.type === 'project-feedback' ? 'Moderare Feedback' : 'Detalii Cerere'}</h2>
               
               <div className="bg-surface-2 p-6 mb-6 space-y-4">
                  <div>
                     <p className="text-[10px] uppercase font-bold text-muted">Client</p>
                     <p className="text-sm font-bold">{selected.name}</p>
                     <p className="text-xs">{selected.email} • {selected.phone}</p>
                     <p className="text-xs">{selected.city}</p>
                  </div>
                  
                  {selected.type === 'general' && (
                     <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                        <div>
                           <p className="text-[10px] uppercase font-bold text-muted">Categorie</p>
                           <p className="text-sm">{selected.category}</p>
                        </div>
                        <div>
                           <p className="text-[10px] uppercase font-bold text-muted">Buget</p>
                           <p className="text-sm">{selected.budget || 'Nespecificat'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] uppercase font-bold text-muted">Termen</p>
                           <p className="text-sm">{selected.timeline || 'Nespecificat'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] uppercase font-bold text-muted">Tip</p>
                           <p className="text-sm">{selected.projectType}</p>
                        </div>
                     </div>
                  )}

                  <div className="border-t border-border pt-4">
                     <p className="text-[10px] uppercase font-bold text-muted mb-2">Mesaj</p>
                     <p className="italic text-muted text-sm leading-relaxed p-3 bg-background border border-border">"{selected.message}"</p>
                  </div>
               </div>

               <div className="flex gap-2">
                  {selected.type === 'project-feedback' ? (
                     <>
                        <button onClick={() => handleUpdateStatus(selected.id, 'approved')} className="flex-1 py-3 bg-green-600 text-white font-bold uppercase tracking-widest text-xs">Aprobă Publicare</button>
                        <button onClick={() => handleUpdateStatus(selected.id, 'archived')} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs">Respinge</button>
                     </>
                  ) : (
                     <>
                        <button onClick={() => handleUpdateStatus(selected.id, 'contacted')} className="flex-1 py-3 bg-accent text-white font-bold uppercase tracking-widest text-xs">Marchează Contactat</button>
                        <button onClick={() => handleUpdateStatus(selected.id, 'won')} className="flex-1 py-3 bg-green-600 text-white font-bold uppercase tracking-widest text-xs">Proiect Câștigat</button>
                     </>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
