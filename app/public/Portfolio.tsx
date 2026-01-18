
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
  
  // Filters & Sort
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('newest');

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Portofoliu Proiecte' : 'CARVELLO | Project Portfolio';
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      setProjects(p.filter(proj => proj.isPublished));
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

  const getDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { month: 'JAN', year: '2024' };
    
    // Format: Month (Short) + Year
    const month = d.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'short' }).toUpperCase().replace('.', '');
    const year = d.getFullYear();
    
    return { month, year };
  };

  // Logic
  const categories = ['All', 'Rezidențial', 'Comercial', 'Hotel', 'Office', 'Restaurant'];
  
  const filteredProjects = projects
    .filter(p => activeFilter === 'All' || p.projectType === activeFilter)
    .sort((a, b) => {
      // Priority: Timeline Date -> Published Date
      const dateA = new Date(a.timelineDate || a.publishedAt).getTime();
      const dateB = new Date(b.timelineDate || b.publishedAt).getTime();

      if (activeSort === 'newest') return dateB - dateA;
      if (activeSort === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      if (activeSort === 'az') return a.title.ro.localeCompare(b.title.ro);
      return 0; 
    });

  return (
    <div className="bg-background text-foreground overflow-hidden">
      
      {/* HEADER HERO */}
      <section className="relative pt-40 pb-20 px-6 bg-[#050505] text-white text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
           <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold block mb-4 animate-fade-in">Selected Works</span>
           <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-slide-up">{lang === 'ro' ? 'Portofoliu' : 'Portfolio'}</h1>
           <p className="text-xl text-white/70 font-light max-w-xl mx-auto leading-relaxed animate-slide-up-delayed">
             {lang === 'ro' 
               ? 'Proiecte complete livrate end-to-end: de la concept și randare 3D la CNC, finisaje și montaj.' 
               : 'Complete projects delivered end-to-end: from concept & 3D rendering to CNC, finishes and assembly.'}
           </p>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-md border-b border-border py-4 px-6 shadow-sm">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Filters */}
            <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
               {categories.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveFilter(cat)}
                   className={`text-[10px] uppercase font-bold tracking-widest whitespace-nowrap px-2 py-1 transition-all ${activeFilter === cat ? 'text-accent border-b border-accent' : 'text-muted hover:text-foreground'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
               <span className="text-[9px] uppercase text-muted font-bold tracking-widest mr-2 hidden md:inline">Sort:</span>
               <select 
                 className="bg-transparent text-[10px] uppercase font-bold tracking-widest border border-border px-3 py-2 outline-none focus:border-accent text-foreground cursor-pointer"
                 value={activeSort}
                 onChange={(e) => setActiveSort(e.target.value)}
               >
                 <option value="newest">Cronologic (Dată)</option>
                 <option value="featured">Featured</option>
                 <option value="az">A-Z</option>
               </select>
            </div>
         </div>
      </div>

      {/* TIMELINE SECTION */}
      <section className="py-24 px-4 md:px-0 max-w-[1600px] mx-auto min-h-screen relative">
         
         {/* Central Timeline Axis */}
         <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-px bg-border md:-ml-[0.5px]"></div>

         <div className="space-y-40">
           {loading ? (
             [1, 2, 3].map(i => <div key={i} className="h-96 w-full bg-surface-2 animate-pulse rounded-lg ml-12 md:ml-0 max-w-xl mx-auto"></div>)
           ) : (
             filteredProjects.map((proj, idx) => {
               const dateParts = getDateDisplay(proj.timelineDate || proj.publishedAt);
               return (
               <div key={proj.id} className={`relative flex flex-col md:flex-row items-center w-full group ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Timeline Bullet (Larger with Date) */}
                  <div className="absolute left-12 md:left-1/2 top-0 md:-ml-12 -ml-12 z-20 w-24 h-24 flex items-center justify-center">
                     
                     {/* Outer Ring Effect */}
                     <div className="absolute inset-0 rounded-full border border-accent/20 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out-expo"></div>
                     <div className="absolute inset-0 rounded-full border border-accent/10 scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 delay-100 ease-out-expo"></div>

                     {/* Main Circle */}
                     <div className="w-20 h-20 rounded-full bg-surface border-2 border-border flex flex-col items-center justify-center text-muted transition-all duration-500 group-hover:border-accent group-hover:text-accent group-hover:shadow-[0_0_30px_rgba(184,146,59,0.2)] cursor-default z-10 relative shadow-xl">
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none mb-1">{dateParts.month}</span>
                        <span className="text-lg font-serif font-bold leading-none">{dateParts.year}</span>
                     </div>
                     
                     {/* Horizontal Connector Line */}
                     <div className={`absolute top-1/2 -translate-y-1/2 h-px bg-border w-24 transition-colors duration-500 group-hover:bg-accent/50 ${idx % 2 === 0 ? 'left-full hidden md:block' : 'right-full hidden md:block'}`}></div>
                     {/* Mobile Connector */}
                     <div className="absolute top-1/2 -translate-y-1/2 h-px bg-border w-12 left-full md:hidden"></div>
                  </div>

                  {/* Content Card Side */}
                  <div className={`w-full md:w-1/2 pl-32 md:pl-0 ${idx % 2 === 0 ? 'md:pr-32 md:text-right items-end' : 'md:pl-32 md:text-left items-start'} flex flex-col`}>
                     <Link to={`/proiect/${proj.slug || proj.id}`} className="block w-full">
                        
                        {/* Image Card */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2 border border-border shadow-sm mb-6 group-hover:border-accent/40 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                           <OptimizedImage 
                              src={getCoverUrl(proj.id, proj.coverMediaId)} 
                              alt={t(proj.title)} 
                              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                           />
                           {/* Hover Reveal Overlay */}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                              <span className="px-8 py-3 bg-white text-black text-[10px] uppercase font-bold tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl hover:bg-accent hover:text-white">
                                {lang === 'ro' ? 'Vezi Detalii' : 'View Details'}
                              </span>
                           </div>
                        </div>
                        
                        {/* Text Details */}
                        <div className={`flex flex-col ${idx % 2 === 0 ? 'md:items-end' : 'md:items-start'} items-start`}>
                           <div className="flex gap-3 mb-2 items-center">
                              <span className="text-[9px] uppercase tracking-widest font-bold text-accent">{proj.projectType}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-muted">•</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-muted">{t(proj.location)}</span>
                           </div>
                           
                           <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight group-hover:text-accent transition-colors duration-300">{t(proj.title)}</h2>
                           
                           <p className="text-sm text-muted font-light leading-relaxed mb-6 max-w-lg line-clamp-2">
                              {t(proj.summary)}
                           </p>

                           {/* Chips */}
                           <div className={`flex flex-wrap gap-2 mb-6 ${idx % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                              {proj.tags?.slice(0,3).map((tag, i) => (
                                <span key={i} className="px-3 py-1 border border-border text-[9px] uppercase font-bold text-muted bg-surface-2 tracking-widest group-hover:border-accent/30 transition-colors">
                                  {tag}
                                </span>
                              ))}
                           </div>
                        </div>
                     </Link>
                  </div>

                  {/* Empty Spacer Side (Zig-Zag) */}
                  <div className="hidden md:block w-1/2"></div>
               </div>
             )})
           )}
         </div>
      </section>

      {/* CTA Stickyish */}
      <div className="fixed bottom-6 right-6 z-40">
         <Link to="/cerere-oferta" className="flex items-center gap-3 bg-accent text-white px-6 py-4 rounded-none shadow-2xl hover:bg-black transition-colors group border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}</span>
            <span className="bg-white text-accent rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:rotate-45 transition-transform">↗</span>
         </Link>
      </div>

    </div>
  );
};
