
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from '../../types';
import { useI18n } from '../../lib/i18n';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  settings?: Settings;
}

export const Footer: React.FC<FooterProps> = () => {
  const { lang } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 text-[#e5e5e5] font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1) BRAND */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="relative flex items-center justify-center w-10 h-10 border border-[#d4af37]/30 rotate-45 group-hover:rotate-90 transition-transform duration-700">
                <div className="absolute inset-1 bg-[#d4af37]/10 border border-[#d4af37]/50"></div>
                <span className="font-serif text-xl -rotate-45 group-hover:-rotate-90 transition-transform duration-700 font-bold text-[#d4af37]">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.2em] font-bold text-white leading-none uppercase">
                  CARVELLO
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#d4af37] font-bold mt-1">
                  Mobilier Premium & CNC
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-light max-w-xs">
              {lang === 'ro' 
                ? 'Excelență în prelucrarea digitală a lemnului și finisaje de lux. Precizie milimetrică pentru proiecte vizionare.' 
                : 'Excellence in digital woodworking and luxury finishes. Millimetric precision for visionary projects.'}
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* 2) QUICK LINKS */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4af37] mb-8">
              {lang === 'ro' ? 'Navigare' : 'Navigation'}
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/portofoliu" className="text-white/60 hover:text-white transition-colors">Portofoliu</Link></li>
              <li><Link to="/servicii" className="text-white/60 hover:text-white transition-colors">Servicii</Link></li>
              <li><Link to="/proces-garantii" className="text-white/60 hover:text-white transition-colors">Proces</Link></li>
              <li><Link to="/recenzii" className="text-white/60 hover:text-white transition-colors">Recenzii</Link></li>
            </ul>
          </div>

          {/* 3) CONTACT */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4af37] mb-8">Contact</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <span className="block text-white font-serif">Cluj-Napoca, România</span>
                  <span className="text-xs text-white/40">Atelier & Showroom</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href="tel:+40740000000" className="text-white/60 hover:text-white transition-colors">+40 740 000 000</a>
              </li>
              <li className="flex gap-4 items-start">
                <Mail className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href="mailto:contact@carvello.ro" className="text-white/60 hover:text-white transition-colors">contact@carvello.ro</a>
              </li>
            </ul>
          </div>

          {/* 4) LEGAL */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4af37] mb-8">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Politica de Confidențialitate</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Termeni și Condiții</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Politica Cookies</Link></li>
              <li className="pt-4">
                <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Guvernul_Romaniei_Logo.svg/1200px-Guvernul_Romaniei_Logo.svg.png" alt="ANPC" className="h-8 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
                  <span className="text-[9px] text-white/30 mt-1 block">ANPC - Sal" (placeholder)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <Link to="/admin/login" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/40 transition-colors cursor-default">
            © {currentYear} Carvello. {lang === 'ro' ? 'Toate drepturile rezervate.' : 'All rights reserved.'}
          </Link>
          <div className="flex gap-8">
             {/* Buton invizibil în colțul din dreapta jos */}
             <Link to="/admin/login" className="absolute bottom-0 right-0 w-16 h-16 opacity-0 z-50 cursor-default" aria-label="Admin Access"></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
