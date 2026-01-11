
import React from 'react';
import { useI18n } from '../../lib/i18n';

export const Contact: React.FC = () => {
  const { lang } = useI18n();

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h1 className="font-serif text-6xl md:text-8xl mb-12">Contact</h1>
          <div className="space-y-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Adresă Atelier</p>
              <p className="text-2xl font-light">Strada Industriei Nr. 10,<br />Cluj-Napoca, România</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Email & Telefon</p>
              <p className="text-2xl font-light">office@carvello.ro<br />+40 700 000 000</p>
            </div>
            <div className="flex space-x-6 pt-8">
              <a href="#" className="text-xs uppercase font-bold tracking-widest hover:text-accent underline">Instagram</a>
              <a href="#" className="text-xs uppercase font-bold tracking-widest hover:text-accent underline">Facebook</a>
              <a href="#" className="text-xs uppercase font-bold tracking-widest hover:text-accent underline">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="h-[600px] bg-surface-2 border border-border grayscale hover:grayscale-0 transition-all">
          {/* Mock Map Placeholder */}
          <div className="w-full h-full flex items-center justify-center text-muted uppercase tracking-widest text-xs">
            Google Maps Integration
          </div>
        </div>
      </div>
    </div>
  );
};
