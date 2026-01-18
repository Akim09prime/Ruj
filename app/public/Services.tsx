
import React, { useEffect, useState, useRef } from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { AIExpert } from './AIExpert';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { dbService } from '../../services/db';
import { ServicePage, Media } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';

export const Services: React.FC = () => {
  const { lang, t } = useI18n();
  const [services, setServices] = useState<ServicePage[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);

  // Refs for scroll observation
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Servicii Premium' : 'CARVELLO | Premium Services';
    window.scrollTo(0, 0);

    const loadData = async () => {
      const s = await dbService.getServices();
      const m = await dbService.getMedia();
      setServices(s.filter(x => x.isPublished));
      setMedia(m);
      if (s.length > 0) setActiveTab(s[0].id);
      setLoading(false);
    };
    loadData();
  }, [lang]);

  // Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el as Element);
    });

    return () => observer.disconnect();
  }, [services]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // sticky header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  const getImageUrl = (mediaId: string | null) => {
    if (!mediaId) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200';
    return media.find(m => m.id === mediaId)?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200';
  };

  return (
    <div className="bg-background text-foreground overflow-hidden">
      
      {/* 1) CINEMATIC HERO */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold block mb-6 animate-fade-in">
            {lang === 'ro' ? 'Expertiza Noastră' : 'Our Expertise'}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight animate-slide-up">
            {lang === 'ro' ? 'Tehnologie & Artizanat.' : 'Technology & Craft.'}
          </h1>
          <p className="text-lg md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up-delayed">
            {lang === 'ro' 
              ? 'Îmbinăm tehnologia digitală cu execuția artizanală pentru mobilier la comandă, finisaje premium și precizie CNC.'
              : 'Blending digital technology with artisanal execution for custom furniture, premium finishes, and CNC precision.'}
          </p>
        </div>
      </section>

      {/* 2) STICKY NAVIGATION HUB */}
      <div className="sticky top-24 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
         <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-8 md:gap-12 min-w-max">
               {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`py-6 text-[10px] uppercase font-bold tracking-widest transition-all relative ${activeTab === s.id ? 'text-accent' : 'text-muted hover:text-foreground'}`}
                  >
                     {t(s.title)}
                     <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent transition-transform duration-300 origin-left ${activeTab === s.id ? 'scale-x-100' : 'scale-x-0'}`}></span>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* 3) MAIN SERVICES SECTIONS */}
      <div className="py-20 space-y-32">
        {loading ? [1,2,3].map(i => <div key={i} className="max-w-7xl mx-auto px-6 h-96 bg-surface-2 animate-pulse"></div>) : (
           services.map((service, idx) => (
            <section 
               key={service.id} 
               id={service.id} 
               ref={(el) => (sectionRefs.current[service.id] = el)}
               className="max-w-7xl mx-auto px-6 scroll-mt-40"
            >
              <div className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute -inset-4 border border-border opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"></div>
                  <div className="aspect-[4/3] overflow-hidden relative bg-surface-2 shadow-2xl">
                    <OptimizedImage 
                      src={getImageUrl(service.heroMediaId)} 
                      alt={t(service.title)} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity"></div>
                    
                    {/* Floating Detail */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-4 border-l-2 border-accent text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                       <span className="text-[9px] uppercase font-bold tracking-widest">{t(service.subtitle)}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <span className="text-accent uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block">
                    0{idx + 1} — {t(service.subtitle)}
                  </span>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                    {t(service.title)}
                  </h2>
                  <p className="text-muted text-lg leading-relaxed mb-8 font-light border-l-2 border-border pl-6">
                    {t(service.shortDescription)}
                  </p>
                  
                  <ul className="space-y-4 mb-10">
                    {service.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 group">
                        <span className="text-accent mt-1 transition-transform group-hover:scale-125">✦</span>
                        <span>{t(bullet)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-6">
                     <Link to={`/servicii/${service.slug}`} className="px-8 py-4 bg-foreground text-background text-[10px] uppercase font-bold tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl">
                        {lang === 'ro' ? 'Vezi Detalii' : 'View Details'}
                     </Link>
                     <Link to={`/cerere-oferta?service=${service.slug}`} className="px-8 py-4 border border-foreground/20 text-foreground text-[10px] uppercase font-bold tracking-widest hover:border-accent hover:text-accent transition-all">
                        {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
                     </Link>
                  </div>
                </div>

              </div>
            </section>
          ))
        )}
      </div>

      {/* 4) AI EXPERT SECTION */}
      <section className="py-24 bg-surface border-y border-border">
         <div className="max-w-4xl mx-auto px-6">
            <AIExpert />
         </div>
      </section>

      {/* 5) FINAL CINEMATIC CTA */}
      <section className="relative py-32 px-6 text-center overflow-hidden bg-black">
         <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="" />
         </div>
         <div className="absolute inset-0 bg-black/60"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
              {lang === 'ro' ? 'Vrei un proiect similar?' : 'Want a similar project?'}
            </h2>
            <p className="text-white/70 text-lg font-light mb-12 leading-relaxed">
              {lang === 'ro' 
                ? 'Scrie-ne și îți trimitem o estimare + un plan clar de execuție.' 
                : 'Write to us and we will send you an estimate + a clear execution plan.'}
            </p>
            <Link to="/cerere-oferta" className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all shadow-2xl">
              {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
            </Link>
         </div>
      </section>

    </div>
  );
};
