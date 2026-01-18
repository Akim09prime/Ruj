
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const Portfolio: React.FC = () => {
  const { t, lang } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Portofoliu Proiecte' : 'CARVELLO | Project Portfolio';
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      // Sort by timelineDate descending
      setProjects(p.filter(proj => proj.isPublished).sort((a, b) => {
        const dateA = a.timelineDate || a.publishedAt;
        const dateB = b.timelineDate || b.publishedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }));
      setMedia(m);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCoverUrl = (projectId: string, coverId: string | null) => {
    if (coverId) {
      const found = media.find(m => m.id === coverId);
      if (found) return found.url;
    }
    const first = media.find(m => m.projectId === projectId);
    return first ? first.url : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758';
  };

  const getYear = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '2024' : d.getFullYear();
  };

  const getMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = lang === 'ro' 
      ? ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return isNaN(d.getTime()) ? '' : months[d.getMonth()];
  };

  return (
    <div className="bg-background text-foreground overflow-hidden">
      
      {/* HEADER HERO */}
      <section className="relative py-32 px-6 bg-[#050505] text-white text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
           <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-slide-up">{lang === 'ro' ? 'Portofoliu' : 'Portfolio'}</h1>
           <p className="text-xl text-white/70 font-light max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delayed">
             {lang === 'ro' 
               ? 'Proiecte complete livrate end-to-end: de la concept & randare 3D la CNC, finisaje și montaj.' 
               : 'Complete projects delivered end-to-end: from concept & 3D rendering to CNC, finishes and assembly.'}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
             <Link to="/cerere-oferta" className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl shadow-accent/20">
               {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
             </Link>
             <button onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
               {lang === 'ro' ? 'Vezi Proiecte' : 'View Projects'}
             </button>
           </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section id="timeline" className="py-24 px-4 md:px-0 relative max-w-7xl mx-auto">
         {/* Vertical Line (Desktop Centered, Mobile Left) */}
         <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent md:-ml-[0.5px]"></div>

         <div className="space-y-32">
           {loading ? (
             [1, 2, 3].map(i => <div key={i} className="h-96 w-full bg-surface-2 animate-pulse rounded-lg ml-12 md:ml-0 max-w-xl mx-auto"></div>)
           ) : (
             projects.map((proj, idx) => (
               <div key={proj.id} className={`relative flex flex-col md:flex-row items-center w-full group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Badge Date */}
                  <div className="absolute left-8 md:left-1/2 top-0 md:-ml-6 -ml-6 z-10">
                     <div className="w-12 h-12 rounded-full bg-background border border-accent flex flex-col items-center justify-center shadow-lg shadow-accent/10 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-[8px] font-bold text-accent leading-none">{getYear(proj.timelineDate || proj.publishedAt)}</span>
                        <span className="text-[7px] font-bold text-muted uppercase leading-none mt-0.5">{getMonth(proj.timelineDate || proj.publishedAt)}</span>
                     </div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20 md:text-left'} text-left`}>
                     <Link to={`/proiect/${proj.slug || proj.id}`} className="block group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2 border border-border shadow-sm mb-6">
                           <OptimizedImage 
                              src={getCoverUrl(proj.id, proj.coverMediaId)} 
                              alt={t(proj.title)} 
                              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="px-6 py-2 border border-white text-white text-[10px] uppercase font-bold tracking-widest bg-black/30 backdrop-blur-sm">
                                {lang === 'ro' ? 'Vezi Detalii' : 'View Details'}
                              </span>
                           </div>
                        </div>
                        
                        <div className={`flex flex-col ${idx % 2 === 0 ? 'md:items-end' : 'md:items-start'} items-start`}>
                           <div className="flex gap-3 mb-3">
                              <span className="text-[9px] uppercase tracking-widest font-bold text-accent">{proj.projectType}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-muted">•</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-muted">{t(proj.location)}</span>
                           </div>
                           <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight group-hover:text-accent transition-colors">{t(proj.title)}</h2>
                           <p className="text-sm text-muted font-light leading-relaxed max-w-md line-clamp-3 mb-6">
                              {t(proj.summary)}
                           </p>
                           
                           {proj.metrics && (
                             <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-surface-2 border border-border text-[9px] uppercase tracking-widest text-muted font-bold">{proj.metrics.duration}</span>
                                <span className="px-3 py-1 bg-surface-2 border border-border text-[9px] uppercase tracking-widest text-muted font-bold">{proj.metrics.finish}</span>
                             </div>
                           )}
                        </div>
                     </Link>
                  </div>

                  {/* Empty Spacer for Zig-Zag */}
                  <div className="w-full md:w-1/2"></div>
               </div>
             ))
           )}
         </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-24 bg-[#080808] text-center border-t border-white/10 px-6">
         <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl text-white mb-6">{lang === 'ro' ? 'Vrei un proiect similar?' : 'Want a similar project?'}</h2>
            <p className="text-white/60 mb-10 font-light">{lang === 'ro' ? 'Discută cu echipa noastră tehnică.' : 'Talk to our technical team.'}</p>
            <Link to="/cerere-oferta" className="inline-block px-12 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all">
               {lang === 'ro' ? 'Contactează-ne' : 'Contact Us'}
            </Link>
         </div>
      </section>

    </div>
  );
};
