
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Review } from '../../types';

export const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
  const [editing, setEditing] = useState<Review | null>(null);

  const load = async () => {
    const data = await dbService.getReviews();
    setReviews(data);
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async (updated: Review) => {
    // Validation: Cannot approve without consent
    if (updated.status === 'approved' && !updated.consentPublic) {
      alert("Nu poți aproba o recenzie fără consimțământ public!");
      return;
    }
    await dbService.upsertReview(updated);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sigur ștergi această recenzie?")) {
      await dbService.deleteReview(id);
      load();
    }
  };

  const filtered = reviews.filter(r => filterStatus === 'all' || r.status === filterStatus);

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="font-serif text-4xl mb-2">Recenzii Clienți</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Aprobare și Moderare Feedback</p>
        </div>
        <div className="flex gap-2">
           {['all', 'pending', 'approved', 'hidden'].map(s => (
              <button 
                key={s} 
                onClick={() => setFilterStatus(s as any)}
                className={`px-4 py-2 text-[9px] uppercase font-bold border ${filterStatus === s ? 'bg-accent text-white border-accent' : 'border-border text-muted hover:bg-surface-2'}`}
              >
                 {s} ({reviews.filter(r => s === 'all' || r.status === s).length})
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {filtered.map(review => (
            <div key={review.id} className={`bg-surface border p-6 flex flex-col md:flex-row gap-6 ${review.status === 'pending' ? 'border-l-4 border-l-yellow-500' : review.status === 'approved' ? 'border-l-4 border-l-green-500' : 'border-border'}`}>
               
               {/* Left: Meta */}
               <div className="w-full md:w-64 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded text-white ${review.status === 'pending' ? 'bg-yellow-500' : review.status === 'approved' ? 'bg-green-500' : 'bg-gray-500'}`}>{review.status}</span>
                     {review.isFeatured && <span className="text-[9px] uppercase font-bold px-2 py-1 bg-accent text-white rounded">Featured</span>}
                  </div>
                  <h3 className="font-bold text-sm">{review.clientNameDisplay}</h3>
                  <p className="text-xs text-muted">{review.projectLabel}</p>
                  <p className="text-[10px] text-muted/60 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  <div className="mt-4 text-accent text-sm">{'★'.repeat(review.rating)}<span className="text-border">{'★'.repeat(5-review.rating)}</span></div>
               </div>

               {/* Center: Content */}
               <div className="flex-grow">
                  <p className="text-sm italic text-muted leading-relaxed">"{review.text}"</p>
                  <div className="mt-4 flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${review.consentPublic ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     <span className="text-[10px] uppercase font-bold text-muted">{review.consentPublic ? 'Consent Given' : 'NO CONSENT'}</span>
                  </div>
               </div>

               {/* Right: Actions */}
               <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  {review.status !== 'approved' && (
                     <button onClick={() => handleUpdate({...review, status: 'approved'})} className="px-4 py-2 bg-green-500 text-white text-[9px] uppercase font-bold hover:bg-green-600">Aprobă</button>
                  )}
                  {review.status === 'approved' && (
                     <button onClick={() => handleUpdate({...review, status: 'hidden'})} className="px-4 py-2 bg-gray-500 text-white text-[9px] uppercase font-bold hover:bg-gray-600">Ascunde</button>
                  )}
                  <button onClick={() => setEditing(review)} className="px-4 py-2 border border-border text-[9px] uppercase font-bold hover:bg-surface-2">Editează</button>
                  <button onClick={() => handleDelete(review.id)} className="px-4 py-2 text-red-500 border border-red-500/20 text-[9px] uppercase font-bold hover:bg-red-500 hover:text-white">Șterge</button>
               </div>
            </div>
         ))}
         {filtered.length === 0 && <p className="text-center py-10 text-muted italic">Nicio recenzie găsită.</p>}
      </div>

      {/* Edit Modal */}
      {editing && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center p-6">
            <div className="bg-background w-full max-w-lg p-8 border border-border shadow-2xl space-y-6">
               <h3 className="font-serif text-2xl">Editare Recenzie</h3>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[9px] uppercase font-bold text-muted">Nume Display</label>
                     <input className="w-full bg-surface-2 border border-border p-2 text-xs" value={editing.clientNameDisplay} onChange={e => setEditing({...editing, clientNameDisplay: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] uppercase font-bold text-muted">Label Proiect</label>
                     <input className="w-full bg-surface-2 border border-border p-2 text-xs" value={editing.projectLabel} onChange={e => setEditing({...editing, projectLabel: e.target.value})} />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted">Text</label>
                  <textarea className="w-full bg-surface-2 border border-border p-2 text-xs h-24" value={editing.text} onChange={e => setEditing({...editing, text: e.target.value})} />
               </div>

               <div className="flex gap-4 p-4 bg-surface-2 border border-border">
                  <div className="flex items-center gap-2">
                     <input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} className="accent-accent" />
                     <label className="text-xs uppercase font-bold">Featured (Pin to top)</label>
                  </div>
                  <div className="flex items-center gap-2">
                     <input type="checkbox" checked={editing.consentPublic} onChange={e => setEditing({...editing, consentPublic: e.target.checked})} className="accent-green-500" />
                     <label className="text-xs uppercase font-bold">Public Consent Override</label>
                  </div>
               </div>

               <div className="flex justify-end gap-2 pt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border text-xs uppercase font-bold">Anulează</button>
                  <button onClick={() => handleUpdate(editing)} className="px-6 py-2 bg-accent text-white text-xs uppercase font-bold">Salvează</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
