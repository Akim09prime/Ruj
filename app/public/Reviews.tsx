
import React from 'react';
import { useI18n } from '../../lib/i18n';

export const Reviews: React.FC = () => {
  const { lang } = useI18n();

  const testimonials = [
    {
      id: 1,
      name: "Adrian Munteanu",
      role: "Arhitect",
      content: {
        ro: "Precizia CNC a celor de la Carvello este de neegalat. Am colaborat pentru un proiect rezidențial complex și toleranțele au fost exact cum am cerut în desenele tehnice.",
        en: "Carvello's CNC precision is unmatched. We collaborated on a complex residential project and the tolerances were exactly as requested in the technical drawings."
      }
    },
    {
      id: 2,
      name: "Elena Popescu",
      role: "Client Rezidențial",
      content: {
        ro: "Finisajul 2K mat pe care l-au aplicat pe mobilierul de bucătărie este incredibil de rezistent și arată extrem de premium. Recomand cu drag.",
        en: "The 2K matte finish they applied to the kitchen furniture is incredibly durable and looks extremely premium. Highly recommend."
      }
    }
  ];

  return (
    <div className="pt-40 pb-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-4">Testimoniale</span>
        <h1 className="font-serif text-5xl md:text-7xl mb-8">Ce spun partenerii noștri</h1>
      </div>

      <div className="grid gap-16">
        {testimonials.map((t, idx) => (
          <div key={t.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}>
            <div className="max-w-2xl bg-surface p-12 border border-border relative">
              <span className="absolute -top-6 -left-6 text-8xl font-serif text-accent opacity-20">“</span>
              <p className="text-xl italic font-light leading-relaxed mb-8 text-muted">
                {lang === 'ro' ? t.content.ro : t.content.en}
              </p>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest">{t.name}</h4>
                <p className="text-xs text-accent uppercase tracking-tighter mt-1">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
