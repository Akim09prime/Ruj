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
    
    // START LOADING
    setStatus('loading');
    setErrorMessage('');

    const start = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      // 1. Validate fields
      if (!formData.name || !formData.message || (!formData.email && !formData.phone)) {
        throw new Error(lang === 'ro' ? 'Vă rugăm completați toate câmpurile necesare.' : 'Please fill in all required fields.');
      }

      const now = new Date().toISOString();
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        message: formData.message,
        company: formData.company,
        createdAt: now
      };

      // 2. ALWAYS Save locally first (await)
      const newLead: Lead = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        projectType: formData.projectType,
        message: formData.message,
        createdAt: now,
        status: 'new'
      };

      try {
        await dbService.addLead(newLead);
        console.log('Lead saved locally');
      } catch (dbErr) {
        console.error('Local save failed (non-critical):', dbErr);
      }

      // 3. Call email API
      const res = await fetch("/api/lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      // IMPORTANT: Read as text always to prevent JSON parse errors crashing the app
      const raw = await res.text(); 
      let data: any = null;
      try { 
        data = JSON.parse(raw); 
      } catch (e) {
        console.warn('Server response was not JSON:', raw);
      }

      if (!res.ok) {
        // Extract error message safely
        const serverError = (data && (data.error || data.message)) || raw || `Email failed (${res.status})`;
        throw new Error(serverError);
      }

      // Success UI
      setStatus('success');

    } catch (err: any) {
      console.error("Submit error:", err);
      setStatus('error');

      const isTimeout = err?.name === "AbortError";
      const msg = isTimeout
        ? (lang === 'ro' ? "Email API timeout (8s). Conexiune lentă." : "Email API timeout (8s). Slow connection.")
        : String(err?.message || err || 'Unknown error');
      
      setErrorMessage(msg);

    } finally {
      clearTimeout(timer);
      console.log("Lead submit finished in ms:", Date.now() - start);
      // Ensure we are definitely not loading anymore
      setStatus(prev => prev === 'loading' ? 'error' : prev);
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
          onClick={() => { setStatus('idle'); setFormData({...formData, message: '', name: '', email: '', phone: '', city: '', company: ''}); }}
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
        
        {errorMessage && status === 'error' && (
           <div className="md:col-span-2 text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-pulse bg-red-500/10 p-4 border border-red-500/20">
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
          {status === 'loading' ? 'Se procesează...' : 'Trimite Cererea'}
        </button>
      </form>
    </div>
  );
};