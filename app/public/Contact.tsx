
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { dbService } from '../../services/db';
import { ContactPageData, Lead } from '../../types';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
  const { t, lang } = useI18n();
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', 
    projectType: 'Rezidențial', category: 'Bucătărie', 
    budget: '', timeline: 'Urgent', message: '', gdpr: false
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = lang === 'ro' ? 'CARVELLO | Contact & Consultanță' : 'CARVELLO | Contact & Consulting';
    dbService.getContactData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdpr) return alert('Te rugăm să accepți politica GDPR.');
    
    setFormStatus('sending');
    
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'general',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      projectType: formData.projectType,
      category: formData.category,
      budget: formData.budget,
      timeline: formData.timeline,
      message: formData.message,
      createdAt: new Date().toISOString(),
      status: 'new',
      userAgent: navigator.userAgent
    };

    // Save to DB
    await dbService.addLead(lead);
    
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ 
        name: '', email: '', phone: '', city: '', 
        projectType: 'Rezidențial', category: 'Bucătărie', 
        budget: '', timeline: 'Urgent', message: '', gdpr: false 
      });
    }, 1500);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="w-16 h-16 rounded-full" /></div>;
  if (!data) return null;

  return (
    <div className="bg-background text-foreground animate-fade-in">
      
      {/* 1) HERO CINEMATIC */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1534349762913-92499696587a?auto=format&fit=crop&q=80&w=2000"
            alt="Contact Atelier"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-slide-up">
            {t(data.hero.title)}
          </h1>
          <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up-delayed">
            {t(data.hero.subtitle)}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up-delayed">
            <button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent transition-all shadow-xl"
            >
              {t(data.hero.ctaPrimary)}
            </button>
            {data.info.whatsappLink && (
              <a 
                href={data.info.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-[#25D366] hover:border-[#25D366] transition-all flex items-center justify-center gap-2"
              >
                <span>{t(data.hero.ctaSecondary)}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 2) QUICK CONTACT CARDS */}
      <section className="py-20 px-6 max-w-7xl mx-auto -mt-20 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-border p-8 shadow-2xl group hover:border-accent transition-all">
               <div className="text-accent text-3xl mb-4">📞</div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Telefon</h3>
               <a href={`tel:${data.info.phone}`} className="font-serif text-xl font-bold group-hover:text-accent transition-colors">{data.info.phone}</a>
            </div>
            <div className="bg-surface border border-border p-8 shadow-2xl group hover:border-accent transition-all">
               <div className="text-accent text-3xl mb-4">✉️</div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Email</h3>
               <a href={`mailto:${data.info.email}`} className="font-serif text-xl font-bold group-hover:text-accent transition-colors">{data.info.email}</a>
            </div>
            <div className="bg-surface border border-border p-8 shadow-2xl group hover:border-accent transition-all">
               <div className="text-accent text-3xl mb-4">📍</div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Adresă</h3>
               <p className="font-serif text-lg">{data.info.city}, {data.info.address}</p>
            </div>
            <div className="bg-surface border border-border p-8 shadow-2xl group hover:border-accent transition-all">
               <div className="text-accent text-3xl mb-4">⏱</div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">{data.info.hours}</h3>
               <p className="text-xs text-muted">{t(data.info.responseBuffer)}</p>
            </div>
         </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto" id="contact-form">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* 3) PREMIUM FORM */}
            <div>
               <h2 className="font-serif text-4xl mb-8">Cere Ofertă</h2>
               
               {formStatus === 'success' ? (
                  <div className="bg-surface-2 border border-accent/20 p-12 text-center animate-fade-in">
                     <div className="text-6xl text-accent mb-6">✓</div>
                     <h3 className="font-serif text-3xl mb-4">Mesaj Primit!</h3>
                     <p className="text-muted leading-relaxed mb-8">
                        Solicitarea ta a fost înregistrată. Un consultant Carvello va analiza detaliile și te va contacta în curând.
                     </p>
                     <Link to="/proces-garantii" className="inline-block px-8 py-3 bg-foreground text-background text-xs uppercase font-bold tracking-widest hover:bg-accent hover:text-white transition-all">
                        Vezi cum lucrăm
                     </Link>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Nume</label>
                           <input required className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Nume complet" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Telefon</label>
                           <input required className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="07xx xxx xxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Email</label>
                           <input required type="email" className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="email@domeniu.ro" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Oraș</label>
                           <input required className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" placeholder="Locație proiect" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Categorie</label>
                           <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                              <option value="Bucătărie">Bucătărie</option>
                              <option value="Dressing">Dressing</option>
                              <option value="Living">Living</option>
                              <option value="Baie">Baie</option>
                              <option value="Comercial">Comercial</option>
                              <option value="CNC">Servicii CNC</option>
                              <option value="Altul">Altul</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Tip Proiect</label>
                           <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
                              <option value="Rezidențial">Rezidențial</option>
                              <option value="Comercial">Comercial</option>
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Buget Estimativ</label>
                           <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                              <option value="">Alege interval...</option>
                              <option value="< 5.000€">Sub 5.000€</option>
                              <option value="5.000 - 10.000€">5.000 - 10.000€</option>
                              <option value="10.000 - 20.000€">10.000 - 20.000€</option>
                              <option value="> 20.000€">Peste 20.000€</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-muted">Termen Execuție</label>
                           <select className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                              <option value="Urgent">Urgent (imposibil de obicei)</option>
                              <option value="2-4 Săptămâni">2-4 Săptămâni</option>
                              <option value="1-2 Luni">1-2 Luni</option>
                              <option value="Flexibil">Flexibil</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted">Mesaj Detaliat</label>
                        <textarea required className="w-full bg-surface-2 border border-border p-4 text-xs outline-none focus:border-accent h-32 resize-none" placeholder="Descrie proiectul, materiale preferate, particularități..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                     </div>

                     <div className="p-6 border-2 border-dashed border-border text-center hover:bg-surface-2 cursor-pointer transition-colors relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-2xl block mb-2">📎</span>
                        <span className="text-[10px] uppercase font-bold text-muted">Adaugă Schiță / Imagine (Opțional)</span>
                     </div>

                     <div className="flex items-start gap-3">
                        <input type="checkbox" required checked={formData.gdpr} onChange={e => setFormData({...formData, gdpr: e.target.checked})} className="mt-1 accent-accent" />
                        <label className="text-[10px] text-muted">Sunt de acord cu prelucrarea datelor cu caracter personal în scopul ofertării, conform politicii de confidențialitate.</label>
                     </div>

                     <button disabled={formStatus === 'sending'} className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-accent border border-accent transition-all disabled:opacity-70 shadow-xl">
                        {formStatus === 'sending' ? 'Se Trimite...' : 'Trimite Cererea'}
                     </button>
                  </form>
               )}
            </div>

            {/* 4) SIDE INFO & MAP */}
            <div className="space-y-12">
               {/* Map */}
               <div className="aspect-square bg-surface-2 border border-border relative group overflow-hidden">
                  {data.info.mapEmbedUrl ? (
                     <iframe src={data.info.mapEmbedUrl} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy"></iframe>
                  ) : (
                     <div className="w-full h-full relative">
                        <OptimizedImage src="https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50" alt="Atelier Location" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="bg-black/80 text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest border border-white/20">Atelier Cluj-Napoca</span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Timeline */}
               <div>
                  <h3 className="font-serif text-2xl mb-8">Ce urmează?</h3>
                  <div className="space-y-8 pl-4 border-l border-border">
                     {data.timeline.steps.map((step, i) => (
                        <div key={i} className="relative pl-8">
                           <span className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-accent font-serif text-lg shadow-sm">
                              {i + 1}
                           </span>
                           <h4 className="font-bold text-sm uppercase tracking-widest mb-1">{t(step.title)}</h4>
                           <p className="text-xs text-muted">{t(step.desc)}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* FAQ */}
               <div>
                  <h3 className="font-serif text-2xl mb-8">Întrebări Frecvente</h3>
                  <div className="space-y-4">
                     {data.faq.map((qa, i) => (
                        <div key={i} className="border-b border-border pb-4">
                           <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2 flex gap-2">
                              <span className="text-accent">Q.</span> {t(qa.question)}
                           </h4>
                           <p className="text-xs text-muted pl-5">{t(qa.answer)}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 7) FINAL CTA */}
      <section className="py-24 bg-surface border-t border-border text-center">
         <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Vrei o ofertă clară, fără surprize?</h2>
            <p className="text-muted mb-8 text-sm">Procesul nostru este transparent de la primul email până la ultimul șurub.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-block px-10 py-4 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all text-xs uppercase font-bold tracking-widest">
               Înapoi sus
            </button>
         </div>
      </section>

    </div>
  );
};
