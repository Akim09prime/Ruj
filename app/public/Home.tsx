
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { ArrowRight, Cpu, Gem, Hammer, PencilRuler, ChevronDown, Quote, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

// --- STATIC CONTENT FOR SEO & PERFORMANCE ---
const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000",
    title: { ro: "Mobilier Premium la Comandă", en: "Premium Bespoke Furniture" },
    subtitle: { ro: "Proiectare, producție CNC și randări profesionale pentru interioare de lux.", en: "Design, CNC production, and professional rendering for luxury interiors." },
    ctaPrimary: { text: { ro: "Vezi Portofoliu", en: "View Portfolio" }, link: "/portofoliu" },
    ctaSecondary: { text: { ro: "Solicită Ofertă", en: "Request Quote" }, link: "/contact" }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
    title: { ro: "Servicii CNC de Precizie", en: "Precision CNC Services" },
    subtitle: { ro: "Tehnologie computerizată pentru frezări complexe și detalii arhitecturale perfecte.", en: "Computerized technology for complex milling and perfect architectural details." },
    ctaPrimary: { text: { ro: "Descoperă Servicii CNC", en: "Discover CNC Services" }, link: "/servicii" },
    ctaSecondary: { text: { ro: "Contactează-ne", en: "Contact Us" }, link: "/contact" }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
    title: { ro: "Proiectare & Design Interior", en: "Interior Design & Planning" },
    subtitle: { ro: "Vizualizează conceptul în detaliu înainte de execuție. Randări fotorealiste.", en: "Visualize the concept in detail before execution. Photorealistic renderings." },
    ctaPrimary: { text: { ro: "Vezi Servicii Proiectare", en: "View Design Services" }, link: "/servicii" },
    ctaSecondary: { text: { ro: "Programează Discuție", en: "Schedule Talk" }, link: "/contact" }
  }
];

const PILLARS = [
  { 
    icon: PencilRuler,
    title: { ro: "Proiectare & Randare 3D", en: "3D Design & Rendering" }, 
    desc: { ro: "Vizualizare fotorealistă înainte de execuție. Vezi exact cum va arăta spațiul tău.", en: "Photorealistic visualization before execution. See exactly how your space will look." } 
  },
  { 
    icon: Cpu,
    title: { ro: "Producție CNC de Precizie", en: "Precision CNC Production" }, 
    desc: { ro: "Tehnologie computerizată pentru detalii milimetrice și îmbinări perfecte.", en: "Computerized technology for millimetric details and perfect joints." } 
  },
  { 
    icon: Gem,
    title: { ro: "Finisaje Premium", en: "Premium Finishes" }, 
    desc: { ro: "Vopsire 2K, furnir natural, inserții metalice și materiale de cea mai înaltă calitate.", en: "2K painting, natural veneer, metal inserts, and highest quality materials." } 
  },
  { 
    icon: Hammer,
    title: { ro: "Montaj & Livrare", en: "Installation & Delivery" }, 
    desc: { ro: "Echipă proprie specializată, fără compromisuri. Lăsăm curățenie lună în urma noastră.", en: "In-house specialized team, no compromises. We leave everything spotless." } 
  }
];

const PROCESS_STEPS = [
  { 
    title: { ro: "Consultare", en: "Consultation" },
    desc: { ro: "Discutăm viziunea, bugetul și cerințele tehnice.", en: "We discuss vision, budget, and technical requirements." }
  },
  { 
    title: { ro: "Măsurători & Proiectare", en: "Measurements & Design" },
    desc: { ro: "Releu digital și proiectare 3D detaliată.", en: "Digital survey and detailed 3D design." }
  },
  { 
    title: { ro: "Ofertare & Contract", en: "Quote & Contract" },
    desc: { ro: "Transparență totală asupra costurilor și termenelor.", en: "Full transparency on costs and deadlines." }
  },
  { 
    title: { ro: "Producție CNC", en: "CNC Production" },
    desc: { ro: "Execuție milimetrică în atelierul propriu.", en: "Millimetric execution in our own workshop." }
  },
  { 
    title: { ro: "Livrare & Montaj", en: "Delivery & Installation" },
    desc: { ro: "Montaj rapid și curat, realizat de profesioniști.", en: "Fast and clean installation by professionals." }
  }
];

