
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { ServicePage, Media, Project } from '../../types';
import { useI18n } from '../../lib/i18n';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const [service, setService] = useState<ServicePage | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const s = await dbService.getServiceBySlug(slug);
      if (s) {
        setService(s);
        // Get media for hero
        const allMedia = await dbService.getMedia();
        setMedia(allMedia);
        
        // Get related projects by tags
        const allProjects = await dbService.getProjects();
        const related = allProjects.filter(p => 
           p.isPublished && p.tags?.some(tag => s.relatedProjectTags.includes(tag))
        );
        setRelatedProjects(related);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0,0);
  }, [slug]);

  const getMediaUrl = (id: string | null) => {
    if (!id) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758';
    return media.find(m => m.id === id)?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758';
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="w-16 h-16 rounded-full" /></div>;
  if (!service) return <Navigate to="/servicii" replace />;

  return (
    <div className="bg-background text-foreground animate-fade-in">
      
      {/* 1) CINEMATIC HERO */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
           <OptimizedImage 
             src={getMediaUrl(service.heroMediaId)} 
             alt={t(service.title)} 
             className="w-full h-full object-cover animate-slow-zoom"
           />
           <div className="absolute inset-0 bg-black/50"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 max-w-7xl mx-auto text-white">
           <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-6 block animate-fade-in">
             Service Overview
           </span>
           <h1 className="font-serif text-5xl md:text-8xl mb-8 leading-none animate-slide-up">
             {t(service.title)}
           </h1>
           <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl leading-relaxed mb-12 animate-slide-up-delayed border-l-4 border-accent pl-6">
             {t(service.fullDescription)}
           </p>
           <div className="flex gap-4 animate-slide-up-delayed">
              <Link to={`/cerere-oferta?service=${service.slug}`} className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl">
                 {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
              </Link>
           </div>
        </div>
      </section>

      {/* 2) FEATURES CARDS (What you get) */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-20 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.features.map((f, i) => (
               <div key={i} className="bg-surface p-10 border border-border shadow-2xl hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{t(f.title)}</h3>
                  <p className="text-muted text-sm leading-relaxed">{t(f.desc)}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 3) PROCESS TIMELINE */}
      <section className="py-24 bg-surface-2 px-6 border-y border-border">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-4">Workflow</span>
               <h2 className="font-serif text-4xl md:text-5xl">{lang === 'ro' ? 'Procesul de Execuție' : 'Execution Process'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {service.processSteps.map((step, i) => (
                  <div key={i} className="relative pl-8 border-l border-border md:border-l-0 md:border-t md:pt-8 md:pl-0 group">
                     <span className="absolute -left-[5px] top-0 md:left-0 md:-top-[5px] w-2.5 h-2.5 bg-accent rounded-full"></span>
                     <span className="text-4xl font-serif text-border absolute top-4 right-4 md:top-8 group-hover:text-accent/20 transition-colors">0{i+1}</span>
                     <h4 className="font-bold uppercase tracking-widest text-sm mb-3">{t(step.title)}</h4>
                     <p className="text-sm text-muted leading-relaxed">{t(step.desc)}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4) RELATED PROJECTS (Filtered Gallery) */}
      {relatedProjects.length > 0 && (
         <section className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Portfolio</span>
                  <h2 className="font-serif text-4xl">{lang === 'ro' ? 'Proiecte Relevante' : 'Related Projects'}</h2>
               </div>
               <Link to="/portofoliu" className="text-xs uppercase font-bold tracking-widest hover:text-accent underline">
                  {lang === 'ro' ? 'Vezi Tot Portofoliul' : 'View All Portfolio'}
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {relatedProjects.slice(0, 4).map(p => {
                  const cover = media.find(m => m.id === p.coverMediaId)?.url;
                  return (
                     <Link key={p.id} to={`/proiect/${p.slug || p.id}`} className="group relative aspect-[16/10] overflow-hidden bg-surface-2 border border-border">
                        <OptimizedImage src={cover || ''} alt={t(p.title)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-8">
                           <span className="text-accent text-[9px] uppercase font-bold tracking-widest mb-2">{p.projectType}</span>
                           <h3 className="text-white font-serif text-3xl mb-4">{t(p.title)}</h3>
                           <span className="px-6 py-2 border border-white text-white text-[9px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                              {lang === 'ro' ? 'Vezi Proiect' : 'View Project'}
                           </span>
                        </div>
                     </Link>
                  )
               })}
            </div>
         </section>
      )}

      {/* 5) FAQ */}
      {service.faq.length > 0 && (
         <section className="py-24 bg-surface border-t border-border px-6">
            <div className="max-w-3xl mx-auto">
               <h3 className="font-serif text-3xl mb-12 text-center">{lang === 'ro' ? 'Întrebări Frecvente' : 'FAQ'}</h3>
               <div className="space-y-6">
                  {service.faq.map((qa, i) => (
                     <div key={i} className="border border-border p-8 bg-surface-2 hover:border-accent transition-colors">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-3">
                           <span className="text-accent">Q.</span> {t(qa.question)}
                        </h4>
                        <p className="text-muted text-sm leading-relaxed pl-6 border-l border-border">
                           {t(qa.answer)}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      )}

      {/* 6) CTA */}
      <section className="py-32 px-6 text-center bg-black relative overflow-hidden">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">{lang === 'ro' ? 'Discută despre proiectul tău' : 'Discuss your project'}</h2>
            <p className="text-white/60 mb-12 font-light">
               {lang === 'ro' ? 'Consultanții noștri tehnici sunt pregătiți să ofere soluții concrete.' : 'Our technical consultants are ready to offer concrete solutions.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to={`/cerere-oferta?service=${service.slug}`} className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all">
                  {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
               </Link>
               <Link to="/contact" className="px-10 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                  {lang === 'ro' ? 'Contact Rapid' : 'Fast Contact'}
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};
