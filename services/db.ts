
import { AppDB, Settings, Project, Media, Page, Lead, ServicePage, ProcessStep, AboutPageData, Review, ContactPageData, Offer, OfferTemplate } from '../types';

// DEBUG FLAG - Set to true for preview environment (Node.js) where PHP doesn't run.
// On cPanel (Apache/PHP), the server will execute PHP, so the "<?php" check will fail, 
// and this flag won't matter (it will use the real backend).
const DEBUG_MODE = true;

const getBasePath = () => {
  // In production (cPanel), the app is at the root or a subdirectory.
  // The API is always at ./api relative to the index.html
  return '';
};

const API_BASE = `${getBasePath()}/api`;

const SEED_DATA: AppDB = {
  version: 10,
  settings: {
    id: 'global',
    maintenanceMode: false,
    projectTypes: ['Rezidențial', 'HoReCa', 'Office', 'Comercial'],
    rooms: ['Living', 'Bucătărie', 'Dormitor', 'Baie', 'Hol', 'Office'],
    stages: ['Concept', 'Proiectare', 'Execuție', 'Finisaj', 'Montaj'],
    pieceTypes: ['Masă', 'Dulap', 'Insulă', 'Panou CNC', 'Recepție'],
    nav: [
      { id: '1', label: { ro: 'Acasă', en: 'Home' }, href: '/', visible: true, order: 0 },
      { id: '2', label: { ro: 'Portofoliu', en: 'Portfolio' }, href: '/portofoliu', visible: true, order: 1 },
      { id: '3', label: { ro: 'Servicii', en: 'Services' }, href: '/servicii', visible: true, order: 2 },
      { id: '4', label: { ro: 'Galerie', en: 'Gallery' }, href: '/galerie-mobilier', visible: true, order: 3 },
      { id: '5', label: { ro: 'Proces', en: 'Process' }, href: '/proces-garantii', visible: true, order: 4 },
      { id: '6', label: { ro: 'Recenzii', en: 'Reviews' }, href: '/recenzii', visible: true, order: 5 },
      { id: '7', label: { ro: 'Despre', en: 'About' }, href: '/despre', visible: true, order: 6 },
      { id: '8', label: { ro: 'Contact', en: 'Contact' }, href: '/contact', visible: true, order: 7 },
    ],
    footer: {
      contact: { address: 'Strada Industriei Nr. 10, Cluj-Napoca', email: 'office@carvello.ro', phone: '0729 728 880' },
      socials: [{ platform: 'Instagram', url: '#' }, { platform: 'Facebook', url: '#' }],
      legal: { ro: '© 2024 CARVELLO. Toate drepturile rezervate.', en: '© 2024 CARVELLO. All rights reserved.' }
    },
    activeTheme: 'obsidian',
    featuredStarsThreshold: 4,
    brand: { logoDarkUrl: '', logoLightUrl: '', brandName: 'CARVELLO', brandSlogan: 'Executat milimetric.', useTextLogo: true },
    adminPassword: '', // Handled by server auth
    hero: {
      mode: 'slider', enabled: true, height: 'fullscreen', overlayStrength: 45, align: 'center',
      eyebrow: { ro: 'CARVELLO — Mobilier premium', en: 'CARVELLO — Premium furniture' },
      titleLine1: { ro: 'Mobilier la comandă.', en: 'Custom furniture.' },
      titleLine2: { ro: 'Executat milimetric.', en: 'Millimetrically executed.' },
      subtitle: { ro: 'Producție CNC și finisaje de lux.', en: 'CNC production and luxury finishes.' },
      microFeatures: ['3D', 'CNC', '2K Paint'],
      primaryCta: { label: { ro: 'Cere ofertă', en: 'Get Quote' }, href: '/cerere-oferta' },
      secondaryCta: { label: { ro: 'Portofoliu', en: 'Portfolio' }, href: '/portofoliu', visible: true },
      videoUrl: '', posterUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000',
      muted: true, loop: true, showPlayButton: false, autoplay: true, interval: 6000, slides: []
    }
  },
  about: {
    hero: { title: {ro:'Despre CARVELLO',en:'About CARVELLO'}, subtitle: {ro:'Măiestrie și Precizie',en:'Craftsmanship and Precision'}, text: {ro:'Suntem un atelier de producție mobilier premium, dedicat excelenței în design și execuție.',en:'We are a premium furniture production workshop, dedicated to excellence in design and execution.'}, mediaId: null },
    manifesto: { title: {ro:'Manifestul Nostru',en:'Our Manifesto'}, text: {ro:'Credem că mobilierul nu este doar un obiect utilitar, ci o expresie a personalității și a stilului de viață. Ne angajăm să creăm piese care nu doar arată impecabil, ci și rezistă testului timpului, folosind cele mai bune materiale și tehnologii de ultimă generație.',en:'We believe that furniture is not just a utilitarian object, but an expression of personality and lifestyle. We are committed to creating pieces that not only look flawless but also stand the test of time, using the best materials and cutting-edge technologies.'}, bullets: [{ro:'Atenție obsesivă la detalii',en:'Obsessive attention to detail'},{ro:'Inovație continuă în producție',en:'Continuous innovation in production'},{ro:'Respect pentru materiale și mediu',en:'Respect for materials and the environment'}] },
    pillars: [{title:{ro:'Tehnologie CNC',en:'CNC Technology'},description:{ro:'Precizie milimetrică în fiecare tăietură.',en:'Millimeter precision in every cut.'}},{title:{ro:'Finisaje Premium',en:'Premium Finishes'},description:{ro:'Vopsire 2K și furnire naturale selectate manual.',en:'2K painting and hand-selected natural veneers.'}},{title:{ro:'Design Personalizat',en:'Custom Design'},description:{ro:'Soluții unice pentru fiecare spațiu.',en:'Unique solutions for every space.'}}], quality: { title: {ro:'Standardul CARVELLO',en:'The CARVELLO Standard'}, bullets: [{ro:'Feronerie Blum cu garanție extinsă',en:'Blum hardware with extended warranty'},{ro:'MDF de înaltă densitate pentru durabilitate',en:'High-density MDF for durability'},{ro:'Control riguros al calității în 3 etape',en:'Rigorous 3-stage quality control'}], images: [] }, timeline: [{year:'2018',title:{ro:'Începutul',en:'The Beginning'},description:{ro:'Am deschis primul nostru atelier, cu o echipă mică dar pasionată.',en:'We opened our first workshop, with a small but passionate team.'}},{year:'2021',title:{ro:'Modernizarea',en:'Modernization'},description:{ro:'Am investit în primele utilaje CNC pentru a crește precizia.',en:'We invested in our first CNC machines to increase precision.'}},{year:'2024',title:{ro:'Extinderea',en:'Expansion'},description:{ro:'Ne-am mutat într-o nouă facilitate de producție, dublându-ne capacitatea.',en:'We moved to a new production facility, doubling our capacity.'}}],
    clients: { resTitle: {ro:'Clienți Rezidențiali',en:'Residential Clients'}, resDesc: {ro:'Peste 200 de familii se bucură zilnic de mobilierul creat de noi.',en:'Over 200 families enjoy the furniture we created every day.'}, comTitle: {ro:'Parteneri B2B',en:'B2B Partners'}, comDesc: {ro:'Colaborăm cu arhitecți și designeri de top pentru proiecte complexe.',en:'We collaborate with top architects and designers for complex projects.'}},
    cta: { title: {ro:'Gata să începem proiectul tău?',en:'Ready to start your project?'}, trustLine: {ro:'Contactează-ne pentru o consultație gratuită.',en:'Contact us for a free consultation.'}}
  },
  contact: {
    hero: { title: {ro:'Contact',en:'Contact'}, subtitle: {ro:'Hai să discutăm',en:'Lets talk'}, ctaPrimary: {ro:'Mesaj',en:'Message'}, ctaSecondary: {ro:'WhatsApp',en:'WhatsApp'}, coverImageId: null },
    info: { phone: '0729 728 880', email: 'office@carvello.ro', address: 'Strada Industriei 10', city: 'Cluj', country: 'Ro', hours: 'L-V', "responseBuffer": {"ro":"24h","en":"24h"}, whatsappLink: '', mapEmbedUrl: '' },
    timeline: { steps: [] }, faq: []
  },
  media: [
    { id: 'm1', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', room: 'Bucătărie', stage: 'Final', pieceTypes: ['Insulă'], stars: 5, caption: {ro: 'Bucătărie Modernă', en: 'Modern Kitchen'}, shotDate: '2024-01-15', orderInProject: 1, createdAt: new Date().toISOString() },
    { id: 'm2', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800', room: 'Living', stage: 'Final', pieceTypes: ['Masă'], stars: 4, caption: {ro: 'Living Open Space', en: 'Open Space Living'}, shotDate: '2024-01-15', orderInProject: 2, createdAt: new Date().toISOString() },
    { id: 'm3', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1616594039964-408359566a05?auto=format&fit=crop&q=80&w=800', room: 'Dormitor', stage: 'Final', pieceTypes: ['Dulap'], stars: 5, caption: {ro: 'Dormitor Matrimonial', en: 'Master Bedroom'}, shotDate: '2024-01-15', orderInProject: 3, createdAt: new Date().toISOString() },
    { id: 'm4', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800', room: 'Office', stage: 'Final', pieceTypes: ['Birou'], stars: 4, caption: {ro: 'Birou Executive', en: 'Executive Office'}, shotDate: '2024-01-15', orderInProject: 4, createdAt: new Date().toISOString() },
    { id: 'm5', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', room: 'Living', stage: 'Detalii', pieceTypes: ['Finisaj'], stars: 5, caption: {ro: 'Detaliu Furnir', en: 'Veneer Detail'}, shotDate: '2024-01-15', orderInProject: 5, createdAt: new Date().toISOString() }
  ],
  projects: [
    {
      id: 'p1',
      title: { ro: 'Penthouse Panoramic', en: 'Panoramic Penthouse' },
      summary: { ro: 'Amenajare completă pentru un penthouse de 200mp în centrul orașului.', en: 'Complete furnishing for a 200sqm penthouse in the city center.' },
      timelineDate: '2024-01-20',
      projectType: 'Rezidențial',
      location: { ro: 'Cluj-Napoca', en: 'Cluj-Napoca' },
      isPublished: true,
      isVisible: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: 'penthouse-panoramic',
      coverMediaId: 'm1',
      agentId: 'admin',
      tags: ['Luxury', 'Modern', 'Penthouse'],
      heroConfig: { mode: 'image', imageId: 'm2', overlay: { intensity: 30, vignette: true, grain: false } },
      stages: [],
      techSpecs: [{ label: 'Materiale', value: 'MDF Vopsit, Furnir Nuc' }, { label: 'Feronerie', value: 'Blum Legrabox' }]
    }
  ],
  services: [
    {id:'mobilier-premium',slug:'mobilier-premium',title:{ro:'Mobilier Premium la Comandă',en:'Premium Custom Furniture'},shortDescription:{ro:'Rezidențial & Comercial',en:'Residential & Commercial'},fullDescription:{ro:'Nu livrăm doar piese de mobilier, ci soluții arhitecturale perfect integrate. De la bucătării statement la dressing-uri complexe și panotări de pereți, controlăm fiecare milimetru al producției.',en:'We deliver not just furniture pieces, but perfectly integrated architectural solutions. From statement kitchens to complex walk-in closets and wall paneling, we control every millimeter of production.'},order:1,features:[{title:{ro:'Pentru Cine',en:'Target Audience'},description:{ro:'Arhitecți, Designeri, Proprietari de locuințe luxury.',en:'Architects, Designers, Luxury Homeowners.'}},{title:{ro:'Valoare Adăugată',en:'Value Added'},description:{ro:'Eliminăm nepotrivirile din șantier, finisajele mediocre și compromisurile de execuție.',en:'We eliminate site mismatches, mediocre finishes, and execution compromises.'}}],bullets:[{ro:'Releu digital & Proiectare tehnică',en:'Digital Survey & Technical Design'},{ro:'Materiale: MDF vopsit, Furnir, Lemn Masiv, Metal',en:'Materials: Painted MDF, Veneer, Solid Wood, Metal'},{ro:'Montaj cu echipă proprie',en:'Installation with in-house team'}],galleryIds:[],heroMediaId:'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200'},
    {id:'servicii-cnc',slug:'servicii-cnc',title:{ro:'Servicii de Frezare CNC',en:'CNC Milling Services'},shortDescription:{ro:'Precizie & Volum',en:'Precision & Volume'},fullDescription:{ro:'Partenerul tehnic ideal pentru proiecte complexe. Dispunem de tehnologie CNC de ultimă generație pentru debitare, frezare și gravare pe o gamă largă de materiale.',en:'The ideal technical partner for complex projects. We utilize state-of-the-art CNC technology for cutting, milling, and engraving on a wide range of materials.'},order:2,features:[{title:{ro:'Pentru Cine',en:'Target Audience'},description:{ro:'Producători de mobilă, Arhitecți, Dezvoltatori Imobiliari.',en:'Furniture Manufacturers, Architects, Real Estate Developers.'}},{title:{ro:'Valoare Adăugată',en:'Value Added'},description:{ro:'Execuție rapidă și precisă pentru forme curbe, traforaje sau piese unicat imposibil de realizat manual.',en:'Fast and precise execution for curved shapes, fretwork, or unique pieces impossible to make by hand.'}}],bullets:[{ro:'Frezare 2D & 3D complexă',en:'Complex 2D & 3D Milling'},{ro:'Debitare MDF, PAL, Placaj, Compozit',en:'Cutting MDF, Chipboard, Plywood, Composite'},{ro:'Prototipare rapidă',en:'Rapid Prototyping'}],galleryIds:[],heroMediaId:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200'},
    {id:'proiectare-design',slug:'proiectare-design',title:{ro:'Proiectare & Randare 3D',en:'3D Design & Rendering'},shortDescription:{ro:'Vizualizare & Concept',en:'Visualization & Concept'},fullDescription:{ro:'Vezi viitorul spațiu înainte de a investi. Transformăm schițele sau ideile tale în imagini fotorealiste și planuri tehnice gata de execuție.',en:'See your future space before investing. We transform your sketches or ideas into photorealistic images and technical plans ready for execution.'},order:3,features:[{title:{ro:'Pentru Cine',en:'Target Audience'},description:{ro:'Clienți care vor claritate, Dezvoltatori care vând off-plan.',en:'Clients seeking clarity, Developers selling off-plan.'}},{title:{ro:'Valoare Adăugată',en:'Value Added'},description:{ro:'Elimină riscul de a primi ceva ce nu îți place. Validezi estetica și funcționalitatea înainte de producție.',en:'Eliminate the risk of getting something you don\'t like. Validate aesthetics and functionality before production.'}}],bullets:[{ro:'Randări fotorealiste 4K',en:'4K Photorealistic Renderings'},{ro:'Planuri tehnice de execuție',en:'Technical Execution Plans'},{ro:'Moodboard & Selecție materiale',en:'Moodboard & Material Selection'}],galleryIds:[],heroMediaId:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'}
  ],
  processSteps: [
    {id:'1',title:{ro:'Consultare & Viziune',en:'Consultation & Vision'},description:{ro:'Începem cu o discuție relaxată despre nevoile tale. Vrem să înțelegem stilul de viață, preferințele estetice și bugetul alocat.',en:'We start with a relaxed discussion about your needs. We want to understand your lifestyle, aesthetic preferences, and allocated budget.'},bullets:[{ro:'Analizăm spațiul, stilul dorit și bugetul estimat.',en:'We analyze the space, desired style, and estimated budget.'},{ro:'O direcție clară și o estimare preliminară.',en:'A clear direction and a preliminary estimate.'}],mediaId:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',order:1,isVisible:true,cta:{label:{ro:'Vezi detalii',en:'View details'},href:'#'}},
    {id:'2',title:{ro:'Măsurători & Proiectare',en:'Measurements & Design'},description:{ro:'Transformăm ideile în planuri tehnice concrete. Nu lăsăm nimic la voia întâmplării.',en:'We transform ideas into concrete technical plans. We leave nothing to chance.'},bullets:[{ro:'Releu digital 3D, proiectare tehnică detaliată, randări fotorealiste.',en:'3D digital survey, detailed technical design, photorealistic renderings.'},{ro:'Proiect complet 3D și dosar tehnic de execuție.',en:'Complete 3D project and technical execution file.'}],mediaId:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',order:2,isVisible:true,cta:{label:{ro:'Vezi detalii',en:'View details'},href:'#'}},
    {id:'3',title:{ro:'Ofertare & Contract',en:'Quote & Contract'},description:{ro:'Transparență totală asupra costurilor. Oferta noastră este finală, fără costuri ascunse.',en:'Total transparency on costs. Our quote is final, with no hidden costs.'},bullets:[{ro:'Ofertă detaliată pe materiale, feronerie și manoperă.',en:'Detailed quote on materials, hardware, and labor.'},{ro:'Contract ferm cu termene de execuție clare.',en:'Firm contract with clear execution deadlines.'}],mediaId:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200',order:3,isVisible:true,cta:{label:{ro:'Vezi detalii',en:'View details'},href:'#'}},
    {id:'4',title:{ro:'Producție CNC & Finisare',en:'CNC Production & Finishing'},description:{ro:'Unde tehnologia întâlnește măiestria. Producem totul in-house, controlând calitatea fiecărei piese.',en:'Where technology meets craftsmanship. We produce everything in-house, controlling the quality of every piece.'},bullets:[{ro:'Debitare și frezare CNC, vopsire în cabină presurizată, pre-asamblare.',en:'CNC cutting and milling, painting in pressurized booth, pre-assembly.'},{ro:'Mobilier executat la milimetru, gata de montaj.',en:'Furniture executed to the millimeter, ready for installation.'}],mediaId:'https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=1200',order:4,isVisible:true,cta:{label:{ro:'Vezi detalii',en:'View details'},href:'#'}},
    {id:'5',title:{ro:'Livrare & Montaj',en:'Delivery & Installation'},description:{ro:'Ultimul pas spre casa visurilor tale. Tratăm casa ta cu respectul cuvenit.',en:'The last step to your dream home. We treat your home with the respect it deserves.'},bullets:[{ro:'Transport specializat, montaj cu echipe proprii, curățenie finală.',en:'Specialized transport, installation with in-house teams, final cleaning.'},{ro:'Spațiu gata de utilizare, impecabil.',en:'Space ready for use, spotless.'}],mediaId:'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',order:5,isVisible:true,cta:{label:{ro:'Vezi detalii',en:'View details'},href:'#'}}
  ],
  reviews: [],
  pages: [], 
  leads: [],
  offerTemplates: [
    {
      id: 'template-rezidential',
      name: 'Ofertă Rezidențial Premium',
      layout: 'grid',
      theme: 'light',
      defaultTitle: 'Propunere Mobilier Custom — CARVELLO',
      defaultMessage: 'Bună ziua,\n\nVă mulțumim pentru oportunitatea de a colabora la amenajarea locuinței dumneavoastră. Am analizat cu atenție cerințele discutate și suntem încântați să vă prezentăm viziunea noastră.\n\nPropunerea atașată include:\n- Randări fotorealiste ale spațiilor\n- Selecție de materiale premium (MDF vopsit, furnir natural)\n- Soluții tehnice de feronerie Blum de ultimă generație\n- Estimare bugetară detaliată\n\nSuntem dedicați excelenței și garantăm o execuție milimetrică pentru fiecare piesă de mobilier.\n\nAșteptăm cu interes feedback-ul dumneavoastră pentru a rafina detaliile.\n\nCu stimă,',
      contactInfo: { name: 'Alexandru Pop', phone: '0729 728 880', email: 'alex@carvello.ro', role: 'Senior Designer' },
      createdAt: new Date().toISOString()
    },
    {
      id: 'template-b2b',
      name: 'Parteneriat Arhitecți & Designeri',
      layout: 'masonry',
      theme: 'gold',
      defaultTitle: 'Parteneriat Producție — CARVELLO',
      defaultMessage: 'Stimate Partener,\n\nÎnțelegem exigențele proiectelor de arhitectură și nevoia de a avea un partener de producție pe care vă puteți baza. La CARVELLO, transformăm viziunea dumneavoastră în realitate, fără compromisuri.\n\nDe ce să colaborăm:\n- Tehnologie CNC de precizie pentru forme complexe\n- Capacitate de producție pentru proiecte mari (HoReCa, Office)\n- Finisaje speciale (vopsire 2K, furnire rare, inserții metalice)\n- Suport tehnic dedicat pe tot parcursul proiectului\n\nVă invităm la o vizită în atelierul nostru pentru a vedea mostre și a discuta despre următorul proiect.\n\nCu respect,',
      contactInfo: { name: 'Director Vânzări', phone: '0729 728 880', email: 'b2b@carvello.ro', role: 'Manager Parteneriate' },
      createdAt: new Date().toISOString()
    },
    {
      id: 'template-update',
      name: 'Update Status Producție',
      layout: 'carousel',
      theme: 'dark',
      defaultTitle: 'Actualizare Proiect — În Producție',
      defaultMessage: 'Bună ziua,\n\nVrem să vă ținem la curent cu progresul mobilierului dumneavoastră. Suntem în etapa de finisaj și asamblare finală în atelier.\n\nAtașat regăsiți câteva imagini din procesul de producție. Totul decurge conform planului și estimăm livrarea în data stabilită.\n\nNu ezitați să ne contactați pentru orice întrebări.\n\nEchipa CARVELLO',
      contactInfo: { name: 'Departament Tehnic', phone: '0729 728 880', email: 'productie@carvello.ro', role: 'Manager Proiect' },
      createdAt: new Date().toISOString()
    }
  ],
  offers: []
};

class DBService {
  // Helper to fetch data with fallback to SEED_DATA
  private async fetchContent<T>(type: string, fallback: T): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API_BASE}/content.php?file=${type}.json`, { 
        credentials: 'include',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 404) {
             // File doesn't exist yet, return fallback
             return fallback;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      
      // Check for PHP source code leak (misconfiguration)
      if (text.trim().startsWith('<?php')) {
        console.error('Server returned PHP source code instead of JSON. Check server configuration.');
        if (DEBUG_MODE) {
             const mockData = localStorage.getItem(`carvello_mock_${type}`);
             return mockData ? JSON.parse(mockData) : fallback;
        }
        return fallback;
      }
      
      // Check for HTML error page
      if (text.trim().startsWith('<')) {
          console.warn(`Received HTML for ${type}, using fallback`);
          return fallback;
      }
      
      if (!text) return fallback;
      
      const data = JSON.parse(text);
      
      // If data is empty array for certain types, use fallback to restore defaults
      if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback) && (fallback as any[]).length > 0) {
        if (['services', 'process', 'offerTemplates'].includes(type)) {
          console.log(`Using fallback for ${type} because fetched data is empty`);
          return fallback;
        }
      }
      
      // Merge with fallback for objects to ensure all keys exist
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
         return { ...fallback, ...data };
      }
      
      return data as T;
    } catch (e) {
      console.warn(`Failed to fetch ${type}, using fallback`, e);
      if (DEBUG_MODE) {
          const mockData = localStorage.getItem(`carvello_mock_${type}`);
          return mockData ? JSON.parse(mockData) : fallback;
      }
      return fallback;
    }
  }

  // Helper to save data
  private async saveContent<T>(type: string, data: T): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/content.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: `${type}.json`, data }),
        credentials: 'include'
      });
      
      const text = await res.text();
      
      if (text.trim().startsWith('<?php')) {
        if (DEBUG_MODE) {
            localStorage.setItem(`carvello_mock_${type}`, JSON.stringify(data));
            return;
        }
        throw new Error('Server misconfigured (PHP source returned)');
      }
      
      if (!res.ok) throw new Error('Failed to save data');
      
      const json = JSON.parse(text);
      if (json.ok === false) throw new Error(json.message);
      if (json.error) throw new Error(json.error);
      
    } catch (e) {
      console.error(`Failed to save ${type}`, e);
      throw e;
    }
  }

  // Auth methods
  async checkAuth(): Promise<boolean> {
    try {
      const token = localStorage.getItem('carvello_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/auth.php?action=session`, { 
        credentials: 'include',
        headers
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) return DEBUG_MODE; // Dev fallback
      const data = JSON.parse(text);
      return data.authenticated === true;
    } catch { return false; }
  }

  async getSession(): Promise<{ authenticated: boolean; user?: string; role?: string }> {
    try {
      const token = localStorage.getItem('carvello_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/auth.php?action=session`, { 
        credentials: 'include',
        headers
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) return { authenticated: DEBUG_MODE, role: 'admin' };
      return JSON.parse(text);
    } catch { return { authenticated: false }; }
  }

  async login(password: string): Promise<boolean> {
    // Deprecated, use loginUser
    return (await this.loginUser('admin', password)).success;
  }

  async loginUser(username: string, password: string): Promise<{ success: boolean; role?: string; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) return { success: DEBUG_MODE && (password === 'admin' || password === 'carvello2024'), role: 'admin' };
      
      const data = JSON.parse(text);
      if (data.success && data.token) {
        localStorage.setItem('carvello_token', data.token);
      }
      return data;
    } catch (e) { return { success: false, message: 'Network error' }; }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('carvello_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${API_BASE}/auth.php?action=logout`, { 
        method: 'POST',
        credentials: 'include',
        headers
      });
      localStorage.removeItem('carvello_token');
    } catch (e) {
      // ignore
    }
  }

  async changePassword(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=change_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: password }),
        credentials: 'include'
      });
      const data = await res.json();
      return data.success;
    } catch { return false; }
  }

  async listUsers(): Promise<{ username: string; role: string }[]> {
    const res = await fetch(`${API_BASE}/auth.php?action=list_users`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to list users');
    return res.json();
  }

  async addUser(user: any): Promise<void> {
    const res = await fetch(`${API_BASE}/auth.php?action=add_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'include'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Failed to add user');
    }
  }

  async deleteUser(username: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth.php?action=delete_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
      credentials: 'include'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Failed to delete user');
    }
  }

  async sendOffer(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/send_offer.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Failed to send offer');
    }
    return res.json();
  }

  // Settings
  async getSettings(): Promise<Settings> { 
    return this.fetchContent('settings', SEED_DATA.settings); 
  }
  async updateSettings(settings: Settings): Promise<void> { 
    await this.saveContent('settings', settings); 
  }

  // Contact
  async getContactData(): Promise<ContactPageData> { 
    return this.fetchContent('contact', SEED_DATA.contact); 
  }
  async updateContactData(data: ContactPageData): Promise<void> { 
    await this.saveContent('contact', data); 
  }

  // About
  async getAboutData(): Promise<AboutPageData> { 
    return this.fetchContent('about', SEED_DATA.about); 
  }
  async updateAboutData(data: AboutPageData): Promise<void> { 
    await this.saveContent('about', data); 
  }

  // Reviews
  async getReviews(): Promise<Review[]> { 
    return this.fetchContent('reviews', SEED_DATA.reviews); 
  }
  async upsertReview(review: Review): Promise<void> { 
    const reviews = await this.getReviews();
    const idx = reviews.findIndex(r => r.id === review.id);
    if (idx >= 0) reviews[idx] = review; else reviews.unshift(review);
    await this.saveContent('reviews', reviews);
  }
  async deleteReview(id: string): Promise<void> { 
    const reviews = await this.getReviews();
    const newReviews = reviews.filter(r => r.id !== id);
    await this.saveContent('reviews', newReviews);
  }

  // Projects
  async getProjects(): Promise<Project[]> { 
    return this.fetchContent('portfolio', SEED_DATA.projects); 
  }
  async getProject(id: string): Promise<Project | undefined> { 
    const projects = await this.getProjects();
    return projects.find(p => p.id === id); 
  }
  async getProjectBySlug(slug: string): Promise<Project | undefined> { 
    const projects = await this.getProjects();
    return projects.find(p => p.slug === slug || p.id === slug); 
  }
  async upsertProject(project: Project): Promise<void> { 
    const projects = await this.getProjects();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) projects[idx] = project; else projects.push(project);
    await this.saveContent('portfolio', projects);
  }
  async deleteProject(id: string): Promise<void> { 
    const projects = await this.getProjects();
    const newProjects = projects.filter(p => p.id !== id);
    await this.saveContent('portfolio', newProjects);
  }

  // Media
  async getMedia(projectId?: string): Promise<Media[]> { 
    const media = await this.fetchContent('gallery', SEED_DATA.media);
    if (projectId) return media.filter(m => m.projectId === projectId);
    return media;
  }
  async upsertMedia(mediaItem: Media): Promise<void> { 
    const media = await this.getMedia();
    const mediaArray = Array.isArray(media) ? media : [];
    const idx = mediaArray.findIndex(m => m.id === mediaItem.id);
    if (idx >= 0) mediaArray[idx] = mediaItem; else mediaArray.push(mediaItem);
    await this.saveContent('gallery', mediaArray);
  }
  async deleteMedia(id: string): Promise<void> { 
    const media = await this.getMedia();
    const mediaArray = Array.isArray(media) ? media : [];
    const newMedia = mediaArray.filter(m => m.id !== id);
    await this.saveContent('gallery', newMedia);
  }
  
  // File Upload
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE}/upload.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const text = await res.text();
      
      // Check for PHP source code (Preview Environment)
      if (text.trim().startsWith('<?php')) {
        console.warn('PHP Upload not available in preview. Using Object URL.');
        if (DEBUG_MODE) {
          return URL.createObjectURL(file);
        }
        throw new Error('Server misconfigured (PHP source returned)');
      }

      if (!res.ok) throw new Error('Upload failed');
      const data = JSON.parse(text);
      return data.url;
    } catch (e) {
      console.error('Upload failed:', e);
      if (DEBUG_MODE) {
         // Fallback for preview
         return URL.createObjectURL(file);
      }
      throw e;
    }
  }

  // Pages
  async getPages(): Promise<Page[]> { 
    return this.fetchContent('pages', SEED_DATA.pages); 
  }
  async getPageBySlug(slug: string): Promise<Page | undefined> { 
    const pages = await this.getPages();
    return pages.find(p => p.slug === slug || p.id === slug); 
  }
  async upsertPage(page: Page): Promise<void> { 
    const pages = await this.getPages();
    const idx = pages.findIndex(p => p.id === page.id);
    if (idx >= 0) pages[idx] = page; else pages.push(page);
    await this.saveContent('pages', pages);
  }
  async deletePage(id: string): Promise<void> { 
    const pages = await this.getPages();
    const newPages = pages.filter(p => p.id !== id);
    await this.saveContent('pages', newPages);
  }

  // Leads
  async getLeads(): Promise<Lead[]> { 
    return this.fetchContent('leads', SEED_DATA.leads); 
  }
  async addLead(lead: Lead): Promise<void> { 
    const leads = await this.getLeads();
    leads.unshift(lead);
    await this.saveContent('leads', leads);
  }
  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> { 
    const leads = await this.getLeads();
    const lead = leads.find(l => l.id === id);
    if (lead) { 
      lead.status = status; 
      await this.saveContent('leads', leads); 
    } 
  }

  // Services
  async getServices(): Promise<ServicePage[]> { 
    const services = await this.fetchContent('services', SEED_DATA.services);
    return services.sort((a,b) => a.order - b.order);
  }
  async getServiceBySlug(slug: string): Promise<ServicePage | undefined> { 
    const services = await this.getServices();
    return services.find(s => s.slug === slug); 
  }
  async upsertService(service: ServicePage): Promise<void> { 
    const services = await this.getServices();
    const idx = services.findIndex(s => s.id === service.id);
    if (idx >= 0) services[idx] = service; else services.push(service);
    await this.saveContent('services', services);
  }

  // Process Steps
  async getProcessSteps(): Promise<ProcessStep[]> { 
    const steps = await this.fetchContent('process', SEED_DATA.processSteps);
    return steps.sort((a,b) => a.order - b.order);
  }
  async upsertProcessStep(step: ProcessStep): Promise<void> { 
    const steps = await this.getProcessSteps();
    const idx = steps.findIndex(s => s.id === step.id);
    if (idx >= 0) steps[idx] = step; else steps.push(step);
    await this.saveContent('process', steps);
  }

  // Offer Templates
  async getOfferTemplates(): Promise<OfferTemplate[]> {
    return this.fetchContent('offerTemplates', SEED_DATA.offerTemplates);
  }

  async upsertOfferTemplate(template: OfferTemplate): Promise<void> {
    const templates = await this.getOfferTemplates();
    const templatesArray = Array.isArray(templates) ? templates : [];
    const idx = templatesArray.findIndex(t => t.id === template.id);
    if (idx >= 0) templatesArray[idx] = template; else templatesArray.push(template);
    await this.saveContent('offerTemplates', templatesArray);
  }

  async deleteOfferTemplate(id: string): Promise<void> {
    const templates = await this.getOfferTemplates();
    const templatesArray = Array.isArray(templates) ? templates : [];
    const newTemplates = templatesArray.filter(t => t.id !== id);
    await this.saveContent('offerTemplates', newTemplates);
  }

  // Offers
  async getOffers(): Promise<Offer[]> {
    return this.fetchContent('offers', SEED_DATA.offers);
  }

  async getOfferById(id: string): Promise<Offer | undefined> {
    const offers = await this.getOffers();
    const offersArray = Array.isArray(offers) ? offers : [];
    return offersArray.find(o => o.id === id);
  }

  async createOffer(offer: Offer): Promise<void> {
    const offers = await this.getOffers();
    const offersArray = Array.isArray(offers) ? offers : [];
    offersArray.push(offer);
    await this.saveContent('offers', offersArray);
  }

  async updateOfferStatus(id: string, status: 'viewed' | 'archived'): Promise<void> {
    const offers = await this.getOffers();
    const offersArray = Array.isArray(offers) ? offers : [];
    const offer = offersArray.find(o => o.id === id);
    if (offer) {
      offer.status = status;
      if (status === 'viewed') {
        offer.viewCount = (offer.viewCount || 0) + 1;
      }
      await this.saveContent('offers', offersArray);
    }
  }

  // Backup/Restore
  async exportDB(): Promise<string> { 
    const res = await fetch(`${API_BASE}/backup.php?action=export`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Export failed');
    const data = await res.json();
    return data.file;
  }
  
  async importDB(json: string): Promise<void> {
    // Not implemented for file-based backup yet, would need upload endpoint for zip
    console.warn("Import not fully implemented for file-based system");
  }
  
  async resetToSeed(): Promise<void> { 
    // Not implemented
  }
}

export const dbService = new DBService();
