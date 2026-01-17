import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { Lead } from '../../types';

export const LeadForm: React.FC = () => {
  const { lang, t } = useI18n();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: '' // Company is honeypot
  });
  
  // UI States
  const [status, setStatus] = useState<'idle' | 'loading' | 'finished'>('idle');
  const [result, setResult] = useState<{
    localSaved: boolean;
    emailSent: boolean;
    serverCode?: string;
    serverMessage?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company) return; // Silent honeypot exit
    
    // 1. Reset & Start
    setStatus('loading');
    setResult(null);

    const start = Date.now();
    let localSaved = false;
    let emailSent = false;
    let serverCode = '';
    let serverMessage = '';

    // Create Timeout Controller (8 seconds hard limit)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      // 2. Validate
      if (!formData.name || !formData.message || (!formData.email && !formData.phone)) {
        throw new Error('VALIDATION_ERROR: Missing fields');
      }

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

      // 3. Save Locally (Critical Step)
      try {
        const newLead: Lead = {
          id: Math.random().toString(36).substr(2, 9),
          ...payload,
          status: 'new'
        } as unknown as Lead;
        
        await dbService.addLead(newLead);
        localSaved = true; 
        console.log('Lead saved to IndexedDB');
      } catch (dbError: any) {
        console.error('DB Save Failed:', dbError);
        serverMessage = "DB Save Failed: " + dbError.message;
      }

      // 4. Send Email (Best Effort)
      try {
        const res = await fetch("/api/lead-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const rawText = await res.text();
        let data: any = {};
        
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr) {
          data = { ok: false, code: 'INVALID_JSON_RESPONSE', error: rawText.substring(0, 100) };
        }

        serverCode = data.code || (res.ok ? 'SUCCESS' : 'UNKNOWN_ERROR');
        serverMessage = data.error || (res.ok ? 'Sent successfully' : rawText);

        if (res.ok && data.ok) {
          emailSent = true;
        } else {
          throw new Error(serverMessage);
        }

      } catch (netErr: any) {
        if (netErr.name === 'AbortError') {
          serverCode = 'TIMEOUT_8S';
          serverMessage = 'Request timed out after 8 seconds.';
        } else {
          serverCode = 'NETWORK_ERROR';
          serverMessage = netErr.message || 'Network request failed';
        }
        console.error('Email Fetch Error:', netErr);
      }

    } catch (validationErr: any) {
      serverCode = 'VALIDATION';
      serverMessage = validationErr.message;
    } finally {
      clearTimeout(timer);
      
      // 5. Finalize State
      setResult({
        localSaved,
        emailSent,
        serverCode,
        serverMessage
      });
      setStatus('finished');
      
      console.log(`Process finished in ${Date.now() - start}ms. Local: ${localSaved}, Email: ${emailSent}`);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setFormData({
      name: '', email: '', phone: '', city: '', projectType: 'Rezidențial', message: '', company: ''
    });
  };

  // Render Finished State
  if (status === 'finished' && result) {
    const isTotalSuccess = result.localSaved && result.emailSent;
    const isPartialSuccess = result.localSaved && !result.emailSent;
    const isFailure = !result.localSaved;

    return (
      <div className="pt-40 pb-24 text-center max-w-xl mx-auto px-6 animate-fade-in">
        <div className={`text-6xl mb-8 ${isTotalSuccess ? 'text-accent' : isPartialSuccess ? 'text-yellow-500' : 'text-red-500'}`}>
          {isFailure ? '⚠' : '✓'}
        </div>
        
        <h2 className="font-serif text-3xl mb-4">
          {isTotalSuccess && (lang === 'ro' ? 'Cerere Trimisă cu Succes!' : 'Request Sent Successfully!')}
          {isPartialSuccess && (lang === 'ro' ? 'Cerere Salvată (Offline)' : 'Request Saved (Offline)')}
          {isFailure && (lang === 'ro' ? 'Eroare Trimitere' : 'Sending Error')}
        </h2>

        <div className="bg-surface-2 border border-border p-6 mb-8 text-left text-xs font-mono rounded">
          <p className={`mb-2 font-bold ${result.localSaved ? 'text-green-600' : 'text-red-500'}`}>
            {result.localSaved ? '✅ Salvat în Admin (Local DB)' : '❌ Eroare Salvare Locală'}
          </p>
          <p className={`mb-4 font-bold ${result.emailSent ? 'text-green-600' : 'text-red-500'}`}>
            {result.emailSent ? '✅ Trimis pe Email' : '❌ Email Eșuat'}
          </p>
          
          {!result.emailSent && (
            <div className="pt-4 border-t border-border/50 text-muted">
              <p><strong>Debug Code:</strong> {result.serverCode}</p>
              <p><strong>Message:</strong> {result.serverMessage}</p>
            </div>
          )}
        </div>

        <p className="text-muted mb-12">
          {isFailure 
            ? (lang === 'ro' ? 'Vă rugăm să încercați din nou sau să ne contactați telefonic.' : 'Please try again or contact us by phone.')
            : (lang === 'ro' ? 'Vă vom contacta în cel mai scurt timp.' : 'We will contact you shortly.')}
        </p>

        <button 
          onClick={handleReset}
          className="px-10 py-4 border border-foreground uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
        >
          {lang === 'ro' ? 'Trimite o altă cerere' : 'Send another request'}
        </button>
      </div>
    );
  }

  // Render Form
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Cere Ofertă</h1>
        <p className="text-muted">Partenerul tău pentru proiecte precise și execuție premium.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-12 border border-border shadow-sm relative">
        {status === 'loading' && (
           <div className="absolute inset-0 bg-surface/80 z-10 flex items-center justify-center flex-col cursor-wait">
             <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
             <span className="text-xs font-bold uppercase tracking-widest text-accent animate-pulse">Se procesează...</span>
           </div>
        )}

        <div className="hidden">
           <input name="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} autoComplete="off"/>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Nume Complet *</label>
          <input required className="bg-transparent border-b border-border py-2 focus:border-accent outline-none" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Email</label>
          <input type="email" className="bg-transparent border-b border-border py-2 focus:border-accent outline-none" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Telefon</label>
          <input className="bg-transparent border-b border-border py-2 focus:border-accent outline-none" 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold">Oraș</label>
          <input className="bg-transparent border-b border-border py-2 focus:border-accent outline-none" 
            value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} disabled={status === 'loading'} />
        </div>
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest font-bold">Mesaj / Detalii Proiect *</label>
          <textarea required rows={4} className="bg-transparent border border-border p-4 focus:border-accent outline-none resize-none" 
            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} disabled={status === 'loading'} />
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="md:col-span-2 py-4 bg-accent text-white uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
        >
          {lang === 'ro' ? 'TRIMITE CEREREA' : 'SEND REQUEST'}
        </button>
      </form>
    </div>
  );
};