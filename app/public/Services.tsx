
import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { SEO } from '../../components/SEO';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
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

export const Services: React.FC = () => {
  const { t, lang } = useI18n();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const load = async () => {
      const dbServices = await dbService.getServices();
      const media = await dbService.getMedia();
      
      const mapped = dbServices.map(s => {
        // Resolve image: check if it's a URL (from seed) or an ID (from db)
        let imageUrl = s.heroMediaId || '';
        if (s.heroMediaId && !s.heroMediaId.startsWith('http')) {
             const m = media.find(m => m.id === s.heroMediaId);
             if (m) imageUrl = m.url;
        }

        // Resolve icon
        // @ts-ignore
        const IconComp = Icons[s.icon] || Icons.HelpCircle;

        return {
          id: s.id,
          icon: IconComp,
          title: s.title,
          subtitle: s.shortDescription,
          description: s.fullDescription,
          target: s.features[0] ? { ro: (s.features[0] as any).description?.ro || (s.features[0] as any).desc?.ro || '', en: (s.features[0] as any).description?.en || (s.features[0] as any).desc?.en || '' } : { ro: '', en: '' },
          problem: s.features[1] ? { ro: (s.features[1] as any).description?.ro || (s.features[1] as any).desc?.ro || '', en: (s.features[1] as any).description?.en || (s.features[1] as any).desc?.en || '' } : { ro: '', en: '' },
          deliverables: s.bullets,
          image: imageUrl,
          cta: { link: "/contact", text: { ro: "Cere Ofertă", en: "Request Quote" } }
        };
      });
      setServices(mapped);
    };
    load();
  }, [lang]);

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#d4af37] selection:text-black">
      <SEO 
        title={lang === 'ro' ? 'Servicii Premium' : 'Premium Services'}
        description={lang === 'ro' 
          ? 'De la concept la realitate. Oferim servicii complete pentru proiecte care nu acceptă compromisuri.'
          : 'From concept to reality. We offer complete services for projects that refuse to compromise.'}
      />
      
      {/* 1) HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Services Hero"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#d4af37] uppercase tracking-[0.3em] text-xs font-bold block mb-6 animate-fade-in">
            {lang === 'ro' ? 'Ecosistemul Carvello' : 'The Carvello Ecosystem'}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight text-white animate-slide-up">
            {lang === 'ro' ? 'Soluții Integrate.' : 'Integrated Solutions.'}
          </h1>
          <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
            {lang === 'ro' 
              ? 'De la concept la realitate. Oferim servicii complete pentru proiecte care nu acceptă compromisuri.'
              : 'From concept to reality. We offer complete services for projects that refuse to compromise.'}
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 hidden md:block">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* 2) SERVICES LIST */}
      <div className="py-24 space-y-32">
        {services.map((service, idx) => (
          <ServiceSection key={service.id} service={service} index={idx} lang={lang} />
        ))}
      </div>

      {/* 3) FINAL CTA */}
      <section className="py-32 bg-[#0a0a0a] px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
            {lang === 'ro' ? 'Gata să începem?' : 'Ready to start?'}
          </h2>
          <p className="text-white/60 text-lg font-light mb-12 max-w-2xl mx-auto">
            {lang === 'ro' 
              ? 'Indiferent de stadiul proiectului tău, suntem aici să oferim claritate și execuție impecabilă.' 
              : 'Regardless of your project stage, we are here to offer clarity and flawless execution.'}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/contact" className="inline-block px-12 py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              {lang === 'ro' ? 'Solicită Ofertă' : 'Request Quote'}
            </Link>
            <Link to="/portofoliu" className="inline-block px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all">
              {lang === 'ro' ? 'Vezi Portofoliu' : 'View Portfolio'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

const ServiceSection = ({ service, index, lang }: { service: any, index: number, lang: string }) => {
  const { ref, isVisible } = useReveal();
  const isEven = index % 2 === 0;

  return (
    <section ref={ref} id={service.id} className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      <div className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
        
        {/* Image Side */}
        <div className="w-full lg:w-1/2 relative group">
          <div className={`absolute -inset-4 border border-white/10 transition-transform duration-700 ${isEven ? 'translate-x-4 translate-y-4' : '-translate-x-4 translate-y-4'} group-hover:translate-x-0 group-hover:translate-y-0`}></div>
          <div className="aspect-[4/3] overflow-hidden relative bg-[#111]">
            <OptimizedImage 
              src={service.image} 
              alt={lang === 'ro' ? service.title.ro : service.title.en} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Floating Icon */}
            <div className="absolute top-6 left-6 w-16 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <service.icon className="w-8 h-8 text-[#d4af37]" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[#d4af37] font-serif text-4xl opacity-30">0{index + 1}</span>
            <span className="h-[1px] w-12 bg-[#d4af37]/30"></span>
            <span className="text-[#d4af37] uppercase tracking-[0.2em] text-[10px] font-bold">
              {lang === 'ro' ? service.subtitle.ro : service.subtitle.en}
            </span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
            {lang === 'ro' ? service.title.ro : service.title.en}
          </h2>
          
          <p className="text-white/70 text-lg leading-relaxed mb-8 font-light border-l-2 border-[#d4af37]/30 pl-6">
            {lang === 'ro' ? service.description.ro : service.description.en}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                {lang === 'ro' ? 'Pentru Cine' : 'Target Audience'}
              </h4>
              <p className="text-white/50 text-sm font-light">
                {lang === 'ro' ? service.target.ro : service.target.en}
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                {lang === 'ro' ? 'Valoare Adăugată' : 'Value Added'}
              </h4>
              <p className="text-white/50 text-sm font-light">
                {lang === 'ro' ? service.problem.ro : service.problem.en}
              </p>
            </div>
          </div>
          
          <div className="mb-10">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              {lang === 'ro' ? 'Ce Primești' : 'Deliverables'}
            </h4>
            <ul className="space-y-3">
              {service.deliverables && Array.isArray(service.deliverables) ? service.deliverables.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                  <span>{lang === 'ro' ? item.ro : item.en}</span>
                </li>
              )) : (
                <li className="text-sm text-white/50 italic">
                  {lang === 'ro' ? 'Niciun element definit' : 'No items defined'}
                </li>
              )}
            </ul>
          </div>

          <Link 
            to={service.cta.link} 
            className="group inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest border-b border-[#d4af37] pb-2 hover:text-[#d4af37] transition-colors"
          >
            {lang === 'ro' ? service.cta.text.ro : service.cta.text.en}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
