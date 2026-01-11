
import React from 'react';
import { useI18n } from '../../lib/i18n';

export const Process: React.FC = () => {
  const { lang } = useI18n();

  const steps = [
    { title: "Consultare & Masurare", desc: "Stabilim coordonatele proiectului și verificăm dimensiunile la fața locului cu scanare laser." },
    { title: "Proiectare CAD/CAM", desc: "Transformăm viziunea în fișiere de execuție optimizate pentru utilajele noastre CNC." },
    { title: "Execuție CNC", desc: "Frezare și găurire cu precizie de 0.1mm. Control digital absolut asupra fiecărei piese." },
    { title: "Finisaj 2K Premium", desc: "Vopsire în cabină presurizată cu sisteme poliuretanice rezistente la uzură și UV." },
    { title: "Montaj Specializat", desc: "Echipa noastră instalează mobilierul asigurându-se că aliniamentul este perfect." }
  ];

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
        <div>
          <h1 className="font-serif text-6xl mb-8">Procesul de Execuție</h1>
          <p className="text-muted text-lg font-light leading-relaxed">
            La Carvello, nu lăsăm nimic la voia întâmplării. Fiecare etapă este monitorizată și verificată pentru a asigura standardul de calitate promis.
          </p>
        </div>
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-8 group">
              <span className="font-serif text-4xl text-accent opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border p-12 md:p-20 text-center">
        <h2 className="font-serif text-4xl mb-8">Garanția Calității</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="p-8 border border-border/50">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-accent">Materiale Certificate</h4>
            <p className="text-xs text-muted leading-loose">Folosim doar MDF de densitate mare și accesorii de la lideri mondiali (Blum, Hettich).</p>
          </div>
          <div className="p-8 border border-border/50">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-accent">Control 2K</h4>
            <p className="text-xs text-muted leading-loose">Sistemul nostru de vopsire garantează o aderență superioară și o uniformitate perfectă a culorii.</p>
          </div>
          <div className="p-8 border border-border/50">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-accent">Suport Tehnic</h4>
            <p className="text-xs text-muted leading-loose">Oferim asistență post-montaj și mentenanță pentru toate proiectele noastre premium.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
