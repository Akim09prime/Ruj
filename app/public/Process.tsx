
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { ArrowRight, CheckCircle2, ChevronDown, Cpu, FileText, Home, MessageSquare, Ruler } from 'lucide-react';
import * as Icons from 'lucide-react';
import { dbService } from '../../services/db';

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
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const load = async () => {
      const dbSteps = await dbService.getProcessSteps();
      const media = await dbService.getMedia();
      
      const mapped = dbSteps.map((s, i) => {
        let imageUrl = s.mediaId || '';
        if (s.mediaId && !s.mediaId.startsWith('http')) {
             const m = media.find(m => m.id === s.mediaId);
             if (m) imageUrl = m.url;
        }
        
        // Map icons based on index
        const icons = [Icons.MessageSquare, Icons.Ruler, Icons.FileText, Icons.Cpu, Icons.Home];
        const IconComp = icons[i % icons.length] || Icons.CheckCircle2;

        return {
          id: s.id,
          title: s.title,
          description: s.description,
          action: s.bullets[0] || { ro: '', en: '' },
          deliverable: s.bullets[1] || { ro: '', en: '' },
          benefit: s.bullets[2] || { ro: 'Garanție Carvello', en: 'Carvello Warranty' },
          icon: IconComp,
          image: imageUrl
        };
      });
      setSteps(mapped);
    };
    load();
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
          {steps.map((step, idx) => (
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