const FALLBACK_PROJECTS = [
  {
    id: 'demo-1',
    title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
    summary: { ro: 'Amenajare completă marcată de accente minimaliste și finisaje mate.', en: 'Complete furnishing marked by minimalist accents and matte finishes.' },
    projectType: 'REZIDENȚIAL',
    location: { ro: 'București', en: 'Bucharest' },
    coverUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    isReal: false
  },
  {
    id: 'demo-2',
    title: { ro: 'Showroom Luxury', en: 'Luxury Showroom' },
    summary: { ro: 'Panotări CNC și mobilier statement pentru un spațiu comercial exclusivist.', en: 'CNC paneling and statement furniture for an exclusive commercial space.' },
    projectType: 'COMERCIAL',
    location: { ro: 'Cluj-Napoca', en: 'Cluj-Napoca' },
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    isReal: false
  },
  {
    id: 'demo-3',
    title: { ro: 'Villa Azure', en: 'Villa Azure' },
    summary: { ro: 'Bucătărie și dressing-uri custom cu inserții de bronz și piatră naturală.', en: 'Custom kitchen and walk-in closets with bronze inserts and natural stone.' },
    projectType: 'REZIDENȚIAL',
    location: { ro: 'Brașov', en: 'Brasov' },
    coverUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
    isReal: false
  },
  {
    id: 'demo-4',
    title: { ro: 'Executive Office', en: 'Executive Office' },
    summary: { ro: 'Spațiu de lucru definit prin eleganță, funcționalitate și lemn masiv.', en: 'Workspace defined by elegance, functionality, and solid wood.' },
    projectType: 'OFFICE',
    location: { ro: 'Timișoara', en: 'Timisoara' },
    coverUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
    isReal: false
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
  // Initialize with fallback to avoid layout shift/loading state
  const [displayProjects, setDisplayProjects] = useState<any[]>(FALLBACK_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const pillarsReveal = useReveal();
  const aboutReveal = useReveal();
  const projectsReveal = useReveal();

  useEffect(() => {
    // SEO: Set Title
    document.title = "CARVELLO | Mobilier Premium la Comandă";
    
    // SEO: Meta Description (Manual injection if not present)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Carvello produce mobilier premium la comandă, utilizând tehnologie CNC și finisaje de lux. Proiectare personalizată pentru rezidențial și comercial.');

    // SEO: JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Carvello",
      "url": "https://carvello.ro",
      "logo": "https://carvello.ro/logo.png",
      "description": "Mobilier Premium la Comandă",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Romania"
      }
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const dbProjects = await dbService.getProjects();
        const media = await dbService.getMedia();
        
        const realProjects = dbProjects
          .filter(p => p.isPublished && (p.isVisible !== false))
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

        if (realProjects.length > 0) {
          // If we have real projects, use them (fill with fallback if < 4)
          if (realProjects.length >= 4) {
            setDisplayProjects(realProjects.slice(0, 4));
          } else {
            setDisplayProjects([...realProjects, ...FALLBACK_PROJECTS].slice(0, 4));
          }
        }
      } catch (e) {
        console.error("Failed to fetch projects", e);
        // Keep fallback
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Slider Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* 1) HERO SLIDER SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={lang === 'ro' ? slide.title.ro : slide.title.en}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 w-full mt-20 md:mt-0">
                <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="inline-block mb-6 border-l-2 border-[#d4af37] pl-4">
                    <span className="text-[#d4af37] uppercase tracking-[0.3em] text-xs font-bold">
                      {lang === 'ro' ? 'Arhitectură & Design' : 'Architecture & Design'}
                    </span>
                  </div>
                  
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 text-white tracking-tight max-w-5xl">
                    {lang === 'ro' ? slide.title.ro : slide.title.en}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mb-12 leading-relaxed">
                    {lang === 'ro' ? slide.subtitle.ro : slide.subtitle.en}
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <Link 
                      to={slide.ctaPrimary.link}
                      className="group relative px-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs overflow-hidden text-center"
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        {lang === 'ro' ? slide.ctaPrimary.text.ro : slide.ctaPrimary.text.en}
                      </span>
                      <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                    </Link>
                    
                    <Link 
                      to={slide.ctaSecondary.link}
                      className="group px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>{lang === 'ro' ? slide.ctaSecondary.text.ro : slide.ctaSecondary.text.en}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-6 md:right-10 z-20 flex items-center gap-4">
          <button 
            onClick={prevSlide}
            className="p-3 border border-white/10 text-white/50 hover:text-white hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all rounded-full"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#d4af37] w-8' : 'bg-white/30 hover:bg-white'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-3 border border-white/10 text-white/50 hover:text-white hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all rounded-full"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 z-20 hidden md:block">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* 2) TRUST / DIFFERENTIATORS */}
      <section className="py-24 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={pillarsReveal.ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${pillarsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {PILLARS.map((p, i) => (
              <div key={i} className="group p-8 border border-white/5 hover:border-[#d4af37]/30 bg-[#050505] transition-all duration-500 hover:-translate-y-2">
                <div className="mb-6 text-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity">
                  <p.icon strokeWidth={1} className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg text-white mb-3 group-hover:text-[#d4af37] transition-colors">{lang === 'ro' ? p.title.ro : p.title.en}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  {lang === 'ro' ? p.desc.ro : p.desc.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3) ABOUT CARVELLO */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div ref={aboutReveal.ref} className={`transition-all duration-1000 ${aboutReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">
              {lang === 'ro' ? 'Ecosistem Complet' : 'Complete Ecosystem'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
              {lang === 'ro' ? 'Design, Precizie și Execuție Premium.' : 'Design, Precision, and Premium Execution.'}
            </h2>
            
            <div className="space-y-8">
              <p className="text-white/80 font-light text-lg leading-relaxed">
                {lang === 'ro' 
                  ? "Carvello unește designul, randarea, producția CNC și mobilierul premium la comandă într-un proces controlat, elegant și profesionist. Nu livrăm doar piese de mobilier, ci soluții arhitecturale integrate."
                  : "Carvello unites design, rendering, CNC production, and premium custom furniture into a controlled, elegant, and professional process. We deliver not just furniture pieces, but integrated architectural solutions."}
              </p>

              {/* 3 PILLARS */}
              <div className="space-y-6 border-l border-white/10 pl-6 my-8">
                <div className="group">
                  <h3 className="text-white font-serif text-xl mb-1 group-hover:text-[#d4af37] transition-colors">
                    {lang === 'ro' ? 'Mobilier Premium la Comandă' : 'Premium Custom Furniture'}
                  </h3>
                  <p className="text-white/50 text-sm font-light">
                    {lang === 'ro' ? 'Execuție personalizată, materiale nobile și finisaje impecabile.' : 'Custom execution, noble materials, and flawless finishes.'}
                  </p>
                </div>
                <div className="group">
                  <h3 className="text-white font-serif text-xl mb-1 group-hover:text-[#d4af37] transition-colors">
                    {lang === 'ro' ? 'Servicii CNC de Precizie' : 'Precision CNC Services'}
                  </h3>
                  <p className="text-white/50 text-sm font-light">
                    {lang === 'ro' ? 'Tehnologie computerizată pentru detalii complexe și îmbinări perfecte.' : 'Computerized technology for complex details and perfect joints.'}
                  </p>
                </div>
                <div className="group">
                  <h3 className="text-white font-serif text-xl mb-1 group-hover:text-[#d4af37] transition-colors">
                    {lang === 'ro' ? 'Proiectare & Randare 3D' : '3D Design & Rendering'}
                  </h3>
                  <p className="text-white/50 text-sm font-light">
                    {lang === 'ro' ? 'Vizualizare fotorealistă pentru decizii clare înainte de producție.' : 'Photorealistic visualization for clear decisions before production.'}
                  </p>
                </div>
              </div>

              {/* DIFFERENTIATION BLOCK */}
              <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <p className="text-white/90 text-sm italic font-serif">
                  {lang === 'ro' 
                    ? '"Control total asupra procesului. Fără intermediari, fără surprize. Doar estetică și funcționalitate în perfect echilibru."'
                    : '"Total control over the process. No intermediaries, no surprises. Just aesthetics and functionality in perfect balance."'}
                </p>
              </div>

              <div className="mt-8">
                 <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                   {lang === 'ro' ? 'Discută Proiectul Tău' : 'Discuss Your Project'} <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
            </div>
          </div>

          {/* IMAGE COMPOSITION */}
          <div className="relative h-[700px] w-full group">
            <div className="absolute top-4 right-4 w-full h-full border border-white/10 z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute inset-0 z-10 overflow-hidden bg-[#111]">
               <img 
                 src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=1000" 
                 alt="Carvello Premium Detail" 
                 className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            {/* Secondary Image Overlay */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 z-20 hidden lg:block border border-white/10 bg-[#050505] p-2">
               <img 
                 src="https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=400" 
                 alt="Wood Texture" 
                 className="w-full h-full object-cover opacity-80"
               />
            </div>
          </div>
        </div>
      </section>

      {/* 4) PROCESS STRIP */}
      <section className="py-20 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-[10px] font-bold block mb-4">
              {lang === 'ro' ? 'Procesul Nostru' : 'Our Process'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              {lang === 'ro' ? 'De la Concept la Realitate' : 'From Concept to Reality'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10 z-0"></div>
            
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="relative z-10 group text-center">
                <div className="w-24 h-24 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-[#d4af37] transition-colors duration-300 relative">
                  <span className="font-serif text-2xl text-white/50 group-hover:text-[#d4af37] transition-colors">0{i + 1}</span>
                  <div className="absolute inset-0 rounded-full border border-[#d4af37] scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3 group-hover:text-[#d4af37] transition-colors">
                  {lang === 'ro' ? step.title.ro : step.title.en}
                </h3>
                <p className="text-xs text-white/40 font-light px-2 leading-relaxed">
                  {lang === 'ro' ? step.desc.ro : step.desc.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5) PORTFOLIO TEASER */}
      <section className="py-24 bg-[#050505] px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={projectsReveal.ref} className={`flex flex-col md:flex-row justify-between items-end mb-20 transition-all duration-1000 ${projectsReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-2xl">
              <span className="text-[#d4af37] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6">Portofoliu</span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                {lang === 'ro' ? 'Selecție de Proiecte' : 'Selected Projects'}
              </h2>
              <p className="text-white/60 font-light text-lg leading-relaxed">
                {lang === 'ro' 
                  ? 'O colecție de interioare definite prin precizie, materiale nobile și o execuție fără compromisuri.' 
                  : 'A collection of interiors defined by precision, noble materials, and uncompromising execution.'}
              </p>
            </div>
            <Link to="/portofoliu" className="hidden md:flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest border-b border-[#d4af37] pb-1 hover:text-[#d4af37] transition-colors">
              {lang === 'ro' ? 'Vezi Portofoliul Complet' : 'View Full Portfolio'} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {displayProjects.map((p, i) => (
              <Link 
                to={p.isReal ? `/proiect/${p.id}` : '/portofoliu'} 
                key={p.id} 
                className={`group block ${i % 2 === 1 ? 'md:mt-12' : ''}`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#111] relative mb-8">
                  <OptimizedImage 
                    src={p.coverUrl} 
                    alt={t(p.title)} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-white text-[10px] uppercase font-bold tracking-widest">View</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 group-hover:border-[#d4af37]/50 transition-colors duration-500">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest">
                      {p.projectType}
                    </span>
                    <span className="text-white/40 text-xs font-light">{t(p.location)}</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white group-hover:text-[#d4af37] transition-colors duration-300 mb-3">
                    {t(p.title)}
                  </h3>
                  <p className="text-white/50 text-sm font-light line-clamp-2 max-w-md">
                    {t(p.summary)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center md:hidden">
            <Link to="/portofoliu" className="inline-block border border-white/20 px-8 py-4 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              {lang === 'ro' ? 'Vezi Portofoliu' : 'View Portfolio'}
            </Link>
          </div>
        </div>
      </section>

      {/* 6) FINAL CTA */}
      <section className="py-24 bg-[#0a0a0a] px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Quote className="w-12 h-12 text-[#d4af37] mx-auto mb-8 opacity-50" />
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
            {lang === 'ro' ? 'Ai un proiect special?' : 'Have a special project?'}
          </h2>
          <p className="text-white/60 text-lg font-light mb-12 max-w-2xl mx-auto">
            {lang === 'ro' 
              ? 'Discută cu echipa noastră tehnică. Oferim consultanță gratuită pentru proiecte high-end.' 
              : 'Talk to our technical team. We offer free consultation for high-end projects.'}
          </p>
          <Link to="/contact" className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d4af37] hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            {lang === 'ro' ? 'Solicită Ofertă' : 'Request Quote'}
          </Link>
        </div>
      </section>

    </div>
  );
};
