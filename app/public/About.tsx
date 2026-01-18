
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { AboutPageData, Media } from '../../types';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { t, lang } = useI18n();
  const [data, setData] = useState<AboutPageData | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      const d = await dbService.getAboutData();
      const m = await dbService.getMedia();
      setData(d);
      setMedia(m);
      setLoading(false);
    };
    load();
  }, []);

  const getMediaUrl = (id: string | null, fallback: string) => {
    if (!id) return fallback;
    return media.find(m => m.id === id)?.url || fallback;
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="w-16 h-16 rounded-full" /></div>;
  if (!data) return null;

  return (
    <div className="bg-background text-foreground animate-fade-in">
      
      {/* SECTION A: HERO CINEMATIC */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={getMediaUrl(data.hero.mediaId, 'https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=2000')}
            alt="Atelier Carvello"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold block mb-6 animate-fade-in">
            {t(data.hero.subtitle)}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight animate-slide-up">
            {t(data.hero.title)}
          </h1>
          <p className="text-lg md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up-delayed border-l-2 border-accent pl-6">
            {t(data.hero.text)}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up-delayed">
            <Link to="/cerere-oferta" className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl">
              {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
            </Link>
            <Link to="/portofoliu" className="px-10 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
              {lang === 'ro' ? 'Vezi Portofoliu' : 'View Portfolio'}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION B: MANIFESTO */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent text-[10px] uppercase font-bold tracking-[0.3em] block mb-6">Manifest</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">{t(data.manifesto.title)}</h2>
            <p className="text-xl text-muted font-light leading-relaxed mb-8">
              {t(data.manifesto.text)}
            </p>
            <ul className="space-y-4">
              {data.manifesto.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-foreground/80">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  {t(b)}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] bg-surface-2 overflow-hidden border border-border">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000"
                  alt="Manifesto"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
             </div>
             <div className="absolute -bottom-6 -left-6 bg-surface border border-border p-8 shadow-xl max-w-xs">
                <p className="font-serif italic text-lg">"Nu există proiect prea complex, doar execuție insuficient pregătită."</p>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION C: PILLARS */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.pillars.map((pillar, i) => (
              <div key={i} className="bg-background border border-border p-10 hover:border-accent transition-colors group">
                <div className="text-3xl mb-6 text-accent opacity-50 group-hover:opacity-100">✦</div>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{t(pillar.title)}</h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">{t(pillar.desc)}</p>
                <ul className="space-y-2 border-t border-border pt-6">
                  {pillar.bullets.map((b, idx) => (
                    <li key={idx} className="text-[10px] uppercase font-bold tracking-widest text-muted group-hover:text-foreground transition-colors">
                      • {t(b)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: QUALITY & PROOF */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">{t(data.quality.title)}</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
             {data.quality.bullets.map((b, i) => (
                <span key={i} className="px-4 py-2 border border-border text-[10px] uppercase font-bold tracking-widest text-muted hover:border-accent hover:text-accent transition-colors cursor-default">
                   {t(b)}
                </span>
             ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96 md:h-80">
           {[
             "https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=800", // CNC
             "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", // CAD
             "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800", // Paint
             "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800"  // Install
           ].map((url, i) => (
             <div key={i} className="relative h-full overflow-hidden bg-surface-2 group">
                <OptimizedImage src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
             </div>
           ))}
        </div>
      </section>

      {/* SECTION E: TIMELINE */}
      <section className="py-24 bg-surface-2 px-6 border-y border-border">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
               {data.timeline.map((step, i) => (
                  <div key={i} className="relative md:text-center group">
                     <div className="text-6xl font-serif text-border mb-4 group-hover:text-accent transition-colors">{step.year}</div>
                     <h4 className="font-bold uppercase tracking-widest text-sm mb-2">{t(step.title)}</h4>
                     <p className="text-xs text-muted leading-relaxed">{t(step.desc)}</p>
                     {i < data.timeline.length - 1 && (
                        <div className="hidden md:block absolute top-10 -right-4 w-8 h-[1px] bg-border"></div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION F: CLIENTS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="p-10 border border-border bg-surface hover:border-accent transition-colors group">
               <span className="text-accent text-3xl mb-6 block">🏠</span>
               <h3 className="font-serif text-3xl mb-4">{t(data.clients.resTitle)}</h3>
               <p className="text-muted leading-relaxed mb-8">{t(data.clients.resDesc)}</p>
               <ul className="space-y-2 text-xs font-bold uppercase tracking-widest text-foreground/60">
                  <li>• Custom Kitchens</li>
                  <li>• Walk-in Wardrobes</li>
                  <li>• Luxury Bathrooms</li>
               </ul>
            </div>
            <div className="p-10 border border-border bg-surface hover:border-accent transition-colors group">
               <span className="text-accent text-3xl mb-6 block">🏢</span>
               <h3 className="font-serif text-3xl mb-4">{t(data.clients.comTitle)}</h3>
               <p className="text-muted leading-relaxed mb-8">{t(data.clients.comDesc)}</p>
               <ul className="space-y-2 text-xs font-bold uppercase tracking-widest text-foreground/60">
                  <li>• Office Fit-out</li>
                  <li>• Hotel Lobby & Rooms</li>
                  <li>• Restaurant Bars</li>
               </ul>
            </div>
         </div>
      </section>

      {/* SECTION G: CTA FINAL */}
      <section className="py-32 bg-black text-white text-center px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl mb-8">{t(data.cta.title)}</h2>
            <p className="text-accent text-xs uppercase font-bold tracking-[0.3em] mb-12">
               {t(data.cta.trustLine)}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to="/cerere-oferta" className="px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all shadow-2xl">
                  {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
               </Link>
               <Link to="/contact" className="px-12 py-5 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                  {lang === 'ro' ? 'Contact Rapid' : 'Fast Contact'}
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};
