
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Project, Media, Lead } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams(); // 'id' here is slug or id
  const { t, lang } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Feedback Form State
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '', rating: 5 });
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Load Data
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      let p = await dbService.getProjectBySlug(id);
      if (!p) p = await dbService.getProject(id);

      if (p) {
        setProject(p);
        const m = await dbService.getMedia(p.id);
        setMedia(m.sort((a, b) => a.orderInProject - b.orderInProject));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (project) document.title = `${t(project.title)} | CARVELLO Case Study`;
  }, [project, t]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setFeedbackStatus('sending');
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'project-feedback',
      projectRef: { id: project.id, title: t(project.title) },
      rating: feedback.rating,
      name: feedback.name,
      email: feedback.email,
      phone: '-',
      city: '-',
      projectType: 'Feedback',
      message: feedback.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    await dbService.addLead(newLead);
    // Simulate API delay
    setTimeout(() => setFeedbackStatus('sent'), 1000);
  };

  // Keyboard Nav for Lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev! + 1) % media.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev! - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, media.length]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="w-12 h-12 rounded-full" /></div>;
  if (!project) return <Navigate to="/portofoliu" replace />;

  const coverImage = media.find(m => m.id === project.coverMediaId)?.url || media[0]?.url;
  const metrics = project.metrics || { duration: 'N/A', finish: 'N/A', materials: 'N/A', hardware: 'N/A', services: [] };

  return (
    <div className="pt-0 bg-background text-foreground animate-fade-in">
      
      {/* 1) CINEMATIC HERO */}
      <section className="relative h-screen flex items-end pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={coverImage} className="w-full h-full object-cover grayscale-[0.3]" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full text-white">
           <div className="flex flex-wrap gap-3 mb-6 animate-fade-in">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase font-bold tracking-widest">{t(project.location)}</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase font-bold tracking-widest">{new Date(project.publishedAt).getFullYear()}</span>
              {metrics.services.map((s, i) => (
                <span key={i} className="hidden md:inline-block px-3 py-1 bg-accent/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest">{s}</span>
              ))}
           </div>
           <h1 className="font-serif text-5xl md:text-8xl leading-none mb-8 animate-slide-up">{t(project.title)}</h1>
           <div className="flex flex-wrap gap-8 md:gap-16 border-t border-white/20 pt-8 animate-slide-up-delayed">
              <div>
                 <span className="block text-[10px] uppercase font-bold text-accent mb-1">Durată</span>
                 <span className="font-serif text-xl">{metrics.duration}</span>
              </div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-accent mb-1">Finisaj</span>
                 <span className="font-serif text-xl">{metrics.finish}</span>
              </div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-accent mb-1">Materiale</span>
                 <span className="font-serif text-xl">{metrics.materials}</span>
              </div>
           </div>
           <div className="absolute bottom-24 right-6 md:right-0">
              <Link to={`/cerere-oferta?ref=${project.slug}`} className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl shadow-accent/30">
                {lang === 'ro' ? 'Vreau o ofertă similară' : 'Get Similar Quote'}
              </Link>
           </div>
        </div>
      </section>

      {/* 2) EXECUTIVE SUMMARY (Challenge/Solution/Result) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-border">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent border-b border-accent/20 pb-2 inline-block">Provocarea</h3>
               <p className="font-serif text-xl leading-relaxed text-muted">
                 "{project.clientBrief ? t(project.clientBrief) : t(project.summary)}"
               </p>
            </div>
            <div className="space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent border-b border-accent/20 pb-2 inline-block">Soluția</h3>
               <p className="text-sm font-light leading-loose text-muted">
                 {project.ourSolution ? t(project.ourSolution) : "Abordare customizată folosind tehnologie CNC și finisaje premium pentru a îndeplini viziunea arhitecturală."}
               </p>
            </div>
            <div className="space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent border-b border-accent/20 pb-2 inline-block">Rezultatul</h3>
               <p className="text-sm font-light leading-loose text-muted">
                 {project.result ? t(project.result) : "Un spațiu perfect funcțional, livrat la timp."}
               </p>
            </div>
         </div>
      </section>

      {/* 3) GALLERY LIGHTBOX */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-4xl">{lang === 'ro' ? 'Galerie Finală' : 'Final Gallery'}</h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">{media.length} Photos</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {media.map((item, i) => (
              <div 
                key={item.id} 
                className={`relative group overflow-hidden cursor-zoom-in bg-surface-2 ${i === 0 ? 'md:col-span-2 md:row-span-2 md:h-full' : ''}`}
                onClick={() => setLightboxIndex(i)}
              >
                <OptimizedImage src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white text-xs uppercase font-bold tracking-widest border border-white px-4 py-2">Zoom</span>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* 4) PROCESS STAGES TIMELINE */}
      {project.stages && project.stages.length > 0 && (
        <section className="py-24 bg-surface border-y border-border">
           <div className="max-w-4xl mx-auto px-6">
              <h2 className="font-serif text-4xl mb-20 text-center">{lang === 'ro' ? 'Etapele Proiectului' : 'Project Stages'}</h2>
              <div className="space-y-0 relative border-l border-border ml-6 md:ml-0 md:border-none">
                 {project.stages.map((step, idx) => (
                   <div key={idx} className="relative pl-12 pb-16 md:pl-0 md:pb-20 md:grid md:grid-cols-2 md:gap-16 group">
                      
                      {/* Center Node */}
                      <div className="absolute -left-[5px] top-0 md:left-1/2 md:-ml-[5px] w-[11px] h-[11px] rounded-full bg-background border-2 border-accent z-10"></div>
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-border -ml-[0.5px]"></div>

                      {/* Content Alternating */}
                      <div className={`${idx % 2 === 0 ? 'md:text-right' : 'md:col-start-2'} space-y-4`}>
                         <span className="text-[9px] uppercase tracking-widest font-bold text-accent block">Stage 0{idx + 1}</span>
                         <h3 className="text-2xl font-serif">{t(step.title)}</h3>
                         <p className="text-muted text-sm leading-relaxed">{t(step.description)}</p>
                         {step.highlights.length > 0 && (
                           <ul className={`text-[10px] uppercase font-bold tracking-widest text-muted/70 space-y-1 ${idx % 2 === 0 ? 'md:flex md:flex-col md:items-end' : ''}`}>
                             {step.highlights.map((h, i) => <li key={i}>• {h}</li>)}
                           </ul>
                         )}
                      </div>
                      
                      {/* Image (Opposite side) */}
                      <div className={`mt-6 md:mt-0 ${idx % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1 md:text-right'}`}>
                         {step.images && step.images[0] && (
                           <img src={step.images[0]} className="w-full aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-border" alt="" />
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* 5) TECH SPECS & TESTIMONIAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
         <div>
            <h3 className="font-serif text-3xl mb-8">{lang === 'ro' ? 'Specificații Tehnice' : 'Technical Specs'}</h3>
            <div className="divide-y divide-border">
               {project.techSpecs ? project.techSpecs.map((spec, i) => (
                 <div key={i} className="flex justify-between py-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted">{spec.label}</span>
                    <span className="text-sm font-medium text-right">{spec.value}</span>
                 </div>
               )) : (
                 <div className="py-4 text-muted text-sm italic">Fără specificații detaliate.</div>
               )}
            </div>
         </div>
         
         <div className="space-y-12">
            {project.testimonial && (
              <div className="bg-surface-2 p-10 border border-border relative">
                  <span className="text-6xl text-accent font-serif opacity-30 absolute top-4 left-6">“</span>
                  <p className="text-xl font-serif italic leading-relaxed text-muted mt-6 mb-8">
                    {t(project.testimonial.text)}
                  </p>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest">{project.testimonial.author}</p>
                    <p className="text-xs text-accent">{project.testimonial.role}</p>
                  </div>
              </div>
            )}

            {/* FEEDBACK FORM */}
            <div className="border border-border p-8 bg-background">
               <h4 className="text-xs uppercase font-bold tracking-widest mb-4">Trimite Feedback pentru acest proiect</h4>
               {feedbackStatus === 'sent' ? (
                 <div className="text-green-600 text-sm font-bold">Mulțumim! Feedback-ul tău a fost înregistrat.</div>
               ) : (
                 <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <input className="w-full bg-surface-2 border border-border p-3 text-xs outline-none" placeholder="Nume" required value={feedback.name} onChange={e => setFeedback({...feedback, name: e.target.value})} />
                    <input className="w-full bg-surface-2 border border-border p-3 text-xs outline-none" placeholder="Email" required value={feedback.email} onChange={e => setFeedback({...feedback, email: e.target.value})} />
                    <textarea className="w-full bg-surface-2 border border-border p-3 text-xs outline-none" placeholder="Părerea ta..." required value={feedback.message} onChange={e => setFeedback({...feedback, message: e.target.value})} />
                    <button disabled={feedbackStatus === 'sending'} className="w-full bg-foreground text-background py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                      {feedbackStatus === 'sending' ? 'Se trimite...' : 'Trimite Feedback'}
                    </button>
                 </form>
               )}
            </div>
         </div>
      </section>

      {/* 6) SALES CTA */}
      <section className="py-32 bg-[#050505] text-white text-center">
         <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">{lang === 'ro' ? 'Vrei un proiect similar?' : 'Want a similar project?'}</h2>
            <p className="text-white/60 mb-10 font-light text-lg">
              {lang === 'ro' 
                ? 'Transformăm viziunea ta în realitate cu aceeași precizie și atenție la detalii.' 
                : 'We turn your vision into reality with the same precision and attention to detail.'}
            </p>
            <Link to="/cerere-oferta" className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all">
               {lang === 'ro' ? 'Discută cu un Expert' : 'Talk to an Expert'}
            </Link>
         </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && media[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
           <button className="absolute top-6 right-6 text-white text-4xl font-light hover:text-accent z-50" onClick={() => setLightboxIndex(null)}>×</button>
           <div className="relative max-w-[90vw] max-h-[90vh]">
              <img src={media[lightboxIndex].url} className="max-h-[85vh] object-contain shadow-2xl" alt="" />
           </div>
        </div>
      )}

    </div>
  );
};
