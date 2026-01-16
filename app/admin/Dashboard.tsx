
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Lead, Project, Media } from '../../types';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mediaCount, setMediaCount] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const l = await dbService.getLeads();
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      setLeads(l);
      setProjects(p);
      setMediaCount(m.length);
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    const data = await dbService.exportDB();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carvello-db-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleReset = async () => {
    await dbService.resetToSeed();
    window.location.reload();
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="font-serif text-4xl mb-2">Control Panel</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold italic">Bine ai revenit în inima digitală CARVELLO</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={handleExport} className="px-6 py-3 border border-border text-[9px] uppercase font-bold tracking-widest hover:bg-foreground hover:text-white transition-all">
            Export Arhivă
          </button>
          <button onClick={() => setShowResetModal(true)} className="px-6 py-3 border border-red-500/50 text-red-500 text-[9px] uppercase font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Reset Sistem
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="bg-surface p-10 border border-border shadow-sm group hover:border-accent transition-all">
          <h3 className="text-muted text-[9px] uppercase tracking-widest font-bold mb-6">Proiecte Active</h3>
          <span className="text-6xl font-serif text-accent">{projects.length}</span>
          <Link to="/admin/projects" className="block mt-6 text-accent text-[9px] uppercase font-bold tracking-widest hover:underline">Gestiune Producție →</Link>
        </div>
        <div className="bg-surface p-10 border border-border shadow-sm group hover:border-accent transition-all">
          <h3 className="text-muted text-[9px] uppercase tracking-widest font-bold mb-6">Leads Noi</h3>
          <span className="text-6xl font-serif text-accent">{leads.filter(l => l.status === 'new').length}</span>
          <Link to="/admin/leads" className="block mt-6 text-accent text-[9px] uppercase font-bold tracking-widest hover:underline">Inbox Mesaje →</Link>
        </div>
        <div className="bg-surface p-10 border border-border shadow-sm group hover:border-accent transition-all">
          <h3 className="text-muted text-[9px] uppercase tracking-widest font-bold mb-6">Media Assets</h3>
          <span className="text-6xl font-serif text-accent">{mediaCount}</span>
          <Link to="/admin/media" className="block mt-6 text-accent text-[9px] uppercase font-bold tracking-widest hover:underline">Galerie Globală →</Link>
        </div>
        <div className="bg-surface p-10 border border-border shadow-sm group hover:border-accent transition-all">
          <h3 className="text-muted text-[9px] uppercase tracking-widest font-bold mb-6">Configurație</h3>
          <span className="text-6xl font-serif text-accent">⚙</span>
          <Link to="/admin/settings" className="block mt-6 text-accent text-[9px] uppercase font-bold tracking-widest hover:underline">Setări Brand →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-surface border border-border shadow-sm">
          <div className="p-8 border-b border-border flex justify-between items-center">
            <h2 className="font-serif text-2xl">Cereri Recente</h2>
            <Link to="/admin/leads" className="text-[9px] uppercase font-bold tracking-widest text-accent hover:underline">Vezi Tot</Link>
          </div>
          <div className="divide-y divide-border">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="p-6 hover:bg-surface-2 transition-colors group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">{lead.name}</span>
                  <span className={`text-[8px] px-3 py-1 rounded font-bold uppercase tracking-widest ${lead.status === 'new' ? 'bg-accent text-white' : 'bg-green-500/20 text-green-600'}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-muted truncate italic">"{lead.message}"</p>
                <div className="mt-2 text-[8px] uppercase tracking-tighter text-muted/50">{new Date(lead.createdAt).toLocaleDateString()} — {lead.city}</div>
              </div>
            ))}
            {leads.length === 0 && <p className="p-12 text-center text-muted italic font-serif">Arhiva de leads este goală.</p>}
          </div>
        </div>
        
        <div className="bg-surface border border-border shadow-sm">
          <div className="p-8 border-b border-border">
            <h2 className="font-serif text-2xl">Quick Actions</h2>
          </div>
          <div className="p-10 grid grid-cols-2 gap-6">
             <Link to="/admin/settings" className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Nomenclatoare</Link>
             <Link to="/admin/pages" className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Editor Pagini</Link>
             <Link to="/" className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Vezi Site Public</Link>
             <button onClick={() => window.location.reload()} className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Refresh App</button>
          </div>
        </div>
      </div>

      {/* Reset System Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-background max-w-md w-full p-12 border border-border shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 className="font-serif text-3xl mb-4">Resetare Totală</h2>
            <p className="text-muted text-xs mb-10 leading-relaxed uppercase tracking-[0.2em] font-bold">Această acțiune va șterge TOATE modificările făcute (Proiecte, Media, Pagini, Leads) și va readuce platforma la setările inițiale de test.</p>
            <div className="flex flex-col space-y-3">
              <button onClick={handleReset} className="w-full py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20">ȘTERGE TOT & RESETEAZĂ</button>
              <button onClick={() => setShowResetModal(false)} className="w-full py-4 border border-border text-muted font-bold uppercase tracking-widest text-[9px] hover:bg-surface-2 transition-all">ANULEAZĂ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
