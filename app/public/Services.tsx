
import React from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { AIExpert } from './AIExpert';
import { Helmet } from 'react-helmet-async';

export const Services: React.FC = () => {
  const { lang } = useI18n();

  const services = [
    {
      id: 'cnc',
      title: { ro: 'Servicii CNC Precision', en: 'Precision CNC Services' },
      desc: { ro: 'Frezare și găurire de înaltă precizie pentru orice tip de panou (MDF, PAL, Lemn Masiv). Utilizăm utilaje de ultimă generație pentru toleranțe milimetrice.', en: 'High-precision milling and drilling for any panel type (MDF, Chipboard, Solid Wood). We use state-of-the-art machinery for millimetric tolerances.' },
      specs: ['Toleranță 0.1mm', 'Găurire automată', 'Nesting optimizat'],
      img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'paint',
      title: { ro: 'Vopsitorie 2K & Finisaje', en: '2K Painting & Finishing' },
      desc: { ro: 'Finisaje poliuretanice premium cu grad de luciu controlat, de la mat profund la high-gloss, aplicate în cabine presurizate profesionale.', en: 'Premium polyurethane finishes with controlled gloss levels, from deep matte to high-gloss, applied in professional pressurized booths.' },
      specs: ['Rezistență chimică', 'Matching RAL/NCS', 'Cabina presurizată'],
      img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'design',
      title: { ro: 'Proiectare Tehnică 3D', en: 'Technical 3D Design' },
      desc: { ro: 'De la schiță de mână la randări fotorealiste și fișiere tehnice pregătite de producție prin software CAD/CAM avansat.', en: 'From hand sketches to photorealistic renderings and production-ready technical files via advanced CAD/CAM software.' },
      specs: ['Randări 4K', 'Desene tehnice', 'Optimizare costuri'],
      img: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="pt-0">
      <Helmet>
        <title>{lang === 'ro' ? 'Servicii CARVELLO | CNC, Vopsitorie 2K, Proiectare' : 'CARVELLO Services | CNC, 2K Painting, Design'}</title>
        <meta name="description" content={lang === 'ro' ? 'Servicii profesionale de frezare CNC, vopsitorie 2K și proiectare tehnică 3D pentru mobilier la comandă.' : 'Professional CNC milling, 2K painting, and technical 3D design services for custom furniture.'} />
      </Helmet>

      {/* Services Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-[2000ms]"
            alt="CNC Machine in Action"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="max-w-3xl">
            <span className="text-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block animate-fade-in">
              Capabilities & Expertise
            </span>
            <h1 className="font-serif text-5xl md:text-8xl leading-tight mb-6 animate-slide-up">
              {lang === 'ro' ? 'Expertiza Noastră' : 'Our Expertise'}
            </h1>
            <p className="text-muted text-xl max-w-xl font-light leading-relaxed animate-slide-up-delayed">
              Integrăm tehnologia digitală în procesul artizanal pentru a livra rezultate imposibil de atins prin metode convenționale.
            </p>
          </div>
        </div>
      </section>

      <div className="py-24 px-6 max-w-7xl mx-auto space-y-32 mb-40">
        {services.map((s, idx) => (
          <div key={s.id} className={`grid grid-cols-1 md:grid-cols-2 gap-20 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className={`${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
              <div className="aspect-[16/10] bg-surface-2 overflow-hidden border border-border group">
                <img src={s.img} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt="" />
              </div>
            </div>
            <div className={`${idx % 2 !== 0 ? 'md:order-1' : ''}`}>
              <span className="text-accent font-mono text-sm mb-4 block">0{idx + 1} —</span>
              <h2 className="font-serif text-4xl mb-6">{lang === 'ro' ? s.title.ro : s.title.en}</h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                {lang === 'ro' ? s.desc.ro : s.desc.en}
              </p>
              <ul className="space-y-3 mb-10">
                {s.specs.map(spec => (
                  <li key={spec} className="flex items-center text-xs uppercase tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 bg-accent mr-3 rounded-full"></span>
                    {spec}
                  </li>
                ))}
              </ul>
              <Link to="/cerere-oferta" className="inline-block px-8 py-3 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-accent transition-colors">
                Interesat de acest serviciu
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="pt-20 border-t border-border">
        <AIExpert />
      </section>
    </div>
  );
};
