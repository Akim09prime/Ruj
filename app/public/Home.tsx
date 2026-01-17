
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';
import { Helmet } from 'react-helmet-async';

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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export const Home: React.FC = () => {
  const { t, lang } = useI18n();
  const [featuredMedia, setFeaturedMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const pillarsReveal = useReveal();
  const projectsReveal = useReveal();
  const processReveal = useReveal();

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

  // Hero Slides Data
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400",
      tagline: "Architectural Woodworking & CMS Precision",
      title: { 
        ro: 'Mobilier la comandă realizat cu precizie CNC.', 
        en: 'Custom furniture crafted with CNC precision.' 
      },
      desc: { 
        ro: 'Soluții integrate pentru reședințe exclusiviste. Control absolut de la proiectarea tehnică până la montaj.', 
        en: 'Integrated solutions for exclusive residences. Absolute control from technical design to installation.' 
      },
      ctaPrimary: { label: { ro: 'Cere Ofertă', en: 'Get Quote' }, link: '/cerere-oferta' },
      ctaSecondary: { label: { ro: 'Vezi Portofoliu', en: 'Portfolio' }, link: '/portofoliu' }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2400",
      tagline: "Premium 2K Finishing & Surfaces",
      title: { 
        ro: 'Finisaje 2K impecabile și texturi unice.', 
        en: 'Flawless 2K finishes and unique textures.' 
      },
      desc: { 
        ro: 'Vopsitorie în cabină presurizată. De la ultra-mat la high-gloss, garantăm uniformitate și durabilitate.', 
        en: 'Painting in pressurized booths. From ultra-matte to high-gloss, we guarantee uniformity and durability.' 
      },
      ctaPrimary: { label: { ro: 'Servicii Vopsire', en: 'Painting Services' }, link: '/servicii' },
      ctaSecondary: { label: { ro: 'Galeria Detalii', en: 'Details Gallery' }, link: '/galerie-mobilier' }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2400",
      tagline: "Interior Architecture & Design",
      title: { 
        ro: 'Transformăm spațiul în experiență vizuală.', 
        en: 'We transform space into visual experience.' 
      },
      desc: { 
        ro: 'Proiectare tehnică 3D și execuție milimetrică pentru interioare care definesc standardul de lux.', 
        en: '3D technical design and millimetric execution for interiors that define the luxury standard.' 
      },
      ctaPrimary: { label: { ro: 'Contactează-ne', en: 'Contact Us' }, link: '/contact' },
      ctaSecondary: { label: { ro: 'Despre Noi', en: 'About Us' }, link: '/despre' }
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const processSteps = [
    { id: '01', title: { ro: 'Consultare & Scanare', en: 'Consultation & Scanning' } },
    { id: '02', title: { ro: 'Proiectare CAD/CAM', en: 'CAD/CAM Engineering' } },
    { id: '03', title: { ro: 'Debitări CNC 0.1mm', en: '0.1mm CNC Cutting' } },
    { id: '04', title: { ro: 'Finisaj 2K Premium', en: '2K Premium Finishing' } },
    { id: '05', title: { ro: 'Montaj Impecabil', en: 'Flawless Installation' } },
  ];

  return (
    <div className="pt-0">
      <Helmet>
        <title>{lang === 'ro' ? 'CARVELLO | Mobilier Custom Premium & CNC' : 'CARVELLO | Premium Custom Furniture & CNC'}</title>
        <meta name="description" content={lang === 'ro' ? 'Mobilier la comandă, vopsitorie 2K și debitare CNC de precizie în Cluj-Napoca. Soluții arhitecturale de lux.' : 'Custom furniture, 2K finishing, and precision CNC cutting in Cluj-Napoca. Luxury architectural solutions.'} />
        <meta property="og:title" content="CARVELLO | Precizie Milimetrică" />
        <meta property="og:description" content="Mobilier la comandă și soluții CNC de top." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" />
      </Helmet>

      {/* Hero Section - Slider */}
      <section className="relative h-screen flex items-center overflow-hidden group bg-black">
        {/* Background Images Layer */}
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out z-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
              alt=""
            />
            {/* Overlay Layers applied to each image to ensure consistency */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          </div>
        ))}
        
        {/* Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white mt-10 md:mt-0">
          <div className="max-w-4xl">
            {/* Key changing forces React to re-mount the component, triggering the CSS animations again */}
            <div key={currentSlide}>
              <div className="overflow-hidden mb-6">
                <span className="inline-block text-accent uppercase tracking-[0.5em] text-[10px] font-bold animate-slide-up">
                  {heroSlides[currentSlide].tagline}
                </span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-8xl leading-[1.1] mb-8 animate-slide-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
                {lang === 'ro' ? heroSlides[currentSlide].title.ro : heroSlides[currentSlide].title.en}
              </h1>
              
              <p className="text-lg md:text-xl font-light mb-12 max-w-xl text-white/80 leading-relaxed animate-slide-up" style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}>
                {lang === 'ro' ? heroSlides[currentSlide].desc.ro : heroSlides[currentSlide].desc.en}
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up" style={{ animationDelay: '450ms', opacity: 0, animationFillMode: 'forwards' }}>
                <Link to={heroSlides[currentSlide].ctaPrimary.link} className="px-12 py-5 bg-accent text-white font-bold tracking-widest uppercase hover:bg-white hover:text-accent transition-all duration-500 shadow-2xl shadow-accent/20 text-center text-xs">
                  {lang === 'ro' ? heroSlides[currentSlide].ctaPrimary.label.ro : heroSlides[currentSlide].ctaPrimary.label.en}
                </Link>
                <Link to={heroSlides[currentSlide].ctaSecondary.link} className="px-12 py-5 border border-white/30 backdrop-blur-sm text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 text-center text-xs">
                  {lang === 'ro' ? heroSlides[currentSlide].ctaSecondary.label.ro : heroSlides[currentSlide].ctaSecondary.label.en}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-4">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-12 bg-accent' : 'w-4 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Pillars of Excellence - Staggered Reveal */}
      <section ref={pillarsReveal.ref} className="py-32 px-6 bg-surface border-b border-border">
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
              <div 
                key={i} 
                className={`group transition-all duration-500 ${pillarsReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-accent font-mono text-sm mb-4 block">0{i+1}.</span>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{t(p.title)}</h3>
                <p className="text-muted text-sm leading-relaxed">{t(p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Rapid Reveal */}
      <section ref={projectsReveal.ref} className="py-32 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-20 transition-all duration-700 ${projectsReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">Excellence in Craft</span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight">Proiecte de Referință</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {loading ? (
              [1, 2].map(i => <Skeleton key={i} className="aspect-[16/10]" />)
            ) : (
              featuredMedia.map((m, idx) => (
                <Link 
                  to={`/proiect/${m.projectId}`} 
                  key={m.id} 
                  className={`group relative overflow-hidden bg-surface-2 transition-all duration-700 ${projectsReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'} ${idx % 2 !== 0 ? 'md:mt-20' : ''}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="aspect-[16/11] overflow-hidden">
                    <img src={m.url} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="" />
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

      {/* Mini Timeline - Process Preview Staggered */}
      <section ref={processReveal.ref} className="py-32 bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-700 ${processReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Cum lucrăm</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Un proces riguros, digitalizat, pentru un rezultat predictibil și impecabil.</p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {processSteps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`bg-surface p-8 border border-border text-center hover:border-accent transition-all group ${processReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
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
