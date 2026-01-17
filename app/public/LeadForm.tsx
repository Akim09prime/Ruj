import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadForm: React.FC = () => {
  const { lang, t } = useI18n();
  
  // Input State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: '' // Company is honeypot
  });
  
  // UX State
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [localSaved, setLocalSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Silent Honeypot
    if (formData.company) {
       setFormData({ ...formData, company: '' });
       return;
    }

    // 2. Start Loading
    setStatus('loading');
    setErrorMsg('');
    setLocalSaved(false);

    // Timeout Controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const now = new Date().toISOString();
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        projectType: formData.projectType,
        message: formData.message,
        company: formData.company,
        createdAt: now,
        userAgent: navigator.userAgent,
        currentUrl: window.location.href
      };

      // --- A: Local Save (Best Effort) ---
      try {
        const newLead: Lead = {
          id: Math.random().toString(36).substr(2, 9),
          ...payload,
          status: 'new'
        } as unknown as Lead;
        await dbService.addLead(newLead);
        setLocalSaved(true);
      } catch (e) {
        console.warn('Local DB Save Failed', e);
      }

      // --- B: API Send ---
      const res = await fetch("/api/lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      let data: any = {};
      const rawText = await res.text();
      try { data = JSON.parse(rawText); } catch { data = { ok: false, code: 'INVALID_JSON' }; }

      if (res.ok && data.ok) {
        setStatus('success');
      } else {
        // If API fails but Local Saved, show partial success message or specific error
        if (data.code === 'RATE_LIMIT') {
          throw new Error(lang === 'ro' ? 'Prea multe cereri. Vă rugăm așteptați 10 minute.' : 'Too many requests. Please wait 10 minutes.');
        } else {
          throw new Error(data.error || 'Server error');
        }
      }

    } catch (err: any) {
      console.error('Submission Error:', err);
      
      // If we saved locally but API failed, we can consider it a "Partial Success" or just show error
      // For this requirement, we show explicit error if email fails, but note if saved.
      if (localSaved) {
         setStatus('error');
         setErrorMsg(lang === 'ro' 
           ? 'Cererea a fost salvată local, dar emailul nu s-a trimis. Te vom contacta.' 
           : 'Request saved locally, but email failed. We will contact you.');
      } else {
         setStatus('error');
         setErrorMsg(err.name === 'AbortError' 
           ? (lang === 'ro' ? 'Conexiunea a expirat. Încearcă din nou.' : 'Connection timed out. Try again.') 
           : (err.message || 'Error sending request.'));
      }
    } finally {
      clearTimeout(timeoutId);
      // If status is still loading (unexpected), force error
      if (status === 'loading') setStatus('error'); 
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: ''
    });
  };

  // --- RENDER: SUCCESS STATE ---
  if (status === 'success') {
    return (
      <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto text-center animate-fade-in">
        <div className="bg-surface p-12 border border-accent/20 shadow-2xl shadow-accent/5">
          <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-4xl mb-6">
            {lang === 'ro' ? 'Cerere Trimisă' : 'Request Sent'}
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            {lang === 'ro' 
              ? 'Îți mulțumim pentru interes. Un consultant CARVELLO a primit detaliile tale și te va contacta în cel mai scurt timp.' 
              : 'Thank you for your interest. A CARVELLO consultant has received your details and will contact you shortly.'}
          </p>
          <div className="flex flex-col space-y-4">
             <button 
               onClick={handleReset}
               className="px-8 py-4 bg-background border border-foreground text-[10px] uppercase font-bold tracking-widest hover:bg-foreground hover:text-white transition-all"
             >
               {lang === 'ro' ? 'Trimite o altă cerere' : 'Send Another Request'}
             </button>
             <p className="text-[9px] text-muted uppercase tracking-widest">
               {localSaved && (lang === 'ro' ? 'Copie salvată securizat' : 'Copy saved securely')}
             </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: FORM ---
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Cere Ofertă</h1>
        <p className="text-muted">Partenerul tău pentru proiecte precise și execuție premium.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-12 border border-border shadow-sm relative transition-opacity duration-500">
        
        {/* Honeypot */}
        <div className="hidden">
           <input name="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} autoComplete="off"/>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Nume Complet *</label>
          <input required className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Email</label>
          <input type="email" className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Telefon</label>
          <input className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors" 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Oraș</label>
          <input className="bg-transparent border-b border-border py-2 focus:border-accent outline-none transition-colors" 
            value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest font-bold">Mesaj / Detalii Proiect *</label>
          <textarea required rows={4} className="bg-transparent border border-border p-4 focus:border-accent outline-none resize-none transition-colors" 
            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} disabled={status === 'loading'} />
        </div>
        
        {status === 'error' && (
          <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 p-4 text-center">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{errorMsg}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="md:col-span-2 py-4 bg-accent text-white uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-3"
        >
          {status === 'loading' && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          {status === 'loading' 
            ? (lang === 'ro' ? 'SE TRIMITE...' : 'SENDING...') 
            : (lang === 'ro' ? 'TRIMITE CEREREA' : 'SEND REQUEST')
          }
        </button>
      </form>
    </div>
  );
};