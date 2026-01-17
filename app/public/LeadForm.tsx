import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadForm: React.FC = () => {
  const { lang, t } = useI18n();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: '' // Company is honeypot
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company) return; // Honeypot triggered
    
    setStatus('loading');

    // 1. Save locally first (Reliability)
    const newLead: Lead = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    // Always save locally
    await dbService.addLead(newLead).catch(console.error);

    // 2. Send to Serverless API
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          message: formData.message,
          company: formData.company 
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        console.warn('API submission failed, but saved locally.');
        setStatus('success'); // We consider it success for user if saved locally
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus('success'); // Fallback: It's saved locally
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-40 pb-24 text-center max-w-xl mx-auto px-6 animate-fade-in">
        <div className="text-6xl mb-8 text-accent">✓</div>
        <h2 className="font-serif text-4xl mb-4">{lang === 'ro' ? 'Cerere trimisă cu succes!' : 'Request sent successfully!'}</h2>
        <p className="text-muted mb-12">
          {lang === 'ro' 
            ? 'Vă vom contacta în cel mai scurt timp pentru a discuta detaliile proiectului.' 
            : 'We will contact you shortly to discuss your project details.'}
        </p>
        <button 
          onClick={() => { setStatus('idle'); setFormData({...formData, message: '', name: '', email: '', phone: '', city: ''}); }}
          className="px-10 py-4 border border-foreground uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-12 border border-border shadow-sm">
        {/* Honeypot Field - Hidden */}
        <div className="hidden">
           <input 
             name="company"
             value={formData.company}
             onChange={e => setFormData({...formData, company: e.target.value})}
             tabIndex={-1}
             autoComplete="off"
           />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Nume Complet</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={status === 'loading'}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Email</label>
          <input 
            required type="email"
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            disabled={status === 'loading'}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Telefon</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            disabled={status === 'loading'}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Oraș</label>
          <input 
            required
            className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors"
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
            disabled={status === 'loading'}
          />
        </div>
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest font-bold">Mesaj / Detalii Proiect</label>
          <textarea 
            required rows={4}
            className="bg-transparent border border-border p-4 focus:border-accent outline-none transition-colors resize-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            disabled={status === 'loading'}
          />
        </div>
        
        {errorMessage && (
           <div className="md:col-span-2 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
             {errorMessage}
           </div>
        )}

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="md:col-span-2 py-4 bg-accent text-white uppercase tracking-widest font-bold hover:opacity-90 transition-all disabled:opacity-50 flex justify-center items-center"
        >
          {status === 'loading' ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
          ) : null}
          {status === 'loading' ? 'Se trimite...' : 'Trimite Cererea'}
        </button>
      </form>
    </div>
  );
};