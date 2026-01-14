
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';

export const Home: React.FC = () => {
  const { t, lang } = useI18n();
  const [featuredMedia, setFeaturedMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allMedia = await dbService.getMedia();
      const settings = await dbService.getSettings();
      const filtered = allMedia
        .filter(m => m.stars >= settings.featuredStarsThreshold)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 4);
      setFeaturedMedia(filtered);
      setLoading(false);
    };
    fetchData();
  }, []);

  const processSteps = [
    { id: '01', title: { ro: 'Consultare & Scanare', en: 'Consultation & Scanning' } },
    { id: '02', title: { ro: 'Proiectare CAD/CAM', en: 'CAD/CAM Engineering' } },
    { id: '03', title: { ro: 'Debitări CNC 0.1mm', en: '0.1mm CNC Cutting' } },
    { id: '04', title: { ro: 'Finisaj 2K Premium', en: '2K Premium Finishing' } },
    { id: '05', title: { ro: 'Montaj Impecabil', en: 'Flawless Installation' } },
  ];

  return (
    <div className="pt-0">
      {/* Hero Section - Refined Cinematic Experience */}
      <section className="relative h-screen flex items-center overflow-hidden group cursor-default">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover transform scale-105 transition-all duration-[1000ms] ease-out-expo group-hover:scale-110 group-hover:opacity-80"
            alt="Carvello Premium Interior"
          />
          
          {/* Cinematic Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" 
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>
          
          {/* Layered Dramatic Gradients */}
          {/* 1. Readability Gradient (Left to Right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent"></div>
          
          {/* 2. Depth Vignette (Bottom to Center) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          
          {/* 3. Brand Accent Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(184,146,59,0.15),transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="max-w-3xl">
            <span className="inline-block text-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-6 animate-fade-in">
              Architectural Woodworking & CMS Precision
            </span>
            <h1 className="font-serif text-5xl md:text-8xl leading-[1.1] mb-8 animate-slide-up">
              {lang === 'ro' 
                ? 'Mobilier la comandă realizat cu precizie CNC.' 
                : 'Custom furniture crafted with CNC precision.'}
            </h1>
            <p className="text-lg md:text-xl font-light mb-12 max-w-xl text-white/70 leading-relaxed animate-slide-up-delayed">
              {lang === 'ro'
                ? 'Soluții integrate pentru reședințe exclusiviste. Control absolut de la proiectarea tehnică până la finisajul 2K premium.'
                : 'Integrated solutions for exclusive residences. Absolute control from technical design to premium 2K finishing.'}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up-delayed">
              <Link to="/cerere-oferta" className="px-12 py-5 bg-accent text-white font-bold tracking-widest uppercase hover:bg-white hover:text-accent transition-all duration-500 shadow-2xl shadow-accent/20 text-center">
                {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
              </Link>
              <Link to="/portofoliu" className="px-12 py-5 border border-white/30 backdrop-blur-sm text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 text-center">
                {lang === 'ro' ? 'Vezi Portofoliu' : 'Portfolio'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator - Dynamic interaction */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 group-hover:opacity-80 transition-all duration-700">
           <span className="text-[10px] uppercase tracking-[0.3em] text-white mb-2 animate-pulse">Scroll</span>
           <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent"></div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="py-32 px-6 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {[
              { 
                title: { ro: 'Tehnologie CNC', en: 'CNC Technology' }, 
                desc: { ro: 'Erori zero prin debitare și frezare asistată de computer.', en: 'Zero errors through computer-aided cutting and milling.' }
              },
              { 
                title: { ro: 'Vopsitorie 2K', en: '2K Finishing' }, 
                desc: { ro: 'Sisteme profesionale de vopsire pentru durabilitate extremă.', en: 'Professional painting systems for extreme durability.' }
              },
              { 
                title: { ro: 'Arhitectură 3D', en: '3D Architecture' }, 
                desc: { ro: 'Proiectare tehnică detaliată și randări fotorealiste 4K.', en: 'Detailed technical design and 4K photorealistic renders.' }
              },
              { 
                title: { ro: 'Execuție In-House', en: 'In-House Execution' }, 
                desc: { ro: 'Controlăm întreg fluxul, de la schiță la montajul final.', en: 'We control the entire workflow, from sketch to final install.' }
              },
            ].map((p, i) => (
              <div key={i} className="group">
                <span className="text-accent font-mono text-sm mb-4 block">0{i+1}.</span>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{t(p.title)}</h3>
                <p className="text-muted text-sm leading-relaxed">{t(p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-xl">
              <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">Excellence in Craft</span>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight">Proiecte de Referință</h2>
            </div>
            <Link to="/galerie-mobilier" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-accent pb-2 hover:text-accent transition-colors mt-8 md:mt-0">
              Explorați toată galeria
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {loading ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[16/10]" />)
            ) : (
              featuredMedia.map((m, idx) => (
                <Link to={`/proiect/${m.projectId}`} key={m.id} className={`group relative overflow-hidden bg-surface-2 ${idx % 2 !== 0 ? 'md:mt-20' : ''}`}>
                  <div className="aspect-[16/11] overflow-hidden">
                    <img src={m.url} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt="" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-12 flex flex-col justify-end">
                    <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{m.room}</span>
                    <h3 className="text-white font-serif text-3xl mb-4">{m.caption ? t(m.caption) : 'Custom Interior'}</h3>
                    <span className="text-white/50 text-[10px] uppercase tracking-widest border-b border-white/20 pb-1 self-start">Vezi Proiect</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Mini Timeline */}
      <section className="py-32 bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Cum lucrăm</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Un proces riguros, digitalizat, pentru un rezultat predictibil și impecabil.</p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {processSteps.map((step, idx) => (
                <div key={step.id} className="bg-surface p-8 border border-border text-center hover:border-accent transition-colors group">
                  <span className="block font-serif text-3xl text-accent/20 group-hover:text-accent mb-4 transition-colors">{step.id}</span>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold leading-relaxed">{t(step.title)}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-32 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-10 leading-tight">
            Transformăm schița ta în realitate milimetrică.
          </h2>
          <Link to="/cerere-oferta" className="inline-block px-16 py-6 bg-white text-accent font-bold uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition-all duration-500 shadow-xl">
            Cere ofertă acum
          </Link>
        </div>
      </section>
    </div>
  );
};
