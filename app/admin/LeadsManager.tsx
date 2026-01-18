
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'general' | 'project-feedback'>('all');

  const loadData = async () => {
    const l = await dbService.getLeads();
    setLeads(l);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    await dbService.updateLeadStatus(id, status);
    loadData();
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status } : null);
    }
  };

  const exportCSV = () => {
    const headers = "Data,Tip,Proiect,Client,Email,Mesaj,Rating,Status\n";
    const rows = leads.map(l => 
      `${l.createdAt},${l.type},"${l.projectRef?.title || '-'}",${l.name},${l.email},"${l.message.replace(/"/g, '""')}",${l.rating || '-'},${l.status}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-carvello-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || l.type === filterType || (!l.type && filterType === 'general');
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="font-serif text-3xl">Inbox & Feedback</h1>
           <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mt-1">Interacțiuni Clienți</p>
        </div>
        <button onClick={exportCSV} className="text-[10px] font-bold uppercase tracking-widest bg-accent text-white border border-accent px-6 py-3 hover:opacity-90 transition-colors shadow-lg shadow-accent/20">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          placeholder="Caută după nume sau email..." 
          className="bg-surface p-4 border border-border text-xs outline-none focus:border-accent"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
           <button onClick={() => setFilterType('all')} className={`flex-grow border text-[9px] uppercase font-bold tracking-widest py-3 ${filterType === 'all' ? 'bg-foreground text-background' : 'bg-surface'}`}>Toate</button>
           <button onClick={() => setFilterType('general')} className={`flex-grow border text-[9px] uppercase font-bold tracking-widest py-3 ${filterType === 'general' ? 'bg-foreground text-background' : 'bg-surface'}`}>Cereri Ofertă</button>
           <button onClick={() => setFilterType('project-feedback')} className={`flex-grow border text-[9px] uppercase font-bold tracking-widest py-3 ${filterType === 'project-feedback' ? 'bg-foreground text-background' : 'bg-surface'}`}>Feedback Proiecte</button>
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 border-b border-border uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Tip</th>
              <th className="p-4">Client / Proiect</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b border-border hover:bg-surface-2 transition-colors">
                <td className="p-4 text-muted">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                   {lead.type === 'project-feedback' ? (
                     <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest">Feedback</span>
                   ) : (
                     <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Ofertă</span>
                   )}
                </td>
                <td className="p-4">
                   <div className="font-bold">{lead.name}</div>
                   {lead.projectRef && <div className="text-[10px] text-muted uppercase tracking-widest">{lead.projectRef.title}</div>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${lead.status === 'new' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelected(lead)} className="text-accent underline font-bold uppercase text-[10px] tracking-widest">Detalii</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-muted italic">Nu am găsit rezultate.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-background w-full max-w-xl p-12 border border-border shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-2xl font-light">×</button>
            <h2 className="font-serif text-3xl mb-2">{selected.type === 'project-feedback' ? 'Feedback Client' : 'Cerere Ofertă'}</h2>
            <p className="text-xs uppercase tracking-widest text-muted mb-8">{selected.name}</p>
            
            {selected.type === 'project-feedback' && selected.projectRef && (
               <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[9px] uppercase font-bold tracking-widest block text-purple-500 mb-1">Referitor la proiectul</span>
                  <span className="font-serif text-xl">{selected.projectRef.title}</span>
                  <div className="mt-2 text-accent">Rating: {selected.rating}/5 ★</div>
               </div>
            )}

            <div className="mb-10">
              <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Mesaj</h4>
              <p className="p-6 bg-surface-2 border border-border text-muted leading-relaxed italic whitespace-pre-wrap select-text">
                "{selected.message}"
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent">Actualizare Status</h4>
              <div className="flex gap-2 flex-wrap">
                {(['new', 'contacted', 'won', 'lost', 'approved', 'archived'] as Lead['status'][]).map(s => (
                  <button 
                    key={s}
                    onClick={() => handleUpdateStatus(selected.id, s)}
                    className={`flex-grow py-3 px-4 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      selected.status === s ? 'bg-accent text-white border-accent' : 'border-border hover:bg-surface-2'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
