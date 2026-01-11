
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
        .slice(0, 6);
      setFeaturedMedia(filtered);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero furniture"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <h1 className="font-serif text-5xl md:text-8xl leading-tight mb-6 max-w-4xl">
            {lang === 'ro' 
              ? 'Mobilier la comandă, cu precizie milimetrică.' 
              : 'Custom furniture, with millimetric precision.'}
          </h1>
          <p className="text-lg md:text-2xl font-light mb-12 max-w-2xl text-white/80">
            {lang === 'ro'
              ? 'Proiectare. CNC. Finisaj 2K. Montaj. Totul sub control — de la schiță la rezultat.'
              : 'Design. CNC. 2K Finish. Assembly. Everything under control — from sketch to result.'}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/cerere-oferta" className="px-10 py-4 bg-accent text-white font-bold tracking-widest uppercase hover:bg-white hover:text-accent transition-all">
              {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
            </Link>
            <Link to="/portofoliu" className="px-10 py-4 border border-white text-white font-bold tracking-widest uppercase hover:bg-white/10 transition-all">
              {lang === 'ro' ? 'Portofoliu' : 'Portfolio'}
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { title: { ro: 'Precizie CNC', en: 'CNC Precision' }, icon: '📐' },
              { title: { ro: 'Finisaj 2K Premium', en: '2K Premium Finish' }, icon: '✨' },
              { title: { ro: 'Proiectare & Randare', en: 'Design & Rendering' }, icon: '💻' },
              { title: { ro: 'Execuție Controlată', en: 'Controlled Execution' }, icon: '🛠️' },
            ].map((p, i) => (
              <div key={i} className="group border-b border-border pb-8">
                <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{p.icon}</div>
                <h3 className="font-serif text-2xl mb-2">{t(p.title)}</h3>
                <div className="w-8 h-0.5 bg-accent group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Strip */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-2">Portfolio Selection</span>
              <h2 className="font-serif text-4xl md:text-5xl">Elemente de Excepție</h2>
            </div>
            <Link to="/galerie-mobilier" className="text-sm border-b border-accent pb-1 uppercase tracking-widest hover:text-accent">
              Explorează Galeria
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/5]" />)
            ) : (
              featuredMedia.map(m => (
                <div key={m.id} className="group relative aspect-[4/5] overflow-hidden bg-surface-2">
                  <img src={m.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{m.room}</span>
                    <h3 className="text-white font-serif text-2xl">{m.caption ? t(m.caption) : 'Custom Piece'}</h3>
                    <Link to={`/proiect/${m.projectId}`} className="text-white/60 text-xs uppercase tracking-tighter mt-4 hover:text-white">View Project</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
