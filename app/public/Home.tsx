import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Hero } from './components/Hero';
import { HeroConfig } from '../../types';

// --- FALLBACK DATA (Ensure 3 items always) ---
const FALLBACK_PROJECTS = [
  {
    id: 'demo-1',
    title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
    summary: { ro: 'Un proiect minimalist definit prin linii drepte și finisaj 2K negru mat profund.', en: 'Minimalist project defined by straight lines and deep matte black 2K finish.' },
    projectType: 'REZIDENȚIAL',
    location: { ro: 'București', en: 'Bucharest' },
    coverUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'demo-2',
    title: { ro: 'Showroom Luxury', en: 'Luxury Showroom' },
    summary: { ro: 'Panotări CNC complexe pentru un spațiu expozițional auto de lux.', en: 'Complex CNC wall panels for a luxury automotive exhibition space.' },
    projectType: 'COMERCIAL',
    location: { ro: 'Cluj-Napoca', en: 'Cluj-Napoca' },
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'demo-3',
    title: { ro: 'Villa Azure', en: 'Villa Azure' },
    summary: { ro: 'Bucătărie și dressing-uri custom cu inserții de bronz și piatră naturală.', en: 'Custom kitchen and walk-in closets with bronze inserts and natural stone.' },
    projectType: 'REZIDENȚIAL',
    location: { ro: 'Brașov', en: 'Brasov' },
    coverUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200'
  }
];

const TESTIMONIALS = [
  {
    text: "Execuție impecabilă. Canturi perfecte și montaj curat.",
    author: "Arh. Radu M."
  },
  {
    text: "Randarea 3D ne-a ajutat să decidem rapid.",
    author: "Client Rezidențial"
  },
  {
    text: "Seriozitate, calitate, comunicare bună.",
    author: "Dezvoltator Imobiliar"
  }
];

const PILLARS = [
  { title: "CNC Precision", desc: "Frezare, găurire, îmbinări perfecte." },
  { title: "Finisaje Premium", desc: "MDF vopsit 2K, canturi curate, detalii fine." },
  { title: "Randări 3D", desc: "Vezi proiectul înainte de execuție." },
  { title: "Montaj Complet", desc: "Echipă proprie. Responsabilitate cap-coadă." }
];

const PROCESS_STEPS = [
  "Consultanță & măsurători",
  "Proiectare 3D + ofertă",
  "Producție CNC",
  "Finisaje & control calitate",
  "Montaj & predare"
];

const useReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export const Home: React.FC = () => {
  const { t, lang } = useI18n();
  const [displayProjects, setDisplayProjects] = useState<any[]>([]);
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const pillarsReveal = useReveal();
  const projectsReveal = useReveal();

  useEffect(() => {
    document.title = "CARVELLO | Mobilier Premium la Comandă";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await dbService.getSettings();
        setHeroConfig(settings.hero);

        const dbProjects = await dbService.getProjects();
        const media = await dbService.getMedia();
        
        const realProjects = dbProjects
          .filter(p => p.isPublished)
          .map(p => {
            const cover = media.find(m => m.id === p.coverMediaId) || media.find(m => m.projectId === p.id);
            return {
              id: p.id,
              title: p.title,
              summary: p.summary,
              projectType: p.projectType.toUpperCase(),
              location: p.location,
              coverUrl: cover?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000',
              isReal: true
            };
          });

        if (realProjects.length >= 3) {
          setDisplayProjects(realProjects.slice(0, 3));
        } else {
          setDisplayProjects([...realProjects, ...FALLBACK_PROJECTS].slice(0, 3));
        }
      } catch (e) {
        setDisplayProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-0 overflow-x-hidden bg-background text-foreground">
      
      {/* 1) HERO SYSTEM */}
      {heroConfig ? <Hero config={heroConfig} /> : <Skeleton className="h-screen w-full" />}

      {/* 2) SIGNATURE PILLARS */}
      <section className="bg-surface border-y border-border relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div ref={pillarsReveal.ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 transition-all duration-700 ${pillarsReveal.isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            {PILLARS.map((p, i) => (
              <div key={i} className="group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-[1px] bg-accent mb-6 group-hover:w-24 transition-all"></div>
                <h3 className="font-serif text-2xl mb-3">{p.title}</h3>
                <p className="text-sm text-muted font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3) FEATURED PROJECTS */}
      <section className="py-24 md:py-32 bg-background px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={projectsReveal.ref} className={`mb-16 transition-all duration-700 ${projectsReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Portfolio</span>
            <h2 className="font-serif text-4xl md:text-5xl">Proiecte de Referință</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/5] w-full" />)
            ) : (
              displayProjects.map((p) => (
                <div key={p.id} className="group relative bg-surface border border-border overflow-hidden flex flex-col hover:border-accent/40 transition-colors">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <OptimizedImage 
                      src={p.coverUrl} 
                      alt={t(p.title)} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-accent uppercase font-bold tracking-widest mb-3 block">{p.projectType}</span>
                      <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">{t(p.title)}</h3>
                      <p className="text-muted text-sm line-clamp-2 mb-6 font-light">{t(p.summary)}</p>
                    </div>
                    <Link to={p.isReal ? `/proiect/${p.id}` : '/portofoliu'} className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground/20 pb-1 self-start hover:text-accent hover:border-accent transition-all">
                      {lang === 'ro' ? 'Vezi Proiectul' : 'View Project'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4) PROCESS TIMELINE */}
      <section className="py-24 bg-surface px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 relative">
              {/* Connecting line for desktop */}
              <div className="hidden lg:block absolute top-[22px] left-0 w-full h-[1px] bg-border z-0"></div>
              
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col lg:items-center text-left lg:text-center group">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center font-serif text-accent text-lg mb-6 group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                    {i + 1}
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest max-w-[150px] leading-relaxed">
                    {step}
                  </h4>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5) MATERIALS & DETAILS */}
      <section className="py-24 md:py-32 bg-background px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="font-serif text-4xl md:text-5xl mb-8">Materiale & finisaje premium</h2>
             <div className="space-y-6">
               <ul className="space-y-4">
                 {[
                   "MDF vopsit (mat / satinat / lucios)",
                   "PAL premium (Egger / Kronospan)",
                   "Cant ABS / laser edge",
                   "Feronerie Blum / Häfele"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center text-sm font-light text-muted">
                     <span className="w-1.5 h-1.5 bg-accent rounded-full mr-4"></span>
                     {item}
                   </li>
                 ))}
               </ul>
               <p className="text-muted font-light mt-8 border-l-2 border-accent pl-6 italic">
                 "Calitatea nu este un act, ci un obicei. Selectăm riguros fiecare placă și accesoriu."
               </p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-surface-2 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Material Detail" />
            </div>
            <div className="aspect-[3/4] bg-surface-2 overflow-hidden mt-12">
               <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Finish Detail" />
            </div>
          </div>
        </div>
      </section>

      {/* 6) TESTIMONIALS */}
      <section className="py-24 bg-surface border-y border-border px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-background p-8 border border-border">
              <div className="text-accent text-3xl font-serif mb-4">“</div>
              <p className="text-muted font-light italic mb-6 min-h-[60px]">{t.text}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-accent">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7) COMPACT CTA */}
      <section className="py-20 bg-[#080808] px-6 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Transformăm schița ta într-un proiect perfect executat.</h2>
          <p className="text-white/50 text-sm font-light mb-10">Primești răspuns în max. 24h lucrătoare.</p>
          <Link to="/cerere-oferta" className="inline-block px-12 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all duration-300">
            Cere ofertă acum
          </Link>
        </div>
      </section>

    </div>
  );
};
