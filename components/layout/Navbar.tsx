
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';
import { Settings, Theme } from '../../types';

interface NavbarProps {
  settings?: Settings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const { lang, setLang, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = (settings?.nav.filter(item => {
    if (!item.visible) return false;
    if (location.pathname === '/' && item.href === '/') return false;
    return true;
  }).sort((a, b) => a.order - b.order) || []);

  const isDark = ['dark', 'obsidian', 'navy', 'emerald', 'industrial'].includes(theme);

  const toggleTheme = () => {
    const newTheme: Theme = isDark ? 'marble' : 'obsidian';
    setTheme(newTheme);
  };

  const Logo = () => {
    const brand = settings?.brand;
    if (!brand) return <span className="font-serif text-2xl tracking-[0.2em] font-bold text-accent">CARVELLO</span>;

    if (brand.useTextLogo || (!brand.logoDarkUrl && !brand.logoLightUrl)) {
      return (
        <div className="flex flex-col">
          <span className="font-serif text-2xl lg:text-3xl tracking-[0.25em] font-bold text-foreground leading-none">
            {brand.brandName || 'CARVELLO'}
          </span>
          {brand.brandSlogan && (
            <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold mt-1 text-right">
              {brand.brandSlogan}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <img 
          src={isDark ? brand.logoDarkUrl : brand.logoLightUrl} 
          alt={brand.brandName} 
          className="h-8 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              className={`text-[10px] uppercase tracking-[0.25em] font-bold hover:text-accent transition-all duration-300 relative group ${
                location.pathname === item.href ? 'text-accent' : 'text-foreground/70'
              }`}
            >
              {t(item.label)}
              <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full ${location.pathname === item.href ? 'w-full' : ''}`}></span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-2 rounded-full transition-colors border border-border/50"
            title="Schimbă Atmosfera"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'ro' ? 'en' : 'ro')}
            className="text-[9px] font-bold uppercase tracking-tighter w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface-2 transition-colors"
          >
            {lang}
          </button>

          <Link
            to="/cerere-oferta"
            className="hidden sm:block px-6 py-2 bg-accent text-white text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-foreground transition-all transform hover:-translate-y-0.5 shadow-lg shadow-accent/20"
          >
            {lang === 'ro' ? 'Cere Ofertă' : 'Get Quote'}
          </Link>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <div className={`w-6 h-0.5 bg-foreground mb-1.5 transition-all ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-foreground mb-1.5 transition-all ${isMobileOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-foreground transition-all ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="px-6 py-8 flex flex-col space-y-6">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-lg font-serif tracking-wide border-b border-border/20 pb-2"
              >
                {t(item.label)}
              </Link>
            ))}
            <Link
              to="/cerere-oferta"
              onClick={() => setIsMobileOpen(false)}
              className="w-full py-4 bg-accent text-white text-center font-bold tracking-widest text-[10px]"
            >
              {lang === 'ro' ? 'CERE OFERTĂ' : 'GET QUOTE'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
