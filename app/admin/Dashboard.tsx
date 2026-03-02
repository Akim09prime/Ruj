
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Lead, Project, Offer } from '../../types';
import { FileText, Plus, Send, Briefcase, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [mediaCount, setMediaCount] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const session = await dbService.getSession();
      setUserRole(session.role || 'agent');
      setUsername(session.user || '');

      const l = await dbService.getLeads();
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      const o = await dbService.getOffers();
      
      setLeads(l);
      setProjects(p);
      setMediaCount(m.length);
      setOffers(o);
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

  // --- AGENT DASHBOARD ---
  if (userRole === 'agent') {
    const myOffers = offers.filter(o => o.agentId === username);
    const myProjects = projects.filter(p => p.agentId === username);

    return (
      <div className="p-8 animate-fade-in max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-serif text-4xl mb-2">Agent Dashboard</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold italic">Bine ai venit, {username}</p>
          </div>
          <div className="flex gap-4">
             <Link to="/admin/offers" className="flex items-center gap-2 bg-accent text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:scale-105 transition-all">
                <Send className="w-4 h-4" /> Trimite Ofertă
             </Link>
             <Link to="/admin/projects" className="flex items-center gap-2 border border-accent text-accent px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-accent hover:text-white transition-all">
                <Plus className="w-4 h-4" /> Proiect Nou
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-surface p-8 border border-border shadow-sm flex items-center justify-between group hover:border-accent transition-all">
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Oferte Trimise</p>
                <p className="text-4xl font-serif text-accent">{myOffers.length}</p>
             </div>
             <FileText className="w-8 h-8 text-muted/20 group-hover:text-accent/20 transition-colors" />
          </div>
          <div className="bg-surface p-8 border border-border shadow-sm flex items-center justify-between group hover:border-accent transition-all">
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Proiecte Încărcate</p>
                <p className="text-4xl font-serif text-accent">{myProjects.length}</p>
             </div>
             <Briefcase className="w-8 h-8 text-muted/20 group-hover:text-accent/20 transition-colors" />
          </div>
          <div className="bg-surface p-8 border border-border shadow-sm flex items-center justify-between group hover:border-accent transition-all">
             <div>
                <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Leads Active</p>
                <p className="text-4xl font-serif text-accent">{leads.filter(l => l.status === 'new').length}</p>
             </div>
             <User className="w-8 h-8 text-muted/20 group-hover:text-accent/20 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Recent Offers */}
           <div className="bg-surface border border-border shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center">
                 <h3 className="font-serif text-xl">Istoric Oferte</h3>
                 <Link to="/admin/offers" className="text-[9px] uppercase font-bold text-accent hover:underline">Vezi Tot</Link>
              </div>
              <div className="divide-y divide-border">
                 {myOffers.slice(0, 5).map(offer => (
                    <div key={offer.id} className="p-4 hover:bg-surface-2 transition-colors flex justify-between items-center">
                       <div>
                          <p className="font-bold text-sm">{offer.subject}</p>
                          <p className="text-xs text-muted">{offer.clientEmail}</p>
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${offer.status === 'viewed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                             {offer.status}
                          </span>
                          <p className="text-[9px] text-muted mt-1">{new Date(offer.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                 ))}
                 {myOffers.length === 0 && <p className="p-8 text-center text-muted italic text-xs">Nu ai trimis nicio ofertă încă.</p>}
              </div>
           </div>

           {/* Recent Projects */}
           <div className="bg-surface border border-border shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center">
                 <h3 className="font-serif text-xl">Proiectele Tale</h3>
                 <Link to="/admin/projects" className="text-[9px] uppercase font-bold text-accent hover:underline">Vezi Tot</Link>
              </div>
              <div className="divide-y divide-border">
                 {myProjects.slice(0, 5).map(project => (
                    <div key={project.id} className="p-4 hover:bg-surface-2 transition-colors flex justify-between items-center">
                       <div>
                          <p className="font-bold text-sm">{project.title.ro}</p>
                          <p className="text-xs text-muted">{project.projectType}</p>
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${project.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                             {project.isPublished ? 'Publicat' : 'Draft'}
                          </span>
                          <p className="text-[9px] text-muted mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                 ))}
                 {myProjects.length === 0 && <p className="p-8 text-center text-muted italic text-xs">Nu ai încărcat niciun proiect.</p>}
              </div>
           </div>
        </div>
        
        {/* Resources Section */}
        <div className="mt-12 bg-surface border border-border p-8">
           <h3 className="font-serif text-xl mb-6">Resurse Agent</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-border hover:border-accent cursor-pointer transition-all text-center group">
                 <FileText className="w-8 h-8 mx-auto mb-2 text-muted group-hover:text-accent" />
                 <p className="text-xs font-bold">Catalog General 2024</p>
                 <span className="text-[9px] text-muted">PDF • 12 MB</span>
              </div>
              <div className="p-4 border border-border hover:border-accent cursor-pointer transition-all text-center group">
                 <FileText className="w-8 h-8 mx-auto mb-2 text-muted group-hover:text-accent" />
                 <p className="text-xs font-bold">Listă Prețuri</p>
                 <span className="text-[9px] text-muted">XLSX • 2 MB</span>
              </div>
              <div className="p-4 border border-border hover:border-accent cursor-pointer transition-all text-center group">
                 <FileText className="w-8 h-8 mx-auto mb-2 text-muted group-hover:text-accent" />
                 <p className="text-xs font-bold">Ghid Materiale</p>
                 <span className="text-[9px] text-muted">PDF • 5 MB</span>
              </div>
              <div className="p-4 border border-border hover:border-accent cursor-pointer transition-all text-center group">
                 <FileText className="w-8 h-8 mx-auto mb-2 text-muted group-hover:text-accent" />
                 <p className="text-xs font-bold">Contract Model</p>
                 <span className="text-[9px] text-muted">DOCX • 1 MB</span>
              </div>
           </div>
        </div>
        {/* Quick Actions */}
        <div className="mt-8 bg-surface border border-border p-8">
           <h3 className="font-serif text-xl mb-6">Acțiuni Rapide</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/offers" className="p-4 border border-border hover:bg-accent hover:text-white transition-all text-center group flex flex-col items-center justify-center h-32">
                 <Send className="w-6 h-6 mb-2 text-accent group-hover:text-white" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Trimite Ofertă</span>
              </Link>
              <Link to="/admin/projects" className="p-4 border border-border hover:bg-accent hover:text-white transition-all text-center group flex flex-col items-center justify-center h-32">
                 <Plus className="w-6 h-6 mb-2 text-accent group-hover:text-white" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Proiect Nou</span>
              </Link>
              <Link to="/admin/templates" className="p-4 border border-border hover:bg-accent hover:text-white transition-all text-center group flex flex-col items-center justify-center h-32">
                 <FileText className="w-6 h-6 mb-2 text-accent group-hover:text-white" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Templaturi</span>
              </Link>
              <Link to="/admin/leads" className="p-4 border border-border hover:bg-accent hover:text-white transition-all text-center group flex flex-col items-center justify-center h-32">
                 <User className="w-6 h-6 mb-2 text-accent group-hover:text-white" />
                 <span className="text-[10px] uppercase font-bold tracking-widest">Vezi Leads</span>
              </Link>
           </div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD (Existing) ---
  return (
    <>
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
             <Link to="/admin/hero" className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Editor Hero</Link>
             <Link to="/" className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Vezi Site Public</Link>
             <button onClick={() => window.location.reload()} className="p-6 border border-border hover:bg-accent hover:text-white hover:border-accent transition-all text-center text-[10px] uppercase font-bold tracking-widest">Refresh App</button>
          </div>
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
    </>
  );
};
