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
  
  // UI Logic State
  const [status, setStatus] = useState<'idle' | 'loading' | 'finished'>('idle');
  
  // Result State (for the success/error screen)
  const [result, setResult] = useState<{
    localSaved: boolean;
    emailSent: boolean;
    serverCode?: string;
    serverError?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Silent Honeypot
    if (formData.company) {
       setFormData({ ...formData, company: '' });
       return;
    }

    // 2. Initialize Loading
    setStatus('loading');
    setResult(null);

    // Track operation results
    let localSaved = false;
    let emailSent = false;
    let serverCode = '';
    let serverError = '';

    // 3. Client-Side Timeout Controller (8 seconds max)
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
        createdAt: now
      };

      // --- STEP A: LOCAL SAVE (Primary) ---
      try {
        const newLead: Lead = {
          id: Math.random().toString(36).substr(2, 9),
          ...payload,
          status: 'new'
        } as unknown as Lead;
        
        await dbService.addLead(newLead);
        localSaved = true;
        console.log('LeadForm: Saved to IndexedDB');
      } catch (dbErr: any) {
        console.error('LeadForm: DB Error', dbErr);
        serverCode = 'LOCAL_DB_ERROR';
        serverError = dbErr.message || 'Could not save locally';
      }

      // --- STEP B: EMAIL SEND (Secondary) ---
      try {
        const res = await fetch("/api/lead-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        // Parse JSON safely
        const rawText = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { ok: false, code: 'INVALID_JSON', error: rawText.substring(0, 200) };
        }

        if (res.ok && data.ok) {
          emailSent = true;
        } else {
          // Capture the exact error code from the server (e.g. RESEND_ERROR)
          serverCode = data.code || `HTTP_${res.status}`;
          serverError = data.error || data.details || 'Unknown API Error';
          console.warn('LeadForm: API Error', data);
        }

      } catch (netErr: any) {
        // Handle Network or Timeout errors
        if (netErr.name === 'AbortError') {
          serverCode = 'CLIENT_TIMEOUT';
          serverError = 'Request took longer than 8 seconds';
        } else {
          serverCode = 'NETWORK_ERROR';
          serverError = netErr.message || 'Connection failed';
        }
        console.error('LeadForm: Network Error', netErr);
      }

    } catch (generalErr: any) {
      // Catch-all for unexpected runtime errors
      console.error('LeadForm: Critical Error', generalErr);
      serverCode = 'CRITICAL_UI_ERROR';
      serverError = generalErr.message;
    } finally {
      // 4. CLEANUP (Guaranteed)
      clearTimeout(timeoutId);
      
      setResult({
        localSaved,
        emailSent,
        serverCode,
        serverError
      });
      
      setStatus('finished');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setResult(null);
    setFormData({
      name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: ''
    });
  };

  // --- RENDER: FINISHED STATE ---
  if (status === 'finished' && result) {
    const isTotalSuccess = result.localSaved && result.emailSent;
    const isPartialSuccess = result.localSaved && !result.emailSent;
    const isFailure = !result.localSaved;

    return (
      <div className="pt-40 pb-24 text-center max-w-xl mx-auto px-6 animate-fade-in">
        {/* Icon */}
        <div className={`text-6xl mb-6 ${isFailure ? 'text-red-500' : isPartialSuccess ? 'text-yellow-500' : 'text-accent'}`}>
          {isFailure ? '⚠' : '✓'}
        </div>
        
        {/* Main Title */}
        <h2 className="font-serif text-3xl mb-4">
          {isTotalSuccess && (lang === 'ro' ? 'Mesaj Trimis!' : 'Message Sent!')}
          {isPartialSuccess && (lang === 'ro' ? 'Mesaj Salvat (Atenție)' : 'Message Saved (Warning)')}
          {isFailure && (lang === 'ro' ? 'Eroare Trimitere' : 'Sending Error')}
        </h2>

        {/* Status Box */}
        <div className="bg-surface-2 border border-border p-6 mb-8 text-left rounded shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Bază de date:</span>
            <span className={`text-xs font-bold ${result.localSaved ? 'text-green-600' : 'text-red-500'}`}>
              {result.localSaved ? 'SALVAT OK' : 'EROARE'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Email Notificare:</span>
            <span className={`text-xs font-bold ${result.emailSent ? 'text-green-600' : 'text-red-500'}`}>
              {result.emailSent ? 'TRIMIS OK' : 'EȘUAT'}
            </span>
          </div>

          {/* Detailed Error for Debugging */}
          {!result.emailSent && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Detalii Eroare (Debug):</p>
              <code className="block bg-black/5 p-2 text-[10px] font-mono text-red-600 break-all">
                [{result.serverCode}] {result.serverError}
              </code>
              <p className="text-[9px] text-muted mt-2 italic">
                {lang === 'ro' 
                  ? 'Mesajul a fost salvat în admin. Vă rugăm să verificați panoul de control.' 
                  : 'Message saved in admin. Please check the dashboard.'}
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={resetForm}
          className="px-10 py-4 border border-foreground uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
        >
          {lang === 'ro' ? 'Trimite alt mesaj' : 'Send another message'}
        </button>
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-12 border border-border shadow-sm relative">
        {/* Loading Overlay */}
        {status === 'loading' && (
           <div className="absolute inset-0 bg-surface/90 z-20 flex items-center justify-center flex-col cursor-wait backdrop-blur-sm">
             <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
             <span className="text-xs font-bold uppercase tracking-widest text-accent animate-pulse">Se procesează...</span>
             <span className="text-[9px] text-muted mt-2">Vă rugăm așteptați</span>
           </div>
        )}

        {/* Hidden Honeypot */}
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
        
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="md:col-span-2 py-4 bg-accent text-white uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none"
        >
          {lang === 'ro' ? 'TRIMITE CEREREA' : 'SEND REQUEST'}
        </button>
      </form>
    </div>
  );
};