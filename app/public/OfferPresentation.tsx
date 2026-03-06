import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Offer, OfferTemplate } from '../../types';
import { Phone, Mail, User, Check } from 'lucide-react';

export const OfferPresentation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [template, setTemplate] = useState<OfferTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadOffer(id);
    }
  }, [id]);

  const loadOffer = async (offerId: string) => {
    try {
      const offerData = await dbService.getOfferById(offerId);
      if (!offerData) {
        setError('Offer not found');
        return;
      }
      setOffer(offerData);

      // Mark as viewed
      dbService.updateOfferStatus(offerId, 'viewed');

      const templates = await dbService.getOfferTemplates();
      const templatesArray = Array.isArray(templates) ? templates : [];
      const templateData = templatesArray.find(t => t.id === offerData.templateId);
      if (templateData) {
        setTemplate(templateData);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading offer...</div>;
  if (error || !offer || !template) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Offer unavailable'}</div>;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-zinc-900 text-white',
    gold: 'bg-amber-50 text-amber-900',
  };

  const containerClasses = themeClasses[template.theme] || themeClasses.light;

  return (
    <div className={`min-h-screen ${containerClasses}`}>
      
      {/* Header */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center border-b border-current/10">
        {template.logoUrl ? (
          <img src={template.logoUrl} alt="Logo" className="h-12 object-contain" />
        ) : (
          <div className="text-2xl font-serif font-bold">CARVELLO</div>
        )}
        <div className="text-sm opacity-70 hidden sm:block">
          Offer #{offer.id.slice(-6)}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero / Message */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            {offer.subject}
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto opacity-50"></div>
          <p className="text-lg opacity-80 leading-relaxed whitespace-pre-wrap">
            {offer.message}
          </p>
        </section>

        {/* Gallery */}
        <section>
          {template.layout === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offer.images.map((img, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-lg shadow-lg group">
                  <img 
                    src={img} 
                    alt={`Offer image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ))}
            </div>
          )}

          {template.layout === 'masonry' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {offer.images.map((img, idx) => (
                <div key={idx} className="break-inside-avoid rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={img} 
                    alt={`Offer image ${idx + 1}`} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              ))}
            </div>
          )}

          {template.layout === 'carousel' && (
             <div className="flex overflow-x-auto gap-6 pb-8 snap-x">
               {offer.images.map((img, idx) => (
                 <div key={idx} className="flex-none w-[85vw] md:w-[600px] aspect-[4/3] rounded-lg overflow-hidden shadow-lg snap-center">
                   <img 
                     src={img} 
                     alt={`Offer image ${idx + 1}`} 
                     className="w-full h-full object-cover" 
                   />
                 </div>
               ))}
             </div>
          )}
        </section>

        {/* Contact / CTA */}
        <section className="max-w-2xl mx-auto bg-current/5 rounded-2xl p-8 md:p-12 text-center space-y-8">
          <h2 className="text-2xl font-serif font-bold">Ready to proceed?</h2>
          <p className="opacity-80">Contact your personal agent for the next steps.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-lg mx-auto">
             <div className="space-y-2">
                <div className="font-bold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 opacity-70" />
                  {template.contactInfo.name}
                </div>
                <div className="opacity-70 text-sm uppercase tracking-widest pl-7">
                  {template.contactInfo.role}
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 opacity-70" />
                  <a href={`tel:${template.contactInfo.phone}`} className="hover:underline">
                    {template.contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 opacity-70" />
                  <a href={`mailto:${template.contactInfo.email}`} className="hover:underline">
                    {template.contactInfo.email}
                  </a>
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm opacity-50 border-t border-current/10">
        &copy; {new Date().getFullYear()} CARVELLO. All rights reserved.
      </footer>
    </div>
  );
};
