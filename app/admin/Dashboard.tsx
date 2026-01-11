
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Lead, Project, Media } from '../../types';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mediaCount, setMediaCount] = useState(0);

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

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button onClick={handleExport} className="px-4 py-2 border border-border text-xs uppercase font-bold tracking-widest hover:bg-surface-2 transition-colors">
            Export DB
          </button>
          <button onClick={() => {
            if(confirm('Resetezi toate datele la setările din fabrică?')) {
               dbService.resetToSeed().then(() => window.location.reload());
            }
          }} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs uppercase font-bold tracking-widest hover:bg-red-500/10 transition-colors">
            Reset Seed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface p-8 border border-border shadow-sm">
          <h3 className="text-muted text-[10px] uppercase tracking-widest font-bold mb-4">Proiecte</h3>
          <span className="text-4xl font-serif text-accent">{projects.length}</span>
          <Link to="/admin/projects" className="block mt-4 text-accent text-[10px] uppercase font-bold tracking-widest hover:underline">Gestionare →</Link>
        </div>
        <div className="bg-surface p-8 border border-border shadow-sm">
          <h3 className="text-muted text-[10px] uppercase tracking-widest font-bold mb-4">Inbox Leads</h3>
          <span className="text-4xl font-serif text-accent">{leads.filter(l => l.status === 'new').length}</span>
          <Link to="/admin/leads" className="block mt-4 text-accent text-[10px] uppercase font-bold tracking-widest hover:underline">Vezi Mesaje →</Link>
        </div>
        <div className="bg-surface p-8 border border-border shadow-sm">
          <h3 className="text-muted text-[10px] uppercase tracking-widest font-bold mb-4">Media Library</h3>
          <span className="text-4xl font-serif text-accent">{mediaCount}</span>
          <Link to="/admin/media" className="block mt-4 text-accent text-[10px] uppercase font-bold tracking-widest hover:underline">Gestiune Media →</Link>
        </div>
        <div className="bg-surface p-8 border border-border shadow-sm">
          <h3 className="text-muted text-[10px] uppercase tracking-widest font-bold mb-4">Pagini Custom</h3>
          <span className="text-4xl font-serif text-accent">??</span>
          <Link to="/admin/pages" className="block mt-4 text-accent text-[10px] uppercase font-bold tracking-widest hover:underline">Editor Pagini →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-xl">Cereri Recente</h2>
          </div>
          <div className="divide-y divide-border">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="p-4 hover:bg-surface-2 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{lead.name}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${lead.status === 'new' ? 'bg-accent text-white' : 'bg-green-500/20 text-green-600'}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-muted truncate">{lead.message}</p>
              </div>
            ))}
            {leads.length === 0 && <p className="p-8 text-center text-muted italic">Nicio cerere primită.</p>}
          </div>
        </div>
        
        <div className="bg-surface border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-xl">Quick Links</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
             <Link to="/admin/settings" className="p-4 border border-border hover:bg-surface-2 text-center text-[10px] uppercase font-bold tracking-widest">Nomenclatoare</Link>
             <Link to="/admin/pages" className="p-4 border border-border hover:bg-surface-2 text-center text-[10px] uppercase font-bold tracking-widest">Pagini CMS</Link>
             <Link to="/" className="p-4 border border-border hover:bg-surface-2 text-center text-[10px] uppercase font-bold tracking-widest">Vezi Site Public</Link>
             <button onClick={() => window.location.reload()} className="p-4 border border-border hover:bg-surface-2 text-center text-[10px] uppercase font-bold tracking-widest">Refresh Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};
