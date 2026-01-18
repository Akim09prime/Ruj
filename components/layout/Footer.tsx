
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from '../../types';
import { useI18n } from '../../lib/i18n';

interface FooterProps {
  settings?: Settings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { t, lang } = useI18n();
  
  if (!settings) return null;

  return (
    <footer className="bg-surface border-t border-border pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <div className="mb-8">
               <span className="font-serif text-3xl tracking-widest font-bold text-accent block">
                 {settings.brand.brandName || 'CARVELLO'}
               </span>
               <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold block mt-2">
                 {settings.brand.brandSlogan || 'Executat milimetric.'}
               </span>
            </div>
            <p className="text-muted text-lg max-w-sm leading-relaxed font-light">
              {lang === 'ro' 
                ? 'Excelență în prelucrarea digitală a lemnului și finisaje de lux. Precizie milimetrică pentru proiecte vizionare.' 
                : 'Excellence in digital woodworking and luxury finishes. Millimetric precision for visionary projects.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-8">Contact</h4>
            <div className="space-y-4 text-sm">
              <p className="text-muted">{settings.footer.contact.address}</p>
              <p className="font-bold">{settings.footer.contact.phone}</p>
              <p className="font-bold">{settings.footer.contact.email}</p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-8">Social</h4>
            <div className="space-y-4 text-sm">
              {settings.footer.socials.map((s, i) => (
                <a key={i} href={s.url} className="block text-muted hover:text-accent transition-colors">
                  {s.platform}
                </a>
              ))}
              <Link to="/admin/login" className="block text-[10px] uppercase tracking-widest text-muted/30 pt-8 hover:text-accent transition-colors">
                CMS Access
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted/60">
            {t(settings.footer.legal)}
          </p>
          <div className="flex space-x-8 text-[10px] uppercase tracking-[0.2em] text-muted/60">
            <Link to="/contact" className="hover:text-foreground">Politica de Confidențialitate</Link>
            <Link to="/contact" className="hover:text-foreground">Termeni și Condiții</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
