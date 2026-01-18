
import React, { useEffect, useState, useRef } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { ProcessStep, Media } from '../../types';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Link } from 'react-router-dom';

export const Process: React.FC = () => {
  const { lang, t } = useI18n();
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  
  // Refs for intersection observing
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Procesul de Execuție' : 'CARVELLO | Execution Process';
    window.scrollTo(0,0);
    
    const load = async () => {
      const s = await dbService.getProcessSteps();
      const m = await dbService.getMedia();
      setSteps(s.filter(step => step.isVisible));
      setMedia(m);
    };
    load();
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveStepIndex(index);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' } 
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [steps]);

  const getMediaUrl = (id: string | null) => {
    if (!id) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758';
    return media.find(m => m.id === id)?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758';
  };

  return (
    <div className="bg-background text-foreground overflow-hidden">
      
      {/* 1) HERO CINEMATIC */}
      <section className="relative h-[70vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
           <OptimizedImage 
             src="https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=2000" 
             alt="CNC Workshop" 
             className="w-full h-full object-cover opacity-50 animate-slow-zoom"
           />
           <div className="absolute inset-0 bg-black/60"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
           <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold block mb-6 animate-fade-in">
             {lang === 'ro' ? 'Workflow' : 'Workflow'}
           </span>
           <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight animate-slide-up">
             {lang === 'ro' ? 'Procesul de Execuție.' : 'Execution Process.'}
           </h1>
           <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up-delayed">
             {lang === 'ro' 
               ? 'De la prima măsurătoare până la montajul final, fiecare etapă este controlată milimetric.' 
               : 'From the first measurement to the final installation, every step is controlled to the millimeter.'}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up-delayed">
              <Link to="/contact" className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl">
                 {lang === 'ro' ? 'Programează Măsurători' : 'Schedule Measurements'}
              </Link>
              <Link to="/portofoliu" className="px-10 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                 {lang === 'ro' ? 'Vezi Portofoliu' : 'View Portfolio'}
              </Link>
           </div>
        </div>
      </section>

      {/* 2) INTERACTIVE STORY TIMELINE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="flex flex-col lg:flex-row gap-20">
            
            {/* LEFT: TEXT STEPS (Scrollable) */}
            <div className="w-full lg:w-1/2 space-y-48 pb-24">
               {steps.map((step, idx) => (
                  <div 
                    key={step.id} 
                    data-index={idx} 
                    ref={el => stepRefs.current[idx] = el}
                    className={`transition-all duration-500 ${activeStepIndex === idx ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}
                  >
                     <span className="text-accent font-serif text-6xl block mb-6 opacity-30">0{idx}</span>
                     <h2 className="font-serif text-3xl md:text-4xl mb-6">{t(step.title)}</h2>
                     <p className="text-muted text-lg leading-relaxed mb-8">{t(step.description)}</p>
                     
                     <ul className="space-y-3 mb-10 border-l border-border pl-6">
                        {step.bullets.map((b, i) => (
                           <li key={i} className="text-sm font-bold uppercase tracking-widest text-foreground/70 flex items-center gap-3">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                              {t(b)}
                           </li>
                        ))}
                     </ul>

                     <Link to={step.cta.href} className="inline-block border-b border-foreground pb-1 text-xs uppercase font-bold tracking-widest hover:text-accent hover:border-accent transition-all">
                        {t(step.cta.label)}
                     </Link>

                     {/* Mobile Image (Visible only on small screens) */}
                     <div className="lg:hidden mt-8 aspect-video overflow-hidden bg-surface-2 border border-border">
                        <OptimizedImage src={getMediaUrl(step.mediaId)} alt={t(step.title)} className="w-full h-full object-cover" />
                     </div>
                  </div>
               ))}
            </div>

            {/* RIGHT: STICKY VISUAL (Desktop only) */}
            <div className="hidden lg:block w-1/2 h-screen sticky top-24 pb-24">
               <div className="w-full h-[70vh] bg-surface-2 border border-border relative overflow-hidden shadow-2xl">
                  {steps.map((step, idx) => (
                     <div 
                        key={step.id} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeStepIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                     >
                        <OptimizedImage 
                           src={getMediaUrl(step.mediaId)} 
                           alt={t(step.title)} 
                           className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        
                        <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md p-6 border-l-4 border-accent text-white transform translate-y-4 opacity-0 transition-all duration-700 delay-300" style={{ opacity: activeStepIndex === idx ? 1 : 0, transform: activeStepIndex === idx ? 'translateY(0)' : 'translateY(20px)' }}>
                           <span className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-accent">Etapa {idx}</span>
                           <p className="font-serif text-2xl">{t(step.title)}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </section>

      {/* 3) DIFFERENTIATORS */}
      <section className="bg-surface py-24 border-y border-border px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-4">Standardele Noastre</span>
               <h2 className="font-serif text-4xl">De ce Carvello?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                  { title: "Execuție Milimetrică", desc: "Utilaje CNC calibrate la 0.1mm." },
                  { title: "Finisaje Controlate", desc: "Cabină vopsire 2K presurizată." },
                  { title: "Design Integrat", desc: "Tehnicul validează esteticul." },
                  { title: "Montaj White-Glove", desc: "Echipe proprii, curățenie totală." }
               ].map((item, i) => (
                  <div key={i} className="p-8 border border-border bg-background text-center hover:border-accent transition-colors group">
                     <span className="text-3xl text-accent mb-4 block opacity-50 group-hover:opacity-100">✦</span>
                     <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                     <p className="text-muted text-sm">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4) QUALITY WARRANTY */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
               <h2 className="font-serif text-4xl mb-8">Garanția Calității Absolute</h2>
               <p className="text-muted text-lg mb-8 leading-relaxed">
                  Nu suntem doar producători de mobilă, suntem parteneri de încredere. Fiecare proiect beneficiază de o dublă verificare (în fabrică și la montaj) și de materiale certificate de la lideri mondiali.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-4 border border-border bg-surface-2">
                     <span className="text-2xl">🛡️</span>
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest">Garanție Structură 5 Ani</h4>
                        <p className="text-xs text-muted">Pentru corpuri, balamale și sisteme de glisare.</p>
                     </div>
                  </li>
                  <li className="flex items-center gap-4 p-4 border border-border bg-surface-2">
                     <span className="text-2xl">🔧</span>
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest">Suport Post-Montaj</h4>
                        <p className="text-xs text-muted">Reglaje gratuite în primele 12 luni.</p>
                     </div>
                  </li>
               </ul>
            </div>
            <div className="order-1 md:order-2 aspect-square relative bg-surface-2 border border-border p-4">
               <div className="w-full h-full border border-accent/20 flex items-center justify-center p-8 text-center">
                  <div>
                     <span className="font-serif text-9xl text-accent/20 block mb-4">100%</span>
                     <span className="text-sm font-bold uppercase tracking-[0.4em] text-foreground">Satisfaction Rate</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5) FINAL CTA */}
      <section className="py-32 bg-black text-white text-center px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl mb-8">Vrei o execuție perfectă, fără compromis?</h2>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-white/50 mb-12">
               <span>• Termen Clar</span>
               <span>• Echipe Specializate</span>
               <span>• Proces Verificat</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to="/cerere-oferta" className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-2xl">
                  Cere Ofertă
               </Link>
               <Link to="/contact" className="px-12 py-5 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                  Contact Rapid
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};
