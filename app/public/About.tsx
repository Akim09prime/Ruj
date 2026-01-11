
import React from 'react';
import { useI18n } from '../../lib/i18n';

export const About: React.FC = () => {
  const { lang } = useI18n();
  
  return (
    <div className="pt-20">
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-4">Ethos Carvello</span>
            <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
              {lang === 'ro' ? 'Unde precizia întâlnește arta.' : 'Where precision meets art.'}
            </h1>
            <div className="space-y-6 text-lg text-muted font-light leading-relaxed">
              <p>
                {lang === 'ro' 
                  ? 'Fondat pe principiul controlului absolut, Carvello redefineste mobilierul la comandă prin utilizarea tehnologiei CNC de ultimă oră și a finisajelor 2K profesionale.'
                  : 'Founded on the principle of absolute control, Carvello redefines custom furniture by using cutting-edge CNC technology and professional 2K finishes.'}
              </p>
              <p>
                {lang === 'ro'
                  ? 'Nu suntem doar un atelier; suntem un hub tehnic unde viziunea arhitecturală prinde formă cu o toleranță de sub un milimetru.'
                  : 'We are not just a workshop; we are a technical hub where architectural vision takes shape with a tolerance of less than one millimeter.'}
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] bg-surface-2 border border-border overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover grayscale"
              alt="Workshop"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="font-serif text-4xl mb-4 text-accent">0.1 mm</h3>
            <p className="uppercase tracking-widest text-xs font-bold text-muted">Precizie Execuție</p>
          </div>
          <div>
            <h3 className="font-serif text-4xl mb-4 text-accent">100%</h3>
            <p className="uppercase tracking-widest text-xs font-bold text-muted">Finisaj 2K Premium</p>
          </div>
          <div>
            <h3 className="font-serif text-4xl mb-4 text-accent">5 Ani</h3>
            <p className="uppercase tracking-widest text-xs font-bold text-muted">Garanție Structură</p>
          </div>
        </div>
      </section>
    </div>
  );
};
