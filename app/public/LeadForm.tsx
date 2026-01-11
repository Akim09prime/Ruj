
import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadForm: React.FC = () => {
  const { lang, t } = useI18n();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    await dbService.addLead(newLead);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 text-center max-w-xl mx-auto px-6">
        <div className="text-6xl mb-8">✓</div>
        <h2 className="font-serif text-4xl mb-4">{lang === 'ro' ? 'Cerere trimisă cu succes!' : 'Request sent successfully!'}</h2>
        <p className="text-muted mb-12">
          {lang === 'ro' 
            ? 'Vă vom contacta în cel mai scurt timp pentru a discuta detaliile proiectului.' 
            : 'We will contact you shortly to discuss your project details.'}
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-10 py-4 border border-foreground uppercase tracking-widest font-bold hover:bg-foreground hover:text-background"
        >
          {lang === 'ro' ? 'Trimite o altă cerere' : 'Send another request'}
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Cere Ofertă</h1>
        <p className="text-muted">Partenerul tău pentru proiecte precise și execuție premium.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-12 border border-border">
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Nume Complet</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Email</label>
          <input 
            required type="email"
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Telefon</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Oraș</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none"
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest font-bold">Mesaj / Detalii Proiect</label>
          <textarea 
            required rows={4}
            className="bg-transparent border border-border p-4 focus:border-accent outline-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>
        <button type="submit" className="md:col-span-2 py-4 bg-accent text-white uppercase tracking-widest font-bold hover:opacity-90 transition-opacity">
          Trimite Cererea
        </button>
      </form>
    </div>
  );
};
