
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Media, Settings } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const Gallery: React.FC = () => {
  const { t, lang } = useI18n();
  const [media, setMedia] = useState<Media[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [filterRoom, setFilterRoom] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await dbService.getSettings();
      const allMedia = await dbService.getMedia();
      setSettings(s);
      setMedia(allMedia.filter(m => m.stars >= s.featuredStarsThreshold));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filterRoom === 'All' ? media : media.filter(m => m.room === filterRoom);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen animate-fade-in">
      <div className="mb-20 text-center">
        <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Masterpieces Gallery</span>
        <h1 className="font-serif text-5xl md:text-8xl mb-12">Arhiva de Detalii</h1>
        
        <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-4xl mx-auto">
          <button 
            onClick={() => setFilterRoom('All')}
            className={`px-8 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border ${filterRoom === 'All' ? 'bg-accent text-white border-accent' : 'border-border hover:bg-surface-2'}`}
          >
            {lang === 'ro' ? 'Toate' : 'All'}
          </button>
          {settings?.rooms.map(room => (
            <button 
              key={room}
              onClick={() => setFilterRoom(room)}
              className={`px-8 py-3 text-[10px] uppercase font-bold tracking-widest transition-all border ${filterRoom === room ? 'bg-accent text-white border-accent' : 'border-border hover:bg-surface-2'}`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          [1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-square" />)
        ) : (
          filtered.map(item => (
            <div key={item.id} className="group relative overflow-hidden bg-surface-2 border border-border shadow-sm">
              <OptimizedImage 
                src={item.url} 
                alt={item.caption ? t(item.caption) : 'CARVELLO Detail'} 
                className="grayscale-[0.3] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10 pointer-events-none">
                <span className="text-accent text-[9px] font-bold uppercase tracking-[0.3em] mb-3">{item.room} — {item.pieceTypes[0] || 'Custom'}</span>
                <h3 className="text-white font-serif text-2xl mb-4 leading-tight">{item.caption ? t(item.caption) : 'Execuție CARVELLO'}</h3>
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-[10px] ${i < item.stars ? 'text-accent' : 'text-white/20'}`}>★</span>
                  ))}
                </div>
                <div className="w-0 group-hover:w-full h-[1px] bg-accent transition-all duration-700"></div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="py-40 text-center">
          <p className="font-serif text-2xl text-muted italic">Nicio imagine în această categorie momentan.</p>
        </div>
      )}
    </div>
  );
};
