
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t, lang } = useI18n();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', 
    projectType: 'Rezidențial', category: 'Bucătărie', 
    budget: '', timeline: 'Urgent', message: '', gdpr: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = lang === 'ro' ? 'CARVELLO | Contact & Consultanță' : 'CARVELLO | Contact & Consulting';
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdpr) return alert('Te rugăm să accepți politica GDPR.');
    
    setFormStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ 
        name: '', email: '', phone: '', city: '', 
        projectType: 'Rezidențial', category: 'Bucătărie', 
        budget: '', timeline: 'Urgent', message: '', gdpr: false 
      });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#050505] text-[#e5e5e5] font-sans min-h-screen selection:bg-[#d4af37] selection:text-black">
      
      {/* 1) HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1534349762913-92499696587a?auto=format&fit=crop&q=80&w=2000"
            alt="Contact Atelier"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#d4af37] uppercase tracking-[0.3em] text-[10px] font-bold block mb-6 animate-fade-in">
            {lang === 'ro' ? 'Începe Conversația' : 'Start the Conversation'}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 animate-slide-up">
            {lang === 'ro' ? 'Discută Proiectul Tău' : 'Discuss Your Project'}
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
            {lang === 'ro' 
              ? 'Suntem aici pentru a transforma viziunea ta în realitate. Contactează-ne pentru o consultanță inițială.'
              : 'We are here to turn your vision into reality. Contact us for an initial consultation.'}
          </p>
        </div>
      </section>

      {/* 2) CONTACT CONTENT */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* LEFT: INFO */}
            <div className="space-y-12">
               <div>
                  <h2 className="font-serif text-3xl text-white mb-8">
                    {lang === 'ro' ? 'Date de Contact' : 'Contact Details'}
                  </h2>
                  <div className="space-y-8">
                     <div className="flex gap-6 items-start group">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                           <Phone className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Telefon</h3>
                           <a href="tel:+40740000000" className="text-xl text-white hover:text-[#d4af37] transition-colors font-serif">+40 740 000 000</a>
                           <p className="text-xs text-white/40 mt-1">Luni - Vineri: 09:00 - 18:00</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-6 items-start group">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                           <Mail className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Email</h3>
                           <a href="mailto:contact@carvello.ro" className="text-xl text-white hover:text-[#d4af37] transition-colors font-serif">contact@carvello.ro</a>
                           <p className="text-xs text-white/40 mt-1">Răspundem în max. 24h</p>
                        </div>
                     </div>

                     <div className="flex gap-6 items-start group">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                           <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Atelier & Showroom</h3>
                           <p className="text-xl text-white font-serif">Cluj-Napoca, România</p>
                           <p className="text-xs text-white/40 mt-1">Vizite doar cu programare prealabilă.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Map Placeholder */}
               <div className="aspect-video bg-[#111] border border-white/10 relative overflow-hidden group">
                  <OptimizedImage 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Map Location" 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <a 
                       href="https://www.google.com/maps" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="bg-[#d4af37] text-black px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-all shadow-xl"
                     >
                       {lang === 'ro' ? 'Deschide Harta' : 'Open Map'}
                     </a>
                  </div>
               </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative">
               <h2 className="font-serif text-3xl text-white mb-2">
                 {lang === 'ro' ? 'Cere Ofertă' : 'Request Quote'}
               </h2>
               <p className="text-white/40 text-sm mb-8">
                 {lang === 'ro' ? 'Completează formularul și te contactăm noi.' : 'Fill the form and we will contact you.'}
               </p>
               
               {formStatus === 'success' ? (
                  <div className="text-center py-12">
                     <CheckCircle2 className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
                     <h3 className="font-serif text-2xl text-white mb-4">Mesaj Primit!</h3>
                     <p className="text-white/60 text-sm mb-8">
                       {lang === 'ro' ? 'Solicitarea ta a fost înregistrată. Te vom contacta în curând.' : 'Your request has been received. We will contact you soon.'}
                     </p>
                     <button 
                       onClick={() => setFormStatus('idle')}
                       className="text-[#d4af37] text-xs uppercase font-bold tracking-widest hover:text-white transition-colors"
                     >
                       {lang === 'ro' ? 'Trimite alt mesaj' : 'Send another message'}
                     </button>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">Nume</label>
                           <input 
                             required 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors" 
                             placeholder="Nume complet" 
                             value={formData.name} 
                             onChange={e => setFormData({...formData, name: e.target.value})} 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">Telefon</label>
                           <input 
                             required 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors" 
                             placeholder="07xx xxx xxx" 
                             value={formData.phone} 
                             onChange={e => setFormData({...formData, phone: e.target.value})} 
                           />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-white/40">Email</label>
                        <input 
                          required 
                          type="email" 
                          className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors" 
                          placeholder="email@domeniu.ro" 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">Categorie</label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors appearance-none" 
                             value={formData.category} 
                             onChange={e => setFormData({...formData, category: e.target.value})}
                           >
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
                           <label className="text-[9px] uppercase font-bold text-white/40">Tip Proiect</label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors appearance-none" 
                             value={formData.projectType} 
                             onChange={e => setFormData({...formData, projectType: e.target.value})}
                           >
                              <option value="Rezidențial">Rezidențial</option>
                              <option value="Comercial">Comercial</option>
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">Buget Estimativ</label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors appearance-none" 
                             value={formData.budget} 
                             onChange={e => setFormData({...formData, budget: e.target.value})}
                           >
                              <option value="">Alege interval...</option>
                              <option value="< 5.000€">Sub 5.000€</option>
                              <option value="5.000 - 10.000€">5.000 - 10.000€</option>
                              <option value="10.000 - 20.000€">10.000 - 20.000€</option>
                              <option value="> 20.000€">Peste 20.000€</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold text-white/40">Termen Execuție</label>
                           <select 
                             className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors appearance-none" 
                             value={formData.timeline} 
                             onChange={e => setFormData({...formData, timeline: e.target.value})}
                           >
                              <option value="Urgent">Urgent (imposibil de obicei)</option>
                              <option value="2-4 Săptămâni">2-4 Săptămâni</option>
                              <option value="1-2 Luni">1-2 Luni</option>
                              <option value="Flexibil">Flexibil</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-white/40">Mesaj</label>
                        <textarea 
                           required 
                           className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white outline-none focus:border-[#d4af37] transition-colors h-32 resize-none" 
                           placeholder={lang === 'ro' ? 'Descrie proiectul...' : 'Describe the project...'} 
                           value={formData.message} 
                           onChange={e => setFormData({...formData, message: e.target.value})} 
                        />
                     </div>

                     <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          required 
                          checked={formData.gdpr} 
                          onChange={e => setFormData({...formData, gdpr: e.target.checked})} 
                          className="mt-1 accent-[#d4af37]" 
                        />
                        <label className="text-[10px] text-white/60 leading-tight">
                          {lang === 'ro' 
                            ? 'Sunt de acord cu prelucrarea datelor cu caracter personal în scopul ofertării.'
                            : 'I agree to the processing of personal data for the purpose of quoting.'}
                        </label>
                     </div>

                     <button 
                        disabled={formStatus === 'sending'} 
                        className="w-full py-5 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-70 shadow-xl"
                     >
                        {formStatus === 'sending' 
                          ? (lang === 'ro' ? 'Se Trimite...' : 'Sending...') 
                          : (lang === 'ro' ? 'Trimite Cererea' : 'Send Request')}
                     </button>
                  </form>
               )}
            </div>

         </div>
      </section>

    </div>
  );
};
