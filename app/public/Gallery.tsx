
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Media, Settings } from '../../types';

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
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Galeria Best-of</h1>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button 
            onClick={() => setFilterRoom('All')}
            className={`px-6 py-2 text-xs uppercase font-bold tracking-widest transition-all ${filterRoom === 'All' ? 'bg-accent text-white' : 'border border-border hover:bg-surface-2'}`}
          >
            Toate
          </button>
          {settings?.rooms.map(room => (
            <button 
              key={room}
              onClick={() => setFilterRoom(room)}
              className={`px-6 py-2 text-xs uppercase font-bold tracking-widest transition-all ${filterRoom === room ? 'bg-accent text-white' : 'border border-border hover:bg-surface-2'}`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="group relative aspect-square overflow-hidden bg-surface-2">
            <img src={item.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="" />
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-accent text-[10px] font-bold uppercase tracking-widest">{item.room}</span>
              <h3 className="text-white font-serif text-xl">{item.caption ? t(item.caption) : 'Custom Piece'}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
