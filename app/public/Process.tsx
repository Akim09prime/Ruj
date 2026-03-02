
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { ArrowRight, CheckCircle2, ChevronDown, Cpu, FileText, Home, MessageSquare, Ruler } from 'lucide-react';

const PROCESS_STEPS = [
  {
    id: 1,
    title: { ro: "Consultare & Viziune", en: "Consultation & Vision" },
    description: { 
      ro: "Începem cu o discuție relaxată despre nevoile tale. Vrem să înțelegem stilul de viață, preferințele estetice și bugetul alocat.",
      en: "We start with a relaxed discussion about your needs. We want to understand your lifestyle, aesthetic preferences, and allocated budget."
    },
    action: { ro: "Analizăm spațiul, stilul dorit și bugetul estimat.", en: "We analyze the space, desired style, and estimated budget." },
    deliverable: { ro: "O direcție clară și o estimare preliminară.", en: "A clear direction and a preliminary estimate." },
    benefit: { ro: "Știi de la început dacă suntem partenerul potrivit.", en: "You know from the start if we are the right partner." },
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    title: { ro: "Măsurători & Proiectare", en: "Measurements & Design" },
    description: { 
      ro: "Transformăm ideile în planuri tehnice concrete. Nu lăsăm nimic la voia întâmplării.",
      en: "We transform ideas into concrete technical plans. We leave nothing to chance."
    },
    action: { ro: "Releu digital 3D, proiectare tehnică detaliată, randări fotorealiste.", en: "3D digital survey, detailed technical design, photorealistic renderings." },
    deliverable: { ro: "Proiect complet 3D și dosar tehnic de execuție.", en: "Complete 3D project and technical execution file." },
    benefit: { ro: "Vezi exact cum va arăta rezultatul final înainte de a tăia prima placă.", en: "See exactly how the final result will look before cutting the first board." },
    icon: Ruler,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    title: { ro: "Ofertare & Contract", en: "Quote & Contract" },
    description: { 
      ro: "Transparență totală asupra costurilor. Oferta noastră este finală, fără costuri ascunse.",
      en: "Total transparency on costs. Our quote is final, with no hidden costs."
    },
    action: { ro: "Ofertă detaliată pe materiale, feronerie și manoperă.", en: "Detailed quote on materials, hardware, and labor." },
    deliverable: { ro: "Contract ferm cu termene de execuție clare.", en: "Firm contract with clear execution deadlines." },
    benefit: { ro: "Siguranță financiară și contractuală.", en: "Financial and contractual security." },
    icon: FileText,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 4,
    title: { ro: "Producție CNC & Finisare", en: "CNC Production & Finishing" },
    description: { 
      ro: "Unde tehnologia întâlnește măiestria. Producem totul in-house, controlând calitatea fiecărei piese.",
      en: "Where technology meets craftsmanship. We produce everything in-house, controlling the quality of every piece."
    },
    action: { ro: "Debitare și frezare CNC, vopsire în cabină presurizată, pre-asamblare.", en: "CNC cutting and milling, painting in pressurized booth, pre-assembly." },
    deliverable: { ro: "Mobilier executat la milimetru, gata de montaj.", en: "Furniture executed to the millimeter, ready for installation." },
    benefit: { ro: "Calitate industrială cu atenție de artizan.", en: "Industrial quality with artisan attention." },
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 5,
    title: { ro: "Livrare & Montaj", en: "Delivery & Installation" },
    description: { 
      ro: "Ultimul pas spre casa visurilor tale. Tratăm casa ta cu respectul cuvenit.",
      en: "The last step to your dream home. We treat your home with the respect it deserves."
    },
    action: { ro: "Transport specializat, montaj cu echipe proprii, curățenie finală.", en: "Specialized transport, installation with in-house teams, final cleaning." },
    deliverable: { ro: "Spațiu gata de utilizare, impecabil.", en: "Space ready for use, spotless." },
    benefit: { ro: "O experiență fără stres, cu garanție extinsă.", en: "A stress-free experience, with extended warranty." },
    icon: Home,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200"
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

export const Process: React.FC = () => {
  const { t, lang } = useI18n();

  useEffect(() => {
    document.title = lang === 'ro' ? 'CARVELLO | Procesul de Execuție' : 'CARVELLO | Execution Process';
    window.scrollTo(0, 0);
  }, [lang]);

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* 1) HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=2000" 
            alt="Process Hero"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#d4af37] uppercase tracking-[0.3em] text-xs font-bold block mb-6 animate-fade-in">
            {lang === 'ro' ? 'Metodologia Noastră' : 'Our Methodology'}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight text-white animate-slide-up">
            {lang === 'ro' ? 'Claritate. Control. Execuție.' : 'Clarity. Control. Execution.'}
          </h1>
          <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
            {lang === 'ro' 
              ? 'Un proces rafinat în ani de experiență, gândit să elimine incertitudinea și să garanteze rezultatul perfect.'
              : 'A process refined over years of experience, designed to eliminate uncertainty and guarantee the perfect result.'}
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 hidden md:block">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* 2) STEPS LIST */}
      <div className="py-24 max-w-5xl mx-auto px-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-24 bottom-24 w-[1px] bg-white/10 hidden md:block"></div>

        <div className="space-y-24">
          {PROCESS_STEPS.map((step, idx) => (
            <StepCard key={step.id} step={step} index={idx} lang={lang} />
          ))}
        </div>
      </div>

      {/* 3) FINAL CTA */}
      <section className="py-32 bg-[#0a0a0a] px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
            {lang === 'ro' ? 'Pregătit să începem?' : 'Ready to start?'}
          </h2>
          <p className="text-white/60 text-lg font-light mb-12 max-w-2xl mx-auto">
            {lang === 'ro' 
              ? 'Programează o discuție inițială și hai să transformăm planurile tale în realitate.' 
              : 'Schedule an initial discussion and let\'s turn your plans into reality.'}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/contact" className="inline-block px-12 py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              {lang === 'ro' ? 'Programează Discuție' : 'Schedule Talk'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

const StepCard = ({ step, index, lang }: { step: any, index: number, lang: string }) => {
  const { ref, isVisible } = useReveal();
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      
      {/* Center Dot (Desktop) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border border-[#d4af37] rounded-full z-10 items-center justify-center">
        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></div>
      </div>

      {/* Content Side */}
      <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right md:pr-16' : 'md:order-2 md:pl-16'}`}>
        <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
          <span className="text-[#d4af37] font-serif text-5xl opacity-20 font-bold">0{index + 1}</span>
          <h3 className="text-2xl md:text-3xl text-white font-serif">{lang === 'ro' ? step.title.ro : step.title.en}</h3>
        </div>
        
        <p className="text-white/70 text-lg font-light mb-8 leading-relaxed">
          {lang === 'ro' ? step.description.ro : step.description.en}
        </p>

        <div className={`space-y-4 text-sm ${isEven ? 'md:items-end' : ''} flex flex-col`}>
          <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
            <span className="text-[#d4af37] text-[10px] uppercase font-bold tracking-widest block mb-1">
              {lang === 'ro' ? 'Ce se întâmplă:' : 'What happens:'}
            </span>
            <p className="text-white/80 font-light">{lang === 'ro' ? step.action.ro : step.action.en}</p>
          </div>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
            <span className="text-[#d4af37] text-[10px] uppercase font-bold tracking-widest block mb-1">
              {lang === 'ro' ? 'Ce primești:' : 'Deliverable:'}
            </span>
            <p className="text-white/80 font-light">{lang === 'ro' ? step.deliverable.ro : step.deliverable.en}</p>
          </div>

          <div className="flex items-center gap-2 text-[#d4af37]/80 mt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="italic text-xs">{lang === 'ro' ? step.benefit.ro : step.benefit.en}</span>
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:order-1 md:pr-16'}`}>
        <div className="aspect-[4/3] overflow-hidden relative bg-[#111] border border-white/10 group">
          <OptimizedImage 
            src={step.image} 
            alt={lang === 'ro' ? step.title.ro : step.title.en} 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1.5s] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Floating Icon */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <step.icon className="w-6 h-6 text-[#d4af37]" strokeWidth={1} />
          </div>
        </div>
      </div>

    </div>
  );
};
