
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';
import { Settings } from '../../types';

interface NavbarProps {
  settings?: Settings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = settings?.nav.filter(item => item.visible).sort((a, b) => a.order - b.order) || [];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl tracking-widest font-bold text-accent">CARVELLO</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              className={`text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors ${
                location.pathname === item.href ? 'text-accent' : 'text-foreground'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-surface-2 rounded-full transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'ro' ? 'en' : 'ro')}
            className="text-xs font-bold uppercase tracking-tighter w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-surface-2 transition-colors"
          >
            {lang}
          </button>

          <Link
            to="/cerere-oferta"
            className="hidden sm:block px-6 py-2 bg-accent text-white text-xs uppercase tracking-widest font-bold hover:bg-accent/90 transition-all transform hover:-translate-y-0.5"
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
        <div className="md:hidden bg-background border-b border-border animate-slide-down">
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
              className="w-full py-4 bg-accent text-white text-center font-bold tracking-widest"
            >
              {lang === 'ro' ? 'CERE OFERTĂ' : 'GET QUOTE'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
