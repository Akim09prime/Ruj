
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroConfig } from '../../../types';
import { useI18n } from '../../../lib/i18n';
import { Skeleton } from '../../../components/ui/Skeleton';

interface HeroProps {
  config: HeroConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const { t, lang } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Auto-play logic for slider
  useEffect(() => {
    if (config.mode === 'slider' && config.autoplay && config.slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % config.slides.length);
      }, config.interval || 4500);
      return () => clearInterval(timer);
    }
  }, [config.mode, config.autoplay, config.slides.length, config.interval]);

  if (!config.enabled) return null;

  const heightClass = config.height === 'fullscreen' ? 'h-screen' : config.height === 'large' ? 'h-[80vh]' : 'h-[60vh]';
  const overlayOpacity = config.overlayStrength / 100;

  // --- CONTENT RENDERER (Text & Buttons) ---
  const renderContent = (
    eyebrow: string, 
    title1: string, 
    title2: string, 
    subtitle: string, 
    cta1: { label: string, href: string }, 
    cta2: { label: string, href: string, visible?: boolean },
    features?: string[]
  ) => (
    <div className={`relative z-10 max-w-7xl mx-auto px-6 w-full pt-20 flex flex-col justify-center h-full ${config.align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      <div className={`max-w-4xl transition-all duration-1000 animate-slide-up`}>
        {eyebrow && <span className="block text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-4 animate-fade-in">{eyebrow}</span>}
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-8 tracking-tight">
          {title1}<br/>
          <span className="text-accent italic">{title2}</span>
        </h1>
        
        <p className={`text-lg md:text-xl font-light text-white/80 mb-12 max-w-2xl leading-relaxed ${config.align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-5 mb-12 ${config.align === 'center' ? 'justify-center' : ''}`}>
          <Link to={cta1.href} className="px-10 py-5 bg-accent text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-accent transition-all shadow-xl shadow-accent/20 text-center">
            {cta1.label}
          </Link>
          {cta2.visible !== false && (
            <Link to={cta2.href} className="px-10 py-5 border border-white/30 text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-black transition-all text-center backdrop-blur-sm">
              {cta2.label}
            </Link>
          )}
        </div>

        {features && features.length > 0 && (
          <div className={`flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/50 border-t border-white/10 pt-8 w-max ${config.align === 'center' ? 'mx-auto' : ''}`}>
             {features.map((f, i) => (
               <React.Fragment key={i}>
                 <span>{f}</span>
                 {i < features.length - 1 && <span className="text-accent">•</span>}
               </React.Fragment>
             ))}
          </div>
        )}
      </div>
    </div>
  );

  // --- MODE: VIDEO ---
  if (config.mode === 'video') {
    return (
      <section className={`relative ${heightClass} flex items-center bg-black overflow-hidden group`}>
        <div className="absolute inset-0 z-0">
          {/* Fallback Image */}
          <img 
            src={config.posterUrl} 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
            alt="Hero Background"
            loading="eager"
            fetchPriority="high"
          />
          {/* Video */}
          {config.videoUrl && (
            <video
              autoPlay={true}
              muted={config.muted}
              loop={config.loop}
              playsInline={true}
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src={config.videoUrl} type="video/mp4" />
            </video>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        {renderContent(
          t(config.eyebrow),
          t(config.titleLine1),
          t(config.titleLine2),
          t(config.subtitle),
          { label: t(config.primaryCta.label), href: config.primaryCta.href },
          { label: t(config.secondaryCta.label), href: config.secondaryCta.href, visible: config.secondaryCta.visible },
          config.microFeatures
        )}
      </section>
    );
  }

  // --- MODE: SLIDER ---
  if (config.mode === 'slider') {
    const slides = config.slides.length > 0 ? config.slides : []; // Fallback handled in parent or config
    if (slides.length === 0) return <Skeleton className={heightClass} />;

    return (
      <section className={`relative ${heightClass} flex items-center bg-black overflow-hidden`}>
        {slides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0">
              <img 
                src={slide.imageUrl} 
                className={`w-full h-full object-cover transform transition-transform duration-[10s] ${idx === currentSlide ? 'scale-110' : 'scale-100'}`}
                alt={t(slide.title)}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                decoding={idx === 0 ? "sync" : "async"}
              />
               <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>
            {idx === currentSlide && renderContent(
              t(config.eyebrow),
              t(slide.title),
              '', // No highlight line in slider mode usually, or could split title
              t(slide.subtitle),
              { label: t(slide.primaryCta.label), href: slide.primaryCta.href },
              { label: t(slide.secondaryCta.label), href: slide.secondaryCta.href },
              config.microFeatures
            )}
          </div>
        ))}
        
        {/* Bullets */}
        <div className="absolute bottom-10 left-0 w-full z-20 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // --- MODE: IMAGE (Standard) ---
  return (
    <section className={`relative ${heightClass} flex items-center bg-black overflow-hidden group`}>
       <div className="absolute inset-0 z-0">
          <img 
            src={config.posterUrl} 
            className="w-full h-full object-cover animate-slow-zoom"
            alt="Hero Background"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        {renderContent(
          t(config.eyebrow),
          t(config.titleLine1),
          t(config.titleLine2),
          t(config.subtitle),
          { label: t(config.primaryCta.label), href: config.primaryCta.href },
          { label: t(config.secondaryCta.label), href: config.secondaryCta.href, visible: config.secondaryCta.visible },
          config.microFeatures
        )}
    </section>
  );
};
