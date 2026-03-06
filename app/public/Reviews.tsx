
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Review } from '../../types';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Skeleton } from '../../components/ui/Skeleton';
import { CheckCircle2, MessageSquare, Quote, Star, X } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { lang, t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterType, setFilterType] = useState<'All' | 'Rezidențial' | 'Comercial'>('All');
  
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
    const load = async () => {
      try {
        const all = await dbService.getReviews();
        if (Array.isArray(all)) {
          // Only show approved and consented reviews
          setReviews(all.filter(r => r.status === 'approved' && r.consentPublic));
        } else {
          console.error("Reviews is not an array", all);
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
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
      status: 'pending', // Always pending moderation
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

    try {
      await dbService.upsertReview(review);
      setFormSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess(false);
        setNewReview({ rating: 5, projectType: 'Rezidențial', consentPublic: false, text: '', clientNameDisplay: '', city: '', projectLabel: '' });
      }, 3000);
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    return filterType === 'All' || r.projectType === filterType;
  });

  // Calculate metrics only if we have data
  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews ? (reviews.reduce((a,b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen selection:bg-[#d4af37] selection:text-black">
      
      {/* 1) HERO SECTION */}
      <section className="relative py-32 px-6 text-center bg-black overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-30">
           <OptimizedImage 
             src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000" 
             alt="Reviews Background" 
             className="w-full h-full object-cover grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
           <span className="text-[#d4af37] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6 animate-fade-in">
             {lang === 'ro' ? 'Experiența Carvello' : 'The Carvello Experience'}
           </span>
           <h1 className="font-serif text-5xl md:text-6xl text-white mb-8 animate-slide-up">
             {lang === 'ro' ? 'Feedback Clienți' : 'Client Feedback'}
           </h1>
           <p className="text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up-delayed">
             {lang === 'ro' 
               ? 'Transparență și încredere. Publicăm recenziile verificate ale clienților noștri, pentru a reflecta realitatea colaborării cu noi.'
               : 'Transparency and trust. We publish verified reviews from our clients to reflect the reality of working with us.'}
           </p>
           
           {/* Metrics Bar - Only show if we have reviews */}
           {hasReviews && avgRating && (
             <div className="flex flex-wrap justify-center gap-12 border-t border-white/10 pt-12 animate-slide-up-delayed">
                <div className="text-center">
                   <div className="text-4xl font-serif text-white mb-2 flex items-center justify-center gap-2">
                     {avgRating} <Star className="w-6 h-6 text-[#d4af37] fill-[#d4af37]" />
                   </div>
                   <div className="text-[9px] uppercase tracking-widest text-white/40">
                     {lang === 'ro' ? 'Rating Mediu' : 'Average Rating'}
                   </div>
                </div>
                <div className="text-center">
                   <div className="text-4xl font-serif text-white mb-2">{reviews.length}</div>
                   <div className="text-[9px] uppercase tracking-widest text-white/40">
                     {lang === 'ro' ? 'Recenzii Verificate' : 'Verified Reviews'}
                   </div>
                </div>
             </div>
           )}
        </div>
      </section>

      {/* 2) REVIEWS CONTENT */}
      <section className="py-24 px-6 max-w-7xl mx-auto min-h-[50vh]">
         {/* Filters - Only show if we have reviews */}
         {hasReviews && (
           <div className="flex justify-center mb-16">
              <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
                 {['All', 'Rezidențial', 'Comercial'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all ${filterType === type ? 'bg-[#d4af37] text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      {type}
                    </button>
                 ))}
              </div>
           </div>
         )}

         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(i => <Skeleton key={i} className="h-64 bg-white/5" />)}
            </div>
         ) : hasReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredReviews.map(review => (
                  <div key={review.id} className="bg-[#0a0a0a] border border-white/10 p-8 hover:border-[#d4af37]/50 transition-all group relative">
                     <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-[#d4af37]/20 transition-colors" />
                     
                     <div className="flex text-[#d4af37] mb-6 gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#d4af37]' : 'text-white/10'}`} />
                       ))}
                     </div>
                     
                     <p className="text-white/70 text-sm leading-relaxed mb-8 min-h-[80px]">"{review.text}"</p>
                     
                     <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-serif text-xs font-bold text-white border border-white/10">
                           {review.clientNameDisplay.charAt(0)}
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-[#d4af37] transition-colors">{review.clientNameDisplay}</p>
                           <p className="text-[9px] text-white/40">{review.projectType} • {review.city}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            /* EMPTY STATE - Elegant & Honest */
            <div className="text-center py-20 max-w-2xl mx-auto border border-white/5 bg-white/[0.02] p-12">
               <MessageSquare className="w-12 h-12 text-[#d4af37] mx-auto mb-6 opacity-50" />
               <h3 className="font-serif text-2xl text-white mb-4">
                 {lang === 'ro' ? 'Încă nu sunt recenzii publice' : 'No public reviews yet'}
               </h3>
               <p className="text-white/60 font-light mb-8 leading-relaxed">
                 {lang === 'ro' 
                   ? 'Fiecare proiect Carvello este unic și tratăm confidențialitatea clienților noștri cu maximă seriozitate. Lucrăm la colectarea și publicarea feedback-ului pentru proiectele recente.'
                   : 'Every Carvello project is unique, and we treat our clients\' confidentiality with utmost seriousness. We are working on collecting and publishing feedback for recent projects.'}
               </p>
               <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs uppercase tracking-widest font-bold border-b border-[#d4af37]/30 pb-1">
                 {lang === 'ro' ? 'Calitate Garantată' : 'Guaranteed Quality'}
               </div>
            </div>
         )}
      </section>

      {/* 3) CTA & SUBMISSION */}
      <section className="py-24 bg-[#d4af37] text-black text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
         <div className="max-w-2xl mx-auto px-6 relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              {lang === 'ro' ? 'Ai colaborat cu noi?' : 'Have you worked with us?'}
            </h2>
            <p className="text-black/70 mb-10 font-medium text-lg max-w-lg mx-auto">
              {lang === 'ro' 
                ? 'Experiența ta ajută viitorii clienți să ia decizia corectă.'
                : 'Your experience helps future clients make the right decision.'}
            </p>
            <button 
               onClick={() => setShowForm(true)}
               className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl"
            >
               {lang === 'ro' ? 'Lasă un Feedback' : 'Leave Feedback'}
            </button>
         </div>
      </section>

      {/* 4) MODAL FORM */}
      {showForm && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center items-center p-6 animate-fade-in">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 max-w-lg w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
               <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                 <X className="w-6 h-6" />
               </button>
               
               {formSuccess ? (
                  <div className="text-center py-12">
                     <CheckCircle2 className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
                     <h3 className="font-serif text-2xl text-white mb-4">
                       {lang === 'ro' ? 'Mulțumim!' : 'Thank you!'}
                     </h3>
                     <p className="text-white/60 text-sm">
                       {lang === 'ro' ? 'Feedback-ul tău a fost trimis spre aprobare.' : 'Your feedback has been sent for approval.'}
                     </p>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="text-center mb-8">
                       <h3 className="font-serif text-2xl text-white mb-2">
                         {lang === 'ro' ? 'Trimite Feedback' : 'Send Feedback'}
                       </h3>
                       <p className="text-[10px] text-white/40 uppercase tracking-widest">
                         {lang === 'ro' ? 'Publicarea necesită aprobare' : 'Publication requires approval'}
                       </p>
                     </div>
                     
                     <div className="flex justify-center gap-2 mb-8">
                        {[1,2,3,4,5].map(star => (
                           <button 
                             key={star} 
                             type="button" 
                             className={`transition-all hover:scale-110 ${star <= (newReview.rating || 0) ? 'text-[#d4af37] fill-[#d4af37]' : 'text-white/20'}`}
                             onClick={() => setNewReview({...newReview, rating: star})}
                           >
                             <Star className="w-8 h-8" />
                           </button>
                        ))}
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">
                             {lang === 'ro' ? 'Nume' : 'Name'}
                           </label>
                           <input 
                             required 
                             className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#d4af37] transition-colors"
                             placeholder="ex: Andrei P."
                             value={newReview.clientNameDisplay}
                             onChange={e => setNewReview({...newReview, clientNameDisplay: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">
                             {lang === 'ro' ? 'Oraș' : 'City'}
                           </label>
                           <input 
                             required 
                             className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#d4af37] transition-colors"
                             placeholder="ex: București"
                             value={newReview.city}
                             onChange={e => setNewReview({...newReview, city: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">
                             {lang === 'ro' ? 'Tip Proiect' : 'Project Type'}
                           </label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#d4af37] transition-colors appearance-none"
                             value={newReview.projectType}
                             onChange={e => setNewReview({...newReview, projectType: e.target.value as any})}
                           >
                              <option value="Rezidențial">Rezidențial</option>
                              <option value="Comercial">Comercial</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">
                             {lang === 'ro' ? 'Etichetă' : 'Label'}
                           </label>
                           <input 
                             required 
                             className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#d4af37] transition-colors"
                             placeholder="ex: Bucătărie Custom"
                             value={newReview.projectLabel}
                             onChange={e => setNewReview({...newReview, projectLabel: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-white/40">
                          {lang === 'ro' ? 'Recenzia Ta' : 'Your Review'}
                        </label>
                        <textarea 
                           required 
                           className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#d4af37] transition-colors h-32 resize-none"
                           placeholder={lang === 'ro' ? 'Descrie experiența...' : 'Describe the experience...'}
                           value={newReview.text}
                           onChange={e => setNewReview({...newReview, text: e.target.value})}
                        />
                     </div>

                     <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10">
                        <input 
                          type="checkbox" 
                          required 
                          className="mt-1 accent-[#d4af37]"
                          checked={newReview.consentPublic}
                          onChange={e => setNewReview({...newReview, consentPublic: e.target.checked})}
                        />
                        <label className="text-[10px] text-white/60 leading-tight">
                          {lang === 'ro' 
                            ? 'Sunt de acord ca acest feedback (împreună cu prenumele și inițiala numelui) să fie publicat pe site-ul Carvello.'
                            : 'I agree that this feedback (along with my first name and initial) may be published on the Carvello website.'}
                        </label>
                     </div>

                     <button 
                        disabled={formSubmitting}
                        className="w-full bg-[#d4af37] text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 shadow-lg"
                     >
                        {formSubmitting 
                          ? (lang === 'ro' ? 'Se trimite...' : 'Sending...') 
                          : (lang === 'ro' ? 'Trimite Feedback' : 'Send Feedback')}
                     </button>
                  </form>
               )}
            </div>
         </div>
      )}
    </div>
  );
};
