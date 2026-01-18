
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Project, Media, Lead } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams(); // slug or id
  const { t, lang } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [projectMedia, setProjectMedia] = useState<Media[]>([]); 
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<Media[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<Media[]>([]);
  
  // Feedback
  const [feedbacks, setFeedbacks] = useState<Lead[]>([]);
  const [newFeedback, setNewFeedback] = useState({ name: '', email: '', message: '', rating: 5 });
  const [fbStatus, setFbStatus] = useState<'idle'|'sending'|'sent'>('idle');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      let p = await dbService.getProjectBySlug(id);
      if (!p) p = await dbService.getProject(id);

      if (p) {
        setProject(p);
        const m = await dbService.getMedia(p.id);
        setProjectMedia(m);
        if (p.stages && p.stages.length > 0) setActiveStageId(p.stages[0].id);
        
        // Filter main gallery images (kind=image, and usually Stage=Final or high stars)
        setGalleryImages(m.filter(x => x.kind === 'image' && x.stage === 'Final'));

        const allLeads = await dbService.getLeads();
        const approved = allLeads.filter(l => l.type === 'project-feedback' && l.projectRef?.id === p.id && l.status === 'approved');
        setFeedbacks(approved);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setFbStatus('sending');
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'project-feedback',
      projectRef: { id: project.id, title: t(project.title) },
      rating: newFeedback.rating,
      name: newFeedback.name,
      email: newFeedback.email,
      phone: '-',
      city: '-',
      projectType: 'Feedback',
      message: newFeedback.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    await dbService.addLead(lead);
    setTimeout(() => setFbStatus('sent'), 800);
  };

  const openLightbox = (images: Media[], index: number) => {
    setLightboxMedia(images);
    setLightboxIndex(index);
  };

  const getMediaUrl = (id?: string) => projectMedia.find(m => m.id === id)?.url;

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="w-12 h-12 rounded-full" /></div>;
  if (!project) return <Navigate to="/portofoliu" replace />;

  const activeStage = project.stages?.find(s => s.id === activeStageId);
  const metrics = project.metrics || { duration: '-', finish: '-', materials: '-', hardware: '-', services: [] };

  return (
    <div className="pt-0 bg-background text-foreground animate-fade-in">
      
      {/* 1) CINEMATIC HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        {project.heroConfig?.mode === 'video' && project.heroConfig.videoId ? (
           <video 
             autoPlay muted loop playsInline 
             className="absolute inset-0 w-full h-full object-cover scale-105"
             poster={getMediaUrl(project.heroConfig.posterId)}
           >
             <source src={getMediaUrl(project.heroConfig.videoId)} type="video/mp4" />
           </video>
        ) : (
           <div className="absolute inset-0 animate-slow-zoom">
             <OptimizedImage 
               src={getMediaUrl(project.heroConfig?.imageId) || getMediaUrl(project.coverMediaId) || ''} 
               alt="Hero" 
               className="w-full h-full object-cover"
             />
           </div>
        )}
        
        <div className="absolute inset-0 bg-black" style={{ opacity: (project.heroConfig?.overlay.intensity || 40) / 100 }}></div>
        {project.heroConfig?.overlay.vignette && <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,black_140%)]"></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 max-w-[1400px] mx-auto text-white">
           <div className="animate-slide-up backdrop-blur-sm bg-black/10 p-8 border-l-2 border-accent max-w-4xl">
             <div className="flex flex-wrap gap-6 mb-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-90">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>{t(project.location)}</span>
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>{new Date(project.publishedAt).getFullYear()}</span>
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>{project.projectType}</span>
                <span className="flex items-center gap-2 text-accent"><span className="w-1 h-1 bg-accent rounded-full"></span>{metrics.duration}</span>
             </div>
             <h1 className="font-serif text-5xl md:text-8xl leading-[0.9] mb-8 drop-shadow-lg">{t(project.title)}</h1>
             <div className="flex gap-4">
               <Link to={`/cerere-oferta?ref=${project.slug}`} className="px-8 py-4 bg-accent text-white hover:bg-white hover:text-black transition-all text-[10px] uppercase font-bold tracking-widest shadow-xl">
                  {lang === 'ro' ? 'Vreau o ofertă similară' : 'Get Similar Quote'}
               </Link>
               <button className="px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
                  Download PDF
               </button>
             </div>
           </div>
        </div>
      </section>

      {/* 2) MAGAZINE GRID STORY */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto border-b border-border">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-12">
               <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">01. The Challenge</span>
                  <p className="font-serif text-2xl leading-relaxed text-foreground">
                    "{project.clientBrief ? t(project.clientBrief) : t(project.summary)}"
                  </p>
               </div>
               <div className="w-full h-[1px] bg-border"></div>
               <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">02. Execution</span>
                  <p className="text-sm font-light leading-loose text-muted">
                    {project.ourSolution ? t(project.ourSolution) : "Precizie milimetrică."}
                  </p>
               </div>
            </div>
            <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="aspect-[16/8] bg-surface-2 overflow-hidden mb-8 border border-border">
                   <img src={getMediaUrl(projectMedia.find(m=>m.kind==='image' && m.room === 'Living')?.id) || getMediaUrl(project.coverMediaId)} className="w-full h-full object-cover" alt="Detail" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-4">03. The Result</span>
                      <p className="text-sm font-light leading-loose text-muted">{project.result ? t(project.result) : "Un spațiu perfect."}</p>
                   </div>
                   <div className="border-l border-border pl-8">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-4">Tech Highlights</span>
                      <ul className="space-y-2">
                         {project.tags?.map((tag, i) => (
                           <li key={i} className="text-xs text-muted uppercase tracking-widest">• {tag}</li>
                         ))}
                      </ul>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* 3) PREMIUM TIMELINE */}
      {project.stages && project.stages.length > 0 && (
        <section className="bg-surface relative py-24 border-b border-border">
           <div className="max-w-[1400px] mx-auto px-6">
              <h2 className="font-serif text-4xl mb-16 text-center">{lang === 'ro' ? 'Etapele Proiectului' : 'Project Stages'}</h2>
              
              <div className="relative">
                 {/* Vertical Line */}
                 <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-[1px] bg-border -ml-[0.5px]"></div>

                 <div className="space-y-24">
                    {project.stages.map((stage, idx) => (
                       <div key={stage.id} className={`flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                          
                          {/* Dot */}
                          <div className="absolute left-4 lg:left-1/2 top-0 w-3 h-3 bg-accent rounded-full -ml-[5.5px] border-2 border-background z-10"></div>

                          {/* Content Side */}
                          <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${idx % 2 !== 0 ? 'lg:pl-12 text-left' : 'lg:text-right lg:pr-12'}`}>
                             <span className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2 block">{stage.dateLabel}</span>
                             <h3 className="font-serif text-3xl mb-4">{t(stage.title)}</h3>
                             <p className="text-muted text-sm leading-relaxed mb-6 max-w-md ml-auto mr-auto lg:mx-0">{t(stage.description)}</p>
                             <ul className={`space-y-1 ${idx % 2 !== 0 ? '' : 'lg:flex lg:flex-col lg:items-end'}`}>
                                {stage.highlights.map((h, i) => (
                                  <li key={i} className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">• {h}</li>
                                ))}
                             </ul>
                          </div>

                          {/* Image Side */}
                          <div className="w-full lg:w-1/2 pl-12 lg:pl-0">
                             <div className="aspect-video bg-surface-2 border border-border p-2 shadow-sm hover:border-accent transition-colors group">
                                <div className="w-full h-full overflow-hidden relative">
                                   <img src={getMediaUrl(stage.media.coverId)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* 4) MASTER GALLERY (Main + Thumbs) */}
      <section className="py-32 px-6 max-w-[1600px] mx-auto">
         <div className="flex justify-between items-end mb-12">
            <div>
               <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Visual Archive</span>
               <h2 className="font-serif text-4xl">{lang === 'ro' ? 'Galerie Finală' : 'Final Gallery'}</h2>
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-muted">{galleryImages.length} Photos</span>
         </div>

         {galleryImages.length > 0 && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
              {/* Main Image */}
              <div 
                className="lg:col-span-2 h-full bg-surface-2 overflow-hidden relative group cursor-zoom-in"
                onClick={() => openLightbox(galleryImages, 0)}
              >
                 <img src={galleryImages[0].url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs uppercase tracking-widest font-bold border border-white px-4 py-2">View Fullscreen</span>
                 </div>
              </div>
              
              {/* Thumbnails Column */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 h-full overflow-y-auto scrollbar-hide">
                 {galleryImages.slice(1).map((img, i) => (
                   <div 
                     key={img.id} 
                     className="bg-surface-2 aspect-[4/3] overflow-hidden relative group cursor-zoom-in"
                     onClick={() => openLightbox(galleryImages, i + 1)}
                   >
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                 ))}
              </div>
           </div>
         )}
      </section>

      {/* 5) TECH SPEC SHEET */}
      <section className="py-24 bg-surface px-6 border-y border-border">
         <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-12">
               <h3 className="font-serif text-3xl">{lang === 'ro' ? 'Fișa Tehnică' : 'Tech Sheet'}</h3>
               <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-accent border border-accent/20 px-6 py-3 hover:bg-accent hover:text-white transition-all">
                  <span>↓</span> Download PDF Spec
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-0">
               {project.techSpecs ? project.techSpecs.map((spec, i) => (
                 <div key={i} className="flex justify-between py-4 border-b border-border items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60 w-1/3">{spec.label}</span>
                    <span className="text-sm font-medium text-foreground w-2/3 text-right">{spec.value}</span>
                 </div>
               )) : (
                 <div className="py-4 text-muted text-sm italic">Fără specificații detaliate.</div>
               )}
            </div>
         </div>
      </section>

      {/* 6) FEEDBACK */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
         <div className="text-center mb-16">
            <h3 className="font-serif text-4xl mb-4">Recenzii Client</h3>
            <p className="text-muted font-light">Experiența colaborării cu echipa Carvello.</p>
         </div>

         {/* Existing Reviews */}
         <div className="grid gap-8 mb-20">
            {feedbacks.length > 0 ? feedbacks.map(fb => (
               <div key={fb.id} className="bg-surface-2 p-10 border border-border relative">
                  <div className="flex text-accent text-sm mb-4">{'★'.repeat(fb.rating || 5)}</div>
                  <p className="text-xl font-serif italic mb-6 text-foreground/80 leading-relaxed">"{fb.message}"</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">{fb.name} — {t(project.title)}</p>
               </div>
            )) : <p className="text-center text-muted italic">Fii primul care lasă o recenzie.</p>}
         </div>

         {/* Form */}
         <div className="bg-surface border border-border p-12 shadow-lg">
            <h4 className="text-xs uppercase font-bold tracking-widest mb-8 border-b border-border pb-4">Lasă o recenzie</h4>
            {fbStatus === 'sent' ? (
                 <div className="bg-green-500/10 p-6 text-green-600 text-sm font-bold border border-green-500/20 text-center">
                   Mulțumim! Recenzia ta a fost trimisă spre aprobare.
                 </div>
            ) : (
               <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="flex gap-2 mb-4">
                     {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setNewFeedback({...newFeedback, rating: star})} className={`text-2xl transition-colors ${star <= newFeedback.rating ? 'text-accent' : 'text-border'}`}>★</button>
                     ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <input className="bg-background border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Numele tău" required value={newFeedback.name} onChange={e => setNewFeedback({...newFeedback, name: e.target.value})} />
                     <input className="bg-background border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Email (privat)" required value={newFeedback.email} onChange={e => setNewFeedback({...newFeedback, email: e.target.value})} />
                  </div>
                  <textarea className="w-full bg-background border border-border p-4 text-xs outline-none h-32 focus:border-accent resize-none" placeholder="Descrie experiența ta..." required value={newFeedback.message} onChange={e => setNewFeedback({...newFeedback, message: e.target.value})} />
                  <button className="w-full bg-foreground text-background py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-accent transition-colors">
                     {fbStatus === 'sending' ? 'Se trimite...' : 'Trimite Recenzia'}
                  </button>
               </form>
            )}
         </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && lightboxMedia[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex flex-col justify-center animate-fade-in" onKeyDown={(e) => { if(e.key==='Escape') setLightboxIndex(null); }} tabIndex={0}>
           <button className="absolute top-6 right-6 text-white text-4xl hover:text-accent z-50 p-4" onClick={() => { setLightboxIndex(null); setLightboxMedia([]); }}>×</button>
           
           <div className="flex-grow flex items-center justify-center relative px-20">
              <button 
                className="absolute left-4 text-white text-5xl p-6 hover:text-accent transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + lightboxMedia.length) % lightboxMedia.length); }}
              >‹</button>
              
              <img src={lightboxMedia[lightboxIndex].url} className="max-h-[85vh] max-w-full object-contain shadow-2xl" alt="" />
              
              <button 
                className="absolute right-4 text-white text-5xl p-6 hover:text-accent transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % lightboxMedia.length); }}
              >›</button>
           </div>
           
           <div className="h-20 flex flex-col items-center justify-center text-white pb-6">
              <span className="text-xs uppercase tracking-widest font-bold mb-2">Image {lightboxIndex + 1} / {lightboxMedia.length}</span>
              <p className="text-sm font-serif italic text-white/60">{t(lightboxMedia[lightboxIndex].caption) || ''}</p>
           </div>
        </div>
      )}

    </div>
  );
};
