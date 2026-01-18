
import React from 'react';
import { Link } from 'react-router-dom';

export const Maintenance: React.FC = () => {
  return (
    <div className="h-screen w-full bg-black text-[#F2F2EF] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="font-serif text-5xl md:text-8xl text-white mb-8 tracking-tighter">CARVELLO</h1>
        <div className="w-24 h-1 bg-[#C9A24A] mx-auto mb-10"></div>
        <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-6 italic">Site în Construcție</h2>
        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-12">
          Lucrăm la o nouă experiență digitală. Revenim în curând cu proiecte noi și o platformă complet actualizată.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
           <div className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24A] font-bold">
             Contact Rapid
           </div>
           <a href="mailto:office@carvello.ro" className="text-white/80 hover:text-white transition-colors border-b border-white/20 pb-1 text-sm tracking-widest">
             office@carvello.ro
           </a>
        </div>
      </div>

      {/* Secret Admin Button (Bottom Right) - Visible only on hover */}
      <Link 
        to="/admin/login" 
        className="fixed bottom-0 right-0 w-24 h-24 z-50 flex items-center justify-center opacity-0 hover:opacity-50 transition-all duration-500 cursor-pointer"
        title="Admin Access"
      >
        <span className="text-3xl filter grayscale hover:grayscale-0">🔒</span>
      </Link>
    </div>
  );
};
