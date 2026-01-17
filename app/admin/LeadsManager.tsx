
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Lead['status']>('all');

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
    const headers = "Data,Client,Email,Telefon,Oras,Mesaj,Status\n";
    const rows = leads.map(l => 
      `${l.createdAt},"${l.name}",${l.email},${l.phone},"${l.city}","${l.message.replace(/"/g, '""')}",${l.status}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-carvello.csv';
    a.click();
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="font-serif text-3xl">Inbox Cereri Ofertă</h1>
           <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mt-1">Gestiune clienți potențiali</p>
        </div>
        <button onClick={exportCSV} className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-border px-6 py-3 hover:bg-surface-2 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          placeholder="Caută după nume, email sau telefon..." 
          className="bg-surface p-4 border border-border text-xs outline-none focus:border-accent"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
           {['all', 'new', 'contacted', 'closed'].map(s => (
             <button
               key={s}
               onClick={() => setFilterStatus(s as any)}
               className={`flex-grow border text-[10px] uppercase font-bold tracking-widest transition-all ${filterStatus === s ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:bg-surface-2'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 border-b border-border uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Client</th>
              <th className="p-4">Oraș</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b border-border hover:bg-surface-2 transition-colors">
                <td className="p-4 text-muted">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{lead.name}</td>
                <td className="p-4">{lead.city}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    lead.status === 'new' ? 'bg-accent text-white' : 
                    lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-500' : 
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelected(lead)} className="text-accent underline font-bold uppercase text-[10px] tracking-widest">Detalii</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-muted italic">Nu am găsit rezultate pentru filtrele selectate.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-background w-full max-w-xl p-12 border border-border shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-2xl font-light">×</button>
            <h2 className="font-serif text-3xl mb-10">Cerere: {selected.name}</h2>
            
            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Email</h4>
                <p className="text-lg">{selected.email}</p>
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Telefon</h4>
                <p className="text-lg">{selected.phone}</p>
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Oraș</h4>
                <p className="text-lg">{selected.city}</p>
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Creat la</h4>
                <p className="text-lg">{new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Mesaj</h4>
              <p className="p-6 bg-surface-2 border border-border text-muted leading-relaxed italic whitespace-pre-wrap">
                "{selected.message}"
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[9px] uppercase tracking-widest font-bold text-accent">Actualizare Status</h4>
              <div className="flex gap-2">
                {(['new', 'contacted', 'closed'] as Lead['status'][]).map(s => (
                  <button 
                    key={s}
                    onClick={() => handleUpdateStatus(selected.id, s)}
                    className={`flex-grow py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${
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
