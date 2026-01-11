
import React from 'react';
import { useI18n } from '../../lib/i18n';
import { Link } from 'react-router-dom';
import { AIExpert } from './AIExpert';

export const Services: React.FC = () => {
  const { lang } = useI18n();

  const services = [
    {
      id: 'cnc',
      title: { ro: 'Servicii CNC', en: 'CNC Services' },
      desc: { ro: 'Frezare și găurire de înaltă precizie pentru orice tip de panou (MDF, PAL, Lemn Masiv).', en: 'High-precision milling and drilling for any panel type (MDF, Chipboard, Solid Wood).' },
      specs: ['Toleranță 0.1mm', 'Găurire automată', 'Nesting optimizat'],
      img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'paint',
      title: { ro: 'Vopsitorie 2K', en: '2K Painting' },
      desc: { ro: 'Finisaje poliuretanice premium cu grad de luciu controlat, de la mat profund la high-gloss.', en: 'Premium polyurethane finishes with controlled gloss levels, from deep matte to high-gloss.' },
      specs: ['Rezistență chimică', 'Matching RAL/NCS', 'Cabina presurizată'],
      img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'design',
      title: { ro: 'Proiectare 3D', en: '3D Design' },
      desc: { ro: 'De la schiță de mână la randări fotorealiste și fișiere tehnice pregătite de producție.', en: 'From hand sketches to photorealistic renderings and production-ready technical files.' },
      specs: ['Randări 4K', 'Desene tehnice', 'Optimizare costuri'],
      img: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Expertiza Noastră</h1>
        <p className="text-muted text-xl max-w-2xl font-light">
          Integrăm tehnologia digitală în procesul artizanal pentru a livra rezultate imposibil de atins prin metode convenționale.
        </p>
      </div>

      <div className="space-y-32 mb-40">
        {services.map((s, idx) => (
          <div key={s.id} className={`grid grid-cols-1 md:grid-cols-2 gap-20 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className={`${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
              <div className="aspect-[16/10] bg-surface-2 overflow-hidden border border-border">
                <img src={s.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" />
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
              <Link to="/cerere-oferta" className="px-8 py-3 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-accent transition-colors">
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
