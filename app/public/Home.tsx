import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

// --- FALLBACK DATA ---
const FALLBACK_PROJECTS = [
  {
    id: 'demo-1',
    title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
    summary: { ro: 'Un proiect minimalist definit prin linii drepte și finisaj 2K negru mat profund.', en: 'Minimalist project defined by straight lines and deep matte black 2K finish.' },
    projectType: 'Rezidențial',
    location: { ro: 'București', en: 'Bucharest' },
    coverUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'demo-2',
    title: { ro: 'Showroom Luxury', en: 'Luxury Showroom' },
    summary: { ro: 'Panotări CNC complexe pentru un spațiu expozițional auto de lux.', en: 'Complex CNC wall panels for a luxury automotive exhibition space.' },
    projectType: 'Commercial',
    location: { ro: 'Cluj-Napoca', en: 'Cluj-Napoca' },
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'demo-3',
    title: { ro: 'Villa Azure', en: 'Villa Azure' },
    summary: { ro: 'Bucătărie și dressing-uri custom cu inserții de bronz și piatră naturală.', en: 'Custom kitchen and walk-in closets with bronze inserts and natural stone.' },
    projectType: 'Rezidențial',
    location: { ro: 'Brașov', en: 'Brasov' },
    coverUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200'
  }
];

const TESTIMONIALS = [
  {
    name: "Alexandru Popa",
    role: "Arhitect",
    text: "Precizia CNC a celor de la Carvello este de neegalat. Am colaborat pentru un proiect rezidențial complex și toleranțele au fost exact cum am cerut."
  },
  {
    name: "Diana Ionescu",
    role: "Client Rezidențial",
    text: "Finisajul 2K mat pe care l-au aplicat pe mobilierul de bucătărie este incredibil de rezistent. Servicii complete, de la randare la montaj."
  },
  {
    name: "Radu Stanciu",
    role: "Dezvoltator Imobiliar",
    text: "O echipă care înțelege termenul 'premium'. Au livrat 5 apartamente la cheie în termenul stabilit, fără compromisuri la calitate."
  }
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
  const [loading, setLoading] = useState(true);

  const heroReveal = useReveal();
  const servicesReveal = useReveal();
  const projectsReveal = useReveal();
  const processReveal = useReveal();

  useEffect(() => {
    document.title = "CARVELLO | Mobilier Custom & CNC";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbProjects = await dbService.getProjects();
        const media = await dbService.getMedia();
        
        // Prepare DB projects with images
        const realProjects = dbProjects
          .filter(p => p.isPublished)
          .map(p => {
            const cover = media.find(m => m.id === p.coverMediaId) || media.find(m => m.projectId === p.id);
            return {
              id: p.id,
              title: p.title,
              summary: p.summary,
              projectType: p.projectType,
              location: p.location,
              coverUrl: cover?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000',
              isReal: true
            };
          });

        // Combine with fallback to ensure 3 cards
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
    <div className="pt-0 overflow-x-hidden">
      {/* 1) HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
            alt="Luxury Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div ref={heroReveal.ref} className={`max-w-3xl transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8">
              {lang === 'ro' ? 'Mobilier la comandă.' : 'Custom Furniture.'}<br/>
              <span className="text-accent">{lang === 'ro' ? 'Precizie CNC.' : 'CNC Precision.'}</span><br/>
              {lang === 'ro' ? 'Lux executat impecabil.' : 'Flawlessly Executed Luxury.'}
            </h1>
            
            <p className="text-lg md:text-xl font-light text-white/80 mb-10 max-w-2xl leading-relaxed">
              {lang === 'ro' 
                ? 'De la concept și randări 3D, până la execuție CNC și montaj final. Mobilier premium pentru case, apartamente și spații comerciale.'
                : 'From concept and 3D renderings to CNC execution and final assembly. Premium furniture for homes, apartments, and commercial spaces.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/cerere-oferta" className="px-10 py-5 bg-accent text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-accent transition-all shadow-xl shadow-accent/20 text-center">
                {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
              </Link>
              <Link to="/portofoliu" className="px-10 py-5 border border-white/30 text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-black transition-all text-center backdrop-blur-sm">
                {lang === 'ro' ? 'Vezi Portofoliu' : 'See Portfolio'}
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/60">
              <span>✔ {lang === 'ro' ? 'Proiectare 3D' : '3D Design'}</span>
              <span>✔ {lang === 'ro' ? 'CNC 3 axe' : '3-Axis CNC'}</span>
              <span>✔ {lang === 'ro' ? 'Vopsitorie profesională' : 'Pro Painting'}</span>
              <span>✔ {lang === 'ro' ? 'Montaj In-House' : 'In-House Assembly'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2) TRUST BAR */}
      <div className="border-y border-border bg-surface-2">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border/50">
            {['CNC Precision', 'Randări 3D', 'Vopsitorie Premium', 'Montaj Complet'].map((item, i) => (
               <div key={i} className={`px-2 ${i % 2 !== 0 ? 'border-none md:border-l' : ''}`}>
                 <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">{item}</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3) SERVICES SECTION */}
      <section className="py-24 md:py-32 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={servicesReveal.ref} className={`mb-20 text-center transition-all duration-700 ${servicesReveal.isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Excelență în tâmplărie modernă</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Nu construim „mobilă”. Construim proiecte cu toleranțe milimetrice, finisaje premium și soluții gândite pentru ani de utilizare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'CNC Precision', desc: 'Frezare, găurire, îmbinări perfecte', icon: '⌖' },
              { title: 'Finisaje Premium', desc: 'MDF vopsit, cantuire, detalii fine', icon: '✦' },
              { title: 'Randări 3D', desc: 'Vezi proiectul înainte de producție', icon: '◈' },
              { title: 'Montaj Curat', desc: 'Echipă proprie, responsabilitate completă', icon: '⚒' },
            ].map((s, idx) => (
              <div key={idx} className="p-8 border border-border bg-surface-2 hover:border-accent transition-all group hover:-translate-y-1 duration-300">
                <div className="text-4xl text-accent mb-6 opacity-80 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="font-serif text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted uppercase tracking-widest font-bold">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4) FEATURED PROJECTS */}
      <section className="py-24 md:py-32 bg-background px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div ref={projectsReveal.ref} className={`flex flex-col md:flex-row justify-between items-end mb-16 transition-all duration-700 ${projectsReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-6 md:mb-0">
              <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Portfolio Selection</span>
              <h2 className="font-serif text-4xl md:text-5xl">Proiecte de Referință</h2>
              <p className="text-muted mt-2">O selecție din lucrările noastre recente.</p>
            </div>
            <Link to="/portofoliu" className="text-[10px] uppercase font-bold tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Vezi Toate Proiectele
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/5] w-full" />)
            ) : (
              displayProjects.map((p, idx) => (
                <div key={p.id} className="group relative bg-surface-2 border border-border/50 overflow-hidden flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden">
                    <OptimizedImage 
                      src={p.coverUrl} 
                      alt={t(p.title)} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-accent uppercase font-bold tracking-widest mb-2 block">{p.projectType} — {t(p.location)}</span>
                      <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{t(p.title)}</h3>
                      <p className="text-muted text-sm line-clamp-2 mb-6">{t(p.summary)}</p>
                    </div>
                    <Link to={p.isReal ? `/proiect/${p.id}` : '/portofoliu'} className="inline-block text-[9px] font-bold uppercase tracking-widest bg-background border border-border px-6 py-3 hover:bg-foreground hover:text-background transition-colors text-center">
                      {lang === 'ro' ? 'Vezi Proiectul' : 'View Project'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5) PROCESS SECTION */}
      <section className="py-24 md:py-32 bg-surface px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Cum Lucrăm</h2>
            <p className="text-muted text-lg">Proces clar, fără surprize, cu rezultate impecabile.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { step: '01', title: 'Consultanță', desc: 'Măsurători & Discuție' },
                { step: '02', title: 'Proiectare 3D', desc: 'Concept & Ofertă' },
                { step: '03', title: 'Producție CNC', desc: 'Execuție Milimetrică' },
                { step: '04', title: 'Finisaje', desc: 'Vopsitorie & Premontaj' },
                { step: '05', title: 'Predare', desc: 'Montaj Final & Curățenie' },
              ].map((s, i) => (
                <div key={i} className="bg-surface p-6 border border-border text-center group hover:border-accent transition-colors">
                  <span className="inline-block w-12 h-12 bg-surface-2 border border-border rounded-full flex items-center justify-center font-serif text-xl text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors relative z-10 mx-auto">
                    {s.step}
                  </span>
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">{s.title}</h3>
                  <p className="text-[10px] text-muted uppercase tracking-wider">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6) MATERIALS & FINISHES */}
      <section className="py-24 bg-background px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">Quality First</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Materiale & Finisaje Premium</h2>
            <div className="space-y-6">
               {[
                 { title: 'MDF Vopsit', desc: 'Finisaje mate, satinate sau lucioase, ultra-rezistente.' },
                 { title: 'PAL Premium', desc: 'Texturi sincronizate Egger/Kronospan cu cant ABS laser.' },
                 { title: 'Detalii CNC', desc: 'Fronturi frezate, mânere integrate, panouri decorative.' },
                 { title: 'Iluminare LED', desc: 'Sisteme integrate în corpuri, senzoristică invizibilă.' }
               ].map((m, i) => (
                 <div key={i} className="flex gap-4">
                   <span className="text-accent text-lg">✦</span>
                   <div>
                     <h4 className="font-bold uppercase tracking-widest text-xs mb-1">{m.title}</h4>
                     <p className="text-muted text-sm font-light">{m.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
            <Link to="/servicii" className="inline-block mt-10 text-[10px] font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              Vezi toate specificațiile
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=600" className="aspect-[3/4] object-cover w-full border border-border" alt="Detail 1" />
            <img src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600" className="aspect-[3/4] object-cover w-full border border-border mt-12" alt="Detail 2" />
          </div>
        </div>
      </section>

      {/* 7) REVIEWS */}
      <section className="py-24 bg-surface-2 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-surface p-10 border border-border shadow-sm">
                <div className="text-accent text-4xl font-serif mb-4 leading-none">“</div>
                <p className="text-muted font-light italic mb-8 min-h-[80px] text-sm leading-relaxed">{t.text}</p>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs">{t.name}</h4>
                  <p className="text-[10px] text-accent uppercase mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8) FINAL CTA */}
      <section className="relative py-32 bg-[#050505] overflow-hidden text-center px-6">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 grayscale" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
            Transformăm schița ta într-un<br/><span className="text-accent">proiect perfect executat.</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base mb-10 tracking-wide font-light">
            Primești ofertă + estimare realistă + pașii următori în max. 24h.
          </p>
          <Link to="/cerere-oferta" className="inline-block px-16 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all shadow-2xl duration-500">
            Cere Ofertă Acum
          </Link>
        </div>
      </section>
    </div>
  );
};