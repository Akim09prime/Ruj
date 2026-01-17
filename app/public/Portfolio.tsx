
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Helmet } from 'react-helmet-async';

export const Portfolio: React.FC = () => {
  const { t, lang } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      setProjects(p.filter(proj => proj.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
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

  return (
    <div className="pt-0 pb-24">
      <Helmet>
        <title>{lang === 'ro' ? 'Portofoliu CARVELLO | Proiecte Rezidențiale & Comerciale' : 'CARVELLO Portfolio | Residential & Commercial Projects'}</title>
        <meta name="description" content={lang === 'ro' ? 'Explorează portofoliul CARVELLO: amenajări interioare de lux, mobilier CNC și finisaje premium.' : 'Explore the CARVELLO portfolio: luxury interior design, CNC furniture, and premium finishes.'} />
      </Helmet>
      
      <section className="relative h-[75vh] flex items-center overflow-hidden bg-[#050505] mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format,compress&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60 grayscale scale-110 animate-slow-zoom"
            alt="Carvello Architectural Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-4 mb-6 animate-fade-in">
              <div className="w-12 h-[1px] bg-accent"></div>
              <span className="text-accent uppercase tracking-[0.5em] text-[10px] font-bold">
                {lang === 'ro' ? 'CRONOLOGIA EXCELENȚEI' : 'TIMELINE OF EXCELLENCE'}
              </span>
            </div>
            <h1 className="font-serif text-6xl md:text-9xl leading-[0.9] mb-8 animate-slide-up">
              {lang === 'ro' ? 'Portofoliu' : 'Portfolio'}
            </h1>
            <p className="text-lg md:text-2xl font-light max-w-xl text-white/60 leading-relaxed animate-slide-up-delayed italic font-serif">
              {lang === 'ro' 
                ? 'Fiecare piesă este o dovadă a preciziei noastre. De la concept digital la realitate tactilă.' 
                : 'Every piece is a testament to our precision. From digital concept to tactile reality.'}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-12 hidden lg:block select-none pointer-events-none overflow-hidden">
          <span className="font-serif text-[18vw] leading-none text-white/[0.03] uppercase tracking-tighter block transform translate-y-1/4">
            Archives
          </span>
        </div>
        <div className="absolute bottom-0 left-[88px] md:left-[144px] w-[1px] h-32 bg-gradient-to-t from-accent to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="relative border-l border-border/30 pl-8 md:pl-24 space-y-40">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="md:col-span-7">
                  <Skeleton className="aspect-[16/10] w-full" />
                </div>
              </div>
            ))
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className="relative group animate-fade-in">
                <div className="absolute -left-[41px] md:-left-[105px] top-2 w-5 h-5 rounded-full bg-accent border-4 border-background group-hover:scale-150 transition-all duration-700 shadow-xl shadow-accent/20 z-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                  <div className="md:col-span-5">
                    <div className="flex items-center space-x-4 mb-6">
                       <span className="text-[10px] font-mono text-accent bg-accent/10 px-3 py-1">
                        {new Date(proj.publishedAt).getFullYear()}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
                        {proj.projectType}
                      </span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 group-hover:text-accent transition-colors duration-500 leading-tight">
                      {t(proj.title)}
                    </h2>
                    <p className="text-muted mb-10 line-clamp-3 font-light leading-relaxed text-lg border-l border-accent/20 pl-6">
                      {t(proj.summary)}
                    </p>
                    <Link 
                      to={`/proiect/${proj.id}`} 
                      className="group/btn inline-flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-accent transition-all"
                    >
                      <span>{lang === 'ro' ? 'Explorează Detalii' : 'Explore Details'}</span>
                      <div className="w-8 h-[1px] bg-foreground group-hover/btn:w-16 group-hover/btn:bg-accent transition-all duration-500"></div>
                    </Link>
                  </div>
                  <div className="md:col-span-7 shadow-2xl group-hover:shadow-accent/10 transition-all duration-700">
                    <OptimizedImage 
                      src={getCoverUrl(proj.id, proj.coverMediaId)} 
                      alt={t(proj.title)}
                      aspectRatio="aspect-[16/10]"
                      className="border border-border/50 group-hover:border-accent/30"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && projects.length === 0 && (
            <div className="py-24 text-center border border-dashed border-border/50 rounded-lg">
               <p className="font-serif text-3xl text-muted/40 italic">Arhiva este în curs de actualizare...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
