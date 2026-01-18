
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Review } from '../../types';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Skeleton } from '../../components/ui/Skeleton';

export const Reviews: React.FC = () => {
  const { lang, t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterType, setFilterType] = useState<'All' | 'Rezidențial' | 'Comercial'>('All');
  const [filterStars, setFilterStars] = useState<number | 'All'>('All');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    rating: 5,
    projectType: 'Rezidențial',
    consentPublic: false,
    text: '',
    clientNameDisplay: '',
    city: '',
    projectLabel: ''
  });

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Recenzii Clienți' : 'CARVELLO | Client Reviews';
    const load = async () => {
      const all = await dbService.getReviews();
      setReviews(all.filter(r => r.status === 'approved' && r.consentPublic));
      setLoading(false);
    };
    load();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.consentPublic) {
      alert(lang === 'ro' ? 'Te rugăm să confirmi acordul de publicare.' : 'Please confirm publication consent.');
      return;
    }
    setFormSubmitting(true);
    
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString(),
      source: 'internal',
      isFeatured: false,
      rating: newReview.rating || 5,
      text: newReview.text || '',
      clientNameDisplay: newReview.clientNameDisplay || 'Anonim',
      city: newReview.city || '',
      projectType: newReview.projectType as 'Rezidențial' | 'Comercial',
      projectLabel: newReview.projectLabel || '',
      consentPublic: true
    };

    await dbService.upsertReview(review);
    setFormSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => {
      setShowForm(false);
      setFormSuccess(false);
      setNewReview({ rating: 5, projectType: 'Rezidențial', consentPublic: false, text: '', clientNameDisplay: '', city: '', projectLabel: '' });
    }, 3000);
  };

  const filteredReviews = reviews.filter(r => {
    const typeMatch = filterType === 'All' || r.projectType === filterType;
    const starMatch = filterStars === 'All' || r.rating === filterStars;
    return typeMatch && starMatch;
  });

  // Metrics
  const avgRating = reviews.length > 0 ? (reviews.reduce((a,b) => a + b.rating, 0) / reviews.length).toFixed(1) : '5.0';
  const featuredReviews = reviews.filter(r => r.isFeatured).slice(0, 3);

  return (
    <div className="bg-background text-foreground animate-fade-in">
      
      {/* 1) CINEMATIC HERO */}
      <section className="relative py-32 px-6 text-center bg-black overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-40">
           <OptimizedImage 
             src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2000" 
             alt="Reviews Background" 
             className="w-full h-full object-cover grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold block mb-6 animate-fade-in">Social Proof</span>
           <h1 className="font-serif text-5xl md:text-7xl text-white mb-8 animate-slide-up">Recenzii & Experiențe</h1>
           <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up-delayed">
             Feedback real de la clienți rezidențiali și comerciali. Publicat doar cu acordul lor explicit.
           </p>
           
           {/* Metrics Bar */}
           <div className="flex flex-wrap justify-center gap-12 border-t border-white/10 pt-12 animate-slide-up-delayed">
              <div className="text-center">
                 <div className="text-4xl font-serif text-white mb-2">{avgRating} <span className="text-accent text-2xl">★</span></div>
                 <div className="text-[9px] uppercase tracking-widest text-white/50">Rating Mediu</div>
              </div>
              <div className="text-center">
                 <div className="text-4xl font-serif text-white mb-2">{reviews.length}</div>
                 <div className="text-[9px] uppercase tracking-widest text-white/50">Recenzii Verificate</div>
              </div>
              <div className="text-center">
                 <div className="text-4xl font-serif text-white mb-2">100%</div>
                 <div className="text-[9px] uppercase tracking-widest text-white/50">Rată Satisfacție</div>
              </div>
           </div>
        </div>
      </section>

      {/* 2) FEATURED TESTIMONIALS (Pinned) */}
      {featuredReviews.length > 0 && (
        <section className="py-20 px-6 bg-surface border-b border-border">
           <div className="max-w-7xl mx-auto">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-12 text-center">Experiențe De Top</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {featuredReviews.map(review => (
                    <div key={review.id} className="bg-background border border-accent/20 p-8 relative shadow-lg shadow-accent/5">
                       <div className="absolute -top-4 -left-4 text-6xl text-accent opacity-20 font-serif">“</div>
                       <div className="flex text-accent text-sm mb-6">{'★'.repeat(review.rating)}</div>
                       <p className="text-muted italic leading-relaxed mb-8 min-h-[80px] text-sm">"{review.text}"</p>
                       <div className="flex items-center gap-4 border-t border-border pt-6">
                          <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center font-serif font-bold text-accent border border-border">
                             {review.clientNameDisplay.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest">{review.clientNameDisplay}</p>
                             <p className="text-[10px] text-muted">{review.projectLabel} • {review.city}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* 3) MAIN REVIEWS GRID + FILTERS */}
      <section className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
         <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
               {['All', 'Rezidențial', 'Comercial'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${filterType === type ? 'bg-accent text-white border-accent' : 'border-border hover:bg-surface-2'}`}
                  >
                    {type}
                  </button>
               ))}
            </div>
            
            <div className="flex items-center gap-4">
               <span className="text-[10px] uppercase font-bold text-muted hidden md:inline">Filtrează după stele:</span>
               <select 
                 className="bg-surface border border-border p-2 text-xs outline-none focus:border-accent uppercase font-bold"
                 value={filterStars}
                 onChange={e => setFilterStars(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
               >
                  <option value="All">Toate</option>
                  <option value="5">5 Stele</option>
                  <option value="4">4 Stele</option>
                  <option value="3">3 Stele</option>
               </select>
            </div>
         </div>

         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64" />)}
            </div>
         ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredReviews.map(review => (
                  <div key={review.id} className="bg-surface border border-border p-8 hover:border-accent transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex text-accent text-xs">{'★'.repeat(review.rating)}<span className="text-border">{'★'.repeat(5-review.rating)}</span></div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-muted/50">{new Date(review.createdAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-muted leading-relaxed mb-8 line-clamp-6">"{review.text}"</p>
                     
                     <div className="flex items-center gap-4 mt-auto">
                        <div className="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center font-serif text-xs font-bold text-foreground/70 border border-border">
                           {review.clientNameDisplay.charAt(0)}
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest group-hover:text-accent transition-colors">{review.clientNameDisplay}</p>
                           <p className="text-[9px] text-muted">{review.projectType} • {review.city}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-20 border-2 border-dashed border-border">
               <p className="text-muted italic">Nu există recenzii pentru filtrele selectate.</p>
            </div>
         )}

         {/* Google Reviews Placeholder */}
         <div className="mt-24 p-8 border border-border bg-surface-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
               <span className="font-bold text-lg">Google</span>
               <div className="flex text-yellow-500 text-sm">★★★★★</div>
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted">Google Reviews Integration Coming Soon</p>
         </div>
      </section>

      {/* 4) CTA & SUBMISSION */}
      <section className="py-24 bg-accent text-white text-center">
         <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-4xl mb-6">Ai lucrat cu noi?</h2>
            <p className="text-white/80 mb-10 font-light">Părerea ta contează. Ajută viitorii clienți să înțeleagă experiența Carvello.</p>
            <button 
               onClick={() => setShowForm(true)}
               className="bg-white text-accent px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl"
            >
               Trimite Feedback
            </button>
         </div>
      </section>

      {/* 5) MODAL FORM */}
      {showForm && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in">
            <div className="bg-background border border-border p-10 max-w-lg w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
               <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-2xl hover:text-accent">×</button>
               
               {formSuccess ? (
                  <div className="text-center py-10">
                     <div className="text-5xl text-accent mb-4">✓</div>
                     <h3 className="font-serif text-2xl mb-4">Mulțumim!</h3>
                     <p className="text-muted text-sm">Feedback-ul tău a fost trimis spre aprobare.</p>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <h3 className="font-serif text-2xl mb-2 text-center">Trimite Feedback</h3>
                     <p className="text-center text-xs text-muted mb-6 uppercase tracking-widest">Publicarea necesită aprobare manuală</p>
                     
                     <div className="flex justify-center gap-2 mb-6">
                        {[1,2,3,4,5].map(star => (
                           <button 
                             key={star} 
                             type="button" 
                             className={`text-2xl transition-colors ${star <= (newReview.rating || 0) ? 'text-accent' : 'text-border'}`}
                             onClick={() => setNewReview({...newReview, rating: star})}
                           >★</button>
                        ))}
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] uppercase font-bold text-muted">Nume Afișat</label>
                           <input 
                             required 
                             className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent"
                             placeholder="ex: Andrei P."
                             value={newReview.clientNameDisplay}
                             onChange={e => setNewReview({...newReview, clientNameDisplay: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] uppercase font-bold text-muted">Oraș</label>
                           <input 
                             required 
                             className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent"
                             placeholder="ex: Cluj-Napoca"
                             value={newReview.city}
                             onChange={e => setNewReview({...newReview, city: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] uppercase font-bold text-muted">Tip Proiect</label>
                           <select 
                             className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent"
                             value={newReview.projectType}
                             onChange={e => setNewReview({...newReview, projectType: e.target.value as any})}
                           >
                              <option value="Rezidențial">Rezidențial</option>
                              <option value="Comercial">Comercial</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] uppercase font-bold text-muted">Label Proiect</label>
                           <input 
                             required 
                             className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent"
                             placeholder="ex: Bucătărie"
                             value={newReview.projectLabel}
                             onChange={e => setNewReview({...newReview, projectLabel: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-muted">Recenzia Ta</label>
                        <textarea 
                           required 
                           className="w-full bg-surface-2 border border-border p-3 text-xs outline-none focus:border-accent h-32 resize-none"
                           placeholder="Descrie experiența..."
                           value={newReview.text}
                           onChange={e => setNewReview({...newReview, text: e.target.value})}
                        />
                     </div>

                     <div className="flex items-start gap-3 p-4 bg-surface-2 border border-border">
                        <input 
                          type="checkbox" 
                          required 
                          className="mt-1 accent-accent"
                          checked={newReview.consentPublic}
                          onChange={e => setNewReview({...newReview, consentPublic: e.target.checked})}
                        />
                        <label className="text-[10px] text-muted leading-tight">
                           Sunt de acord ca acest feedback (împreună cu prenumele și inițiala numelui) să fie publicat pe site-ul Carvello în scopuri de marketing.
                        </label>
                     </div>

                     <button 
                        disabled={formSubmitting}
                        className="w-full bg-accent text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                     >
                        {formSubmitting ? 'Se trimite...' : 'Trimite Feedback'}
                     </button>
                  </form>
               )}
            </div>
         </div>
      )}

    </div>
  );
};
