import { AppDB, Settings, Project, Media, Page, Lead, ServicePage, ProcessStep, AboutPageData, Review, ContactPageData } from '../types';

const DB_KEY = 'carvello_db';
const DB_VERSION = 4; // INCREMENTED TO FORCE MAINTENANCE MODE UPDATE

const BRAND_LOGO_DARK = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 
const BRAND_LOGO_LIGHT = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 

// Helper dates
const today = new Date().toISOString();
const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

// --- 1. CONTACT SEED ---
const SEED_CONTACT: ContactPageData = {
  hero: {
    title: { ro: 'Hai să construim ceva impecabil.', en: 'Let\'s build something flawless.' },
    subtitle: { ro: 'Trimite detaliile proiectului și revenim cu o estimare + un plan clar.', en: 'Send project details and we return with an estimate + a clear plan.' },
    ctaPrimary: { ro: 'Cere Ofertă', en: 'Get Quote' },
    ctaSecondary: { ro: 'WhatsApp', en: 'WhatsApp' },
    coverImageId: null // uses fallback
  },
  info: {
    phone: '0729 728 880',
    email: 'office@carvello.ro',
    address: 'Strada Industriei Nr. 10',
    city: 'Cluj-Napoca',
    country: 'România',
    hours: 'L–V 09:00–18:00',
    responseBuffer: { ro: 'Răspundem în max. 24h lucrătoare', en: 'We reply in max 24 business hours' },
    whatsappLink: 'https://wa.me/40729728880',
    mapEmbedUrl: '' // Empty to trigger premium placeholder
  },
  timeline: {
    steps: [
      { title: { ro: 'Solicitare', en: 'Request' }, desc: { ro: 'Analizăm cererea ta în 24h.', en: 'We analyze your request in 24h.' } },
      { title: { ro: 'Clarificare', en: 'Clarification' }, desc: { ro: 'Discuție scurtă pe detalii.', en: 'Short discussion on details.' } },
      { title: { ro: 'Estimare', en: 'Estimate' }, desc: { ro: 'Ofertă bugetară preliminară.', en: 'Preliminary budget offer.' } },
      { title: { ro: 'Start', en: 'Start' }, desc: { ro: 'Programare măsurători & contract.', en: 'Measurements & contract.' } }
    ]
  },
  faq: [
    { question: { ro: 'În cât timp primesc oferta?', en: 'How fast do I get the quote?' }, answer: { ro: 'Pentru proiecte standard, în 24-48h. Pentru proiecte complexe, necesită o discuție tehnică.', en: 'For standard projects, 24-48h. Complex projects need tech discussion.' } },
    { question: { ro: 'Lucrați în toată România?', en: 'Do you work across Romania?' }, answer: { ro: 'Da, pentru proiecte medii și mari asigurăm transport și montaj oriunde în țară.', en: 'Yes, for medium and large projects we provide transport and installation nationwide.' } },
    { question: { ro: 'Pot trimite doar poze fără măsurători?', en: 'Can I send just photos?' }, answer: { ro: 'Da, putem face o estimare brută pe baza pozelor, dar prețul final necesită cote exacte.', en: 'Yes, we can give a rough estimate based on photos, but final price needs exact dimensions.' } },
    { question: { ro: 'Faceți și doar debitare CNC?', en: 'Do you do just CNC cutting?' }, answer: { ro: 'Da, oferim servicii B2B de debitare și căntuire pentru arhitecți și alți producători.', en: 'Yes, we offer B2B cutting and edging services for architects and other makers.' } },
    { question: { ro: 'Cum funcționează plata?', en: 'How does payment work?' }, answer: { ro: '50% avans la semnare contract, 40% înainte de livrare, 10% la recepția finală.', en: '50% advance on contract, 40% before delivery, 10% on final handover.' } }
  ]
};

// --- 2. ABOUT SEED ---
const SEED_ABOUT: AboutPageData = {
  hero: {
    title: { ro: 'Unde precizia întâlnește arta.', en: 'Where precision meets art.' },
    subtitle: { ro: 'Mobilier premium realizat la comandă.', en: 'Premium custom-made furniture.' },
    text: { 
      ro: 'Filosofia CARVELLO se bazează pe echilibrul perfect între tehnologia CNC industrială și finisajele artizanale. Nu acceptăm compromisuri la capitolul toleranțe sau materiale.',
      en: 'The CARVELLO philosophy is based on the perfect balance between industrial CNC technology and artisanal finishes. We do not compromise on tolerances or materials.'
    },
    mediaId: null
  },
  manifesto: {
    title: { ro: 'CARVELLO nu este doar un atelier.', en: 'CARVELLO is not just a workshop.' },
    text: { 
      ro: 'Suntem un hub de execuție premium pentru proiecte rezidențiale și comerciale, unde designul, tehnicul și producția lucrează împreună sub același acoperiș.',
      en: 'We are a premium execution hub for residential and commercial projects, where design, engineering, and production work together under one roof.'
    },
    bullets: [
      { ro: 'Precizie milimetrică garantată prin CNC', en: 'Millimetric precision guaranteed by CNC' },
      { ro: 'Finisaje premium controlate în cabină proprie', en: 'Premium finishes controlled in-house' },
      { ro: 'Livrare și montaj cu echipe interne', en: 'Delivery and assembly with in-house teams' }
    ]
  },
  pillars: [
    {
      title: { ro: 'Execuție CNC Milimetrică', en: 'CNC Precision Execution' },
      desc: { ro: 'Utilaje în 5 axe pentru forme complexe.', en: '5-axis machinery for complex shapes.' },
      bullets: [
        { ro: 'Toleranță 0.1mm', en: '0.1mm Tolerance' },
        { ro: 'Găurire automată', en: 'Automatic drilling' },
        { ro: 'Nesting optimizat', en: 'Optimized nesting' }
      ]
    },
    {
      title: { ro: 'Finisaje Premium 2K', en: 'Premium 2K Finishes' },
      desc: { ro: 'Vopsitorie industrială cu control climatic.', en: 'Industrial paint shop with climate control.' },
      bullets: [
        { ro: 'Mat, Satin, Lucios', en: 'Matte, Satin, Gloss' },
        { ro: 'Rezistență la zgârieturi', en: 'Scratch resistance' },
        { ro: 'Orice cod NCS/RAL', en: 'Any NCS/RAL code' }
      ]
    },
    {
      title: { ro: 'Proiectare Tehnică', en: 'Technical Engineering' },
      desc: { ro: 'Validăm fiecare detaliu înainte de producție.', en: 'We validate every detail before production.' },
      bullets: [
        { ro: 'Randări 3D', en: '3D Renders' },
        { ro: 'Planuri de execuție', en: 'Execution plans' },
        { ro: 'Integrare instalații', en: 'Systems integration' }
      ]
    },
  ],
  quality: {
    title: { ro: 'Calitatea se construiește în fiecare etapă.', en: 'Quality is built at every stage.' },
    bullets: [
      { ro: 'Verificări riguroase înainte de ambalare', en: 'Rigorous checks before packaging' },
      { ro: 'Pre-montaj în atelier pentru structuri mari', en: 'Workshop pre-assembly for large structures' },
      { ro: 'Protecție totală a spațiului clientului', en: 'Total protection of client space' },
      { ro: 'Predare "la cheie" cu curățenie inclusă', en: 'Turnkey handover with cleaning included' }
    ],
    images: []
  },
  timeline: [
    { year: '01', title: { ro: 'Măsurători', en: 'Measurements' }, desc: { ro: 'Scanare laser a spațiului.', en: 'Laser scanning of the space.' } },
    { year: '02', title: { ro: 'Concept 3D', en: '3D Concept' }, desc: { ro: 'Vizualizare fotorealistică.', en: 'Photorealistic visualization.' } },
    { year: '03', title: { ro: 'Proiectare', en: 'Engineering' }, desc: { ro: 'Desene tehnice CAD/CAM.', en: 'CAD/CAM technical drawings.' } },
    { year: '04', title: { ro: 'Producție', en: 'Production' }, desc: { ro: 'Debit, CNC, Vopsire.', en: 'Cutting, CNC, Painting.' } },
    { year: '05', title: { ro: 'Montaj', en: 'Install' }, desc: { ro: 'Integrare finală.', en: 'Final integration.' } }
  ],
  clients: {
    resTitle: { ro: 'Rezidențial', en: 'Residential' },
    resDesc: { ro: 'Bucătării, dressinguri, băi și mobilier custom pentru apartamente și case de lux.', en: 'Kitchens, wardrobes, baths and custom furniture for luxury homes.' },
    comTitle: { ro: 'Comercial & HoReCa', en: 'Commercial & HoReCa' },
    comDesc: { ro: 'Soluții durabile și estetice pentru hoteluri, restaurante, clinici și spații de birouri.', en: 'Durable and aesthetic solutions for hotels, restaurants, clinics, and offices.' }
  },
  cta: {
    title: { ro: 'Dacă îți dorești un rezultat fără compromis, hai să discutăm.', en: 'If you want an uncompromising result, let\'s talk.' },
    trustLine: { ro: 'Termen clar • Execuție premium • Garanție extinsă', en: 'Clear deadline • Premium execution • Extended warranty' }
  }
};

// --- 3. REVIEWS SEED ---
const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    status: 'approved',
    consentPublic: true,
    rating: 5,
    text: "Colaborarea a fost impecabilă. Precizia îmbinărilor la corpurile din bucătărie este ceva ce rar găsești. Echipa de montaj a fost extrem de curată și atentă.",
    clientNameDisplay: "Adrian M.",
    city: "Cluj-Napoca",
    projectType: "Rezidențial",
    projectLabel: "Bucătărie MDF Vopsit",
    isFeatured: true,
    source: 'internal',
    createdAt: lastMonth
  },
  {
    id: 'rev-2',
    status: 'approved',
    consentPublic: true,
    rating: 5,
    text: "Am echipat recepția clinicii și sala de așteptare. Panourile CNC arată spectaculos, iar finisajul 2K este foarte rezistent la trafic. Recomand pentru proiecte comerciale.",
    clientNameDisplay: "Dr. Sorin T.",
    city: "București",
    projectType: "Comercial",
    projectLabel: "Clinică Estetică",
    isFeatured: true,
    source: 'internal',
    createdAt: lastMonth
  },
  {
    id: 'rev-3',
    status: 'approved',
    consentPublic: true,
    rating: 4,
    text: "Calitate excelentă, dar termenul a fost decalat cu 3 zile. Totuși, rezultatul final a meritat așteptarea. Dressing-ul este perfect compartimentat.",
    clientNameDisplay: "Elena R.",
    city: "Timișoara",
    projectType: "Rezidențial",
    projectLabel: "Dressing Walk-in",
    isFeatured: false,
    source: 'internal',
    createdAt: today
  },
  {
    id: 'rev-4',
    status: 'approved',
    consentPublic: true,
    rating: 5,
    text: "Ca arhitect, apreciez enorm faptul că au respectat cotele din proiect la milimetru. Nu a fost nevoie de nicio ajustare pe șantier. O execuție tehnică de top.",
    clientNameDisplay: "Arh. Radu I.",
    city: "Cluj-Napoca",
    projectType: "Rezidențial",
    projectLabel: "Fit-out Complet",
    isFeatured: true,
    source: 'internal',
    createdAt: today
  }
];

// --- 4. MEDIA SEED ---
const SEED_MEDIA: Media[] = [
  // PROJECTS
  { id: 'm1', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200', room: 'Bucătărie', stage: 'Final', stars: 5, orderInProject: 0, createdAt: today, pieceTypes: ['Insulă'], caption: null, shotDate: null },
  { id: 'm2', projectId: 'p1', kind: 'image', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200', room: 'Living', stage: 'Final', stars: 4, orderInProject: 1, createdAt: today, pieceTypes: ['Bibliotecă'], caption: null, shotDate: null },
  { id: 'm3', projectId: 'p2', kind: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', room: 'Lobby', stage: 'Final', stars: 5, orderInProject: 0, createdAt: today, pieceTypes: ['Recepție'], caption: null, shotDate: null },
  { id: 'm4', projectId: 'p3', kind: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', room: 'Living', stage: 'Final', stars: 5, orderInProject: 0, createdAt: today, pieceTypes: ['Canapea Custom'], caption: null, shotDate: null },
  // SERVICES HEROES
  { id: 's1-hero', projectId: 'svc', kind: 'image', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200', room: 'Atelier', stage: 'Execuție', stars: 0, orderInProject: 0, createdAt: today, pieceTypes: [], caption: null, shotDate: null },
  { id: 's2-hero', projectId: 'svc', kind: 'image', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200', room: 'Birou', stage: 'Proiectare', stars: 0, orderInProject: 0, createdAt: today, pieceTypes: [], caption: null, shotDate: null },
  { id: 's3-hero', projectId: 'svc', kind: 'image', url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=1200', room: 'Atelier', stage: 'Finisaj', stars: 0, orderInProject: 0, createdAt: today, pieceTypes: [], caption: null, shotDate: null },
  { id: 's4-hero', projectId: 'svc', kind: 'image', url: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=1200', room: 'Santier', stage: 'Montaj', stars: 0, orderInProject: 0, createdAt: today, pieceTypes: [], caption: null, shotDate: null },
];

// --- 5. SERVICES SEED ---
const SEED_SERVICES: ServicePage[] = [
  {
    id: 'svc-1', slug: 'mobilier-custom', order: 1, isPublished: true,
    title: { ro: 'Mobilier Custom', en: 'Custom Furniture' },
    subtitle: { ro: 'Rezidențial Premium', en: 'Premium Residential' },
    shortDescription: { ro: 'Soluții complete pentru locuințe de lux: bucătării, dressing-uri, biblioteci.', en: 'Complete solutions for luxury homes: kitchens, wardrobes, libraries.' },
    fullDescription: { ro: 'Creăm mobilier care se integrează perfect în arhitectura spațiului tău. De la bucătării ergonomice cu sisteme Blum de ultimă generație, la dressing-uri walk-in iluminate LED și placări de pereți.', en: 'We create furniture that integrates perfectly into your space architecture. From ergonomic kitchens with latest Blum systems, to LED illuminated walk-in wardrobes and wall cladding.' },
    heroMediaId: 's1-hero',
    bullets: [{ ro: 'Bucătării la comandă', en: 'Custom Kitchens' }, { ro: 'Dressing-uri Walk-in', en: 'Walk-in Wardrobes' }, { ro: 'Mobilier Baie', en: 'Bathroom Furniture' }],
    features: [
      { icon: '📐', title: { ro: 'Măsurători Laser', en: 'Laser Measurements' }, desc: { ro: 'Scanare 3D a spațiului pentru precizie absolută.', en: '3D space scanning for absolute precision.' } },
      { icon: '🎨', title: { ro: 'Finisaje Unlimited', en: 'Unlimited Finishes' }, desc: { ro: 'MDF Vopsit, Furnir, Ceramică, Sticlă.', en: 'Painted MDF, Veneer, Ceramics, Glass.' } },
      { icon: '🔧', title: { ro: 'Feronerie Top', en: 'Top Hardware' }, desc: { ro: 'Blum, Hettich, Hafele.', en: 'Blum, Hettich, Hafele.' } }
    ],
    processSteps: [
      { title: { ro: 'Consultare', en: 'Consultation' }, desc: { ro: 'Discuție inițială.', en: 'Initial talk.' } },
      { title: { ro: 'Proiectare', en: 'Design' }, desc: { ro: 'Randări și schițe.', en: 'Renders and sketches.' } },
      { title: { ro: 'Execuție', en: 'Execution' }, desc: { ro: 'Producție în fabrică.', en: 'Factory production.' } },
      { title: { ro: 'Montaj', en: 'Installation' }, desc: { ro: 'Livrare și montaj.', en: 'Delivery and install.' } }
    ],
    faq: [], relatedProjectTags: ['Rezidențial', 'Bucătărie', 'Dressing']
  },
  {
    id: 'svc-2', slug: 'debitare-cnc', order: 2, isPublished: true,
    title: { ro: 'Prelucrare CNC', en: 'CNC Milling' },
    subtitle: { ro: 'Servicii B2B', en: 'B2B Services' },
    shortDescription: { ro: 'Frezare computerizată, gravură și debitare panouri pentru arhitecți și producători.', en: 'Computerized milling, engraving and panel cutting for architects and makers.' },
    fullDescription: { ro: 'Dispunem de utilaje CNC în 5 axe capabile să execute forme organice complexe, panouri decorative 3D și piese de mobilier unicat. Oferim servicii de debitare și căntuire pentru parteneri.', en: 'We have 5-axis CNC machines capable of executing complex organic shapes, 3D decorative panels and unique furniture pieces. We offer cutting and edging services for partners.' },
    heroMediaId: 's2-hero',
    bullets: [{ ro: 'Frezare 3D', en: '3D Milling' }, { ro: 'Gravură MDF', en: 'MDF Engraving' }, { ro: 'Debitare Panouri', en: 'Panel Cutting' }],
    features: [
      { icon: '⚡', title: { ro: 'Viteză și Precizie', en: 'Speed and Precision' }, desc: { ro: 'Toleranțe de 0.1mm.', en: '0.1mm tolerances.' } },
      { icon: '🧩', title: { ro: 'Nesting Optimizat', en: 'Optimized Nesting' }, desc: { ro: 'Pierderi minime de material.', en: 'Minimal material waste.' } },
      { icon: '📦', title: { ro: 'Capacitate Mare', en: 'High Capacity' }, desc: { ro: 'Producție de serie sau unicat.', en: 'Series or unique production.' } }
    ],
    processSteps: [
      { title: { ro: 'Fișiere CAD', en: 'CAD Files' }, desc: { ro: 'Primire DXF/DWG.', en: 'Receive DXF/DWG.' } },
      { title: { ro: 'Optimizare', en: 'Optimization' }, desc: { ro: 'Pregătire G-Code.', en: 'G-Code prep.' } },
      { title: { ro: 'Frezare', en: 'Milling' }, desc: { ro: 'Execuție CNC.', en: 'CNC execution.' } },
      { title: { ro: 'Finisare', en: 'Finishing' }, desc: { ro: 'Șlefuire (opțional).', en: 'Sanding (optional).' } }
    ],
    faq: [], relatedProjectTags: ['CNC', 'Comercial', 'Panouri']
  },
  {
    id: 'svc-3', slug: 'vopsire-mdf', order: 3, isPublished: true,
    title: { ro: 'Vopsitorie 2K', en: '2K Painting' },
    subtitle: { ro: 'Finisaje Industriale', en: 'Industrial Finishes' },
    shortDescription: { ro: 'Cabină de vopsire presurizată pentru finisaje mate, satinate sau lucioase impecabile.', en: 'Pressurized painting booth for flawless matte, satin or gloss finishes.' },
    fullDescription: { ro: 'Calitatea finisajului este semnătura noastră. Folosim lacuri poliuretanice și pe bază de apă de cea mai înaltă calitate, aplicate în mediu controlat.', en: 'Finish quality is our signature. We use top quality polyurethane and water-based varnishes, applied in a controlled environment.' },
    heroMediaId: 's3-hero',
    bullets: [{ ro: 'Orice cod RAL/NCS', en: 'Any RAL/NCS code' }, { ro: 'Mat / Super-Mat', en: 'Matte / Super-Matte' }, { ro: 'High Gloss', en: 'High Gloss' }],
    features: [
      { icon: '🌬️', title: { ro: 'Mediu Controlat', en: 'Controlled Env' }, desc: { ro: 'Fără praf, temperatură constantă.', en: 'Dust-free, constant temp.' } },
      { icon: '🛡️', title: { ro: 'Rezistență', en: 'Durability' }, desc: { ro: 'Lacuri dure anti-zgârieturi.', en: 'Hard anti-scratch varnishes.' } },
      { icon: '🎨', title: { ro: 'Colorimetrie', en: 'Colorimetry' }, desc: { ro: 'Reproducere exactă a culorii.', en: 'Exact color reproduction.' } }
    ],
    processSteps: [
      { title: { ro: 'Pregătire', en: 'Prep' }, desc: { ro: 'Izolare și curățare.', en: 'Isolation and cleaning.' } },
      { title: { ro: 'Primer', en: 'Primer' }, desc: { ro: 'Aplicare strat bază.', en: 'Base layer application.' } },
      { title: { ro: 'Șlefuire', en: 'Sanding' }, desc: { ro: 'Șlefuire intermediară.', en: 'Intermediate sanding.' } },
      { title: { ro: 'Vopsea Finală', en: 'Top Coat' }, desc: { ro: 'Aplicare strat final.', en: 'Final layer application.' } }
    ],
    faq: [], relatedProjectTags: ['MDF', 'Vopsit', 'Finisaje']
  }
];

// --- 6. PROJECTS SEED ---
const SEED_PROJECTS: Project[] = [
  {
    id: 'p1', slug: 'penthouse-herastrau', title: { ro: 'Penthouse Herăstrău', en: 'Herastrau Penthouse' },
    summary: { ro: 'Amenajare completă pentru un apartament de lux, dominat de texturi naturale și finisaje mate.', en: 'Complete fit-out for a luxury apartment, dominated by natural textures and matte finishes.' },
    timelineDate: today, publishedAt: today, isPublished: true, createdAt: today, updatedAt: today,
    projectType: 'Rezidențial', location: { ro: 'București', en: 'Bucharest' }, tags: ['MDF', 'Vopsit', 'Rezidențial'], isFeatured: true,
    coverMediaId: 'm1',
    heroConfig: { mode: 'image', imageId: 'm1', overlay: { intensity: 40, vignette: true, grain: false } },
    clientBrief: { ro: 'Clientul a dorit o bucătărie minimalistă, dar extrem de funcțională, și un dressing deschis.', en: 'Client wanted a minimalist but highly functional kitchen and an open wardrobe.' },
    ourSolution: { ro: 'Am propus fronturi MDF vopsit mat cu mânere frezate și insulă placată cu ceramică.', en: 'We proposed matte painted MDF fronts with milled handles and ceramic-clad island.' },
    result: { ro: 'Un spațiu fluid, luminos, unde mobilierul devine parte din arhitectură.', en: 'A fluid, bright space where furniture becomes part of architecture.' },
    stages: [
      { id: 'st1', title: { ro: 'Proiectare', en: 'Design' }, description: { ro: 'Randări 3D și planuri tehnice.', en: '3D renders and technical plans.' }, highlights: ['Releveu Laser'], media: { galleryIds: [] } },
      { id: 'st2', title: { ro: 'Producție', en: 'Production' }, description: { ro: 'Debitare și vopsire.', en: 'Cutting and painting.' }, highlights: ['CNC Nesting'], media: { galleryIds: [] } },
      { id: 'st3', title: { ro: 'Final', en: 'Final' }, description: { ro: 'Montaj și predare.', en: 'Assembly and handover.' }, highlights: ['Recepție'], media: { galleryIds: [], coverId: 'm1' } }
    ],
    techSpecs: [{ label: 'Fronturi', value: 'MDF Vopsit NCS S 2005-Y50R' }, { label: 'Blat', value: 'Ceramică Marazzi' }, { label: 'Feronerie', value: 'Blum Legrabox' }],
    metrics: { duration: '8 Săptămâni', finish: 'Mat', materials: 'MDF, Ceramică', hardware: 'Blum', services: ['Proiectare', 'Execuție'] }
  },
  {
    id: 'p2', slug: 'clinica-estetica', title: { ro: 'Clinică Estetică', en: 'Aesthetic Clinic' },
    summary: { ro: 'Recepție și spații de tratament cu forme organice realizate la CNC.', en: 'Reception and treatment spaces with organic shapes made on CNC.' },
    timelineDate: lastMonth, publishedAt: lastMonth, isPublished: true, createdAt: lastMonth, updatedAt: lastMonth,
    projectType: 'Comercial', location: { ro: 'Cluj-Napoca', en: 'Cluj-Napoca' }, tags: ['Comercial', 'CNC', 'Corian'], isFeatured: true,
    coverMediaId: 'm3',
    heroConfig: { mode: 'image', imageId: 'm3', overlay: { intensity: 30, vignette: false, grain: false } },
    clientBrief: { ro: 'Un spațiu primitor, curat, cu elemente curbe.', en: 'A welcoming, clean space with curved elements.' },
    ourSolution: { ro: 'Recepție din Corian termoformat și placări perete frezate 3D.', en: 'Thermoformed Corian reception and 3D milled wall cladding.' },
    result: { ro: 'Un design futurist care inspiră încredere și profesionalism.', en: 'A futuristic design inspiring trust and professionalism.' },
    techSpecs: [{ label: 'Material', value: 'Corian & MDF' }, { label: 'Forme', value: 'Curbe 3D CNC' }],
    metrics: { duration: '6 Săptămâni', finish: 'Satin', materials: 'Corian', hardware: 'Hafele', services: ['CNC', 'Termoformare'] }
  },
  {
    id: 'p3', slug: 'casa-privata-brasov', title: { ro: 'Vilă Brașov', en: 'Brasov Villa' },
    summary: { ro: 'Mobilier integral pentru o reședință de vacanță, stil nordic.', en: 'Full furniture for a holiday residence, Nordic style.' },
    timelineDate: lastMonth, publishedAt: lastMonth, isPublished: true, createdAt: lastMonth, updatedAt: lastMonth,
    projectType: 'Rezidențial', location: { ro: 'Brașov', en: 'Brasov' }, tags: ['Lemn Masiv', 'Furnir', 'Rezidențial'], isFeatured: false,
    coverMediaId: 'm4',
    heroConfig: { mode: 'image', imageId: 'm4', overlay: { intensity: 50, vignette: true, grain: true } },
    clientBrief: { ro: 'Cald, natural, durabil.', en: 'Warm, natural, durable.' },
    ourSolution: { ro: 'Furnir de stejar natur și accente de metal negru.', en: 'Natural oak veneer and black metal accents.' },
    result: { ro: 'O casă de vacanță primitoare.', en: 'A welcoming holiday home.' },
    techSpecs: [{ label: 'Fronturi', value: 'Furnir Stejar' }, { label: 'Structură', value: 'PAL Egger' }],
    metrics: { duration: '10 Săptămâni', finish: 'Ulei Natural', materials: 'Furnir, Metal', hardware: 'Blum', services: ['Mobilier', 'Metal confecționat'] }
  }
];

// --- 7. PROCESS SEED ---
const SEED_PROCESS: ProcessStep[] = [
  {
    id: 'ps1', order: 1, isVisible: true, mediaId: 's2-hero',
    title: { ro: 'Consultanță & Măsurători', en: 'Consultation & Survey' },
    description: { ro: 'Primul pas este înțelegerea nevoilor tale. Venim la fața locului pentru măsurători laser de precizie și discutăm materialele, bugetul și termenele.', en: 'First step is understanding your needs. We come on site for precision laser measurements and discuss materials, budget and deadlines.' },
    bullets: [{ ro: 'Măsurători digitale', en: 'Digital measurements' }, { ro: 'Mostrare materiale', en: 'Material samples' }, { ro: 'Estimare buget', en: 'Budget estimation' }],
    cta: { label: { ro: 'Programează o vizită', en: 'Schedule a visit' }, href: '/contact' }
  },
  {
    id: 'ps2', order: 2, isVisible: true, mediaId: 's1-hero',
    title: { ro: 'Proiectare Tehnică', en: 'Technical Design' },
    description: { ro: 'Transformăm ideile în planuri de execuție. Inginerii noștri desenează fiecare corp în software CAD/CAM pentru a elimina erorile și a optimiza materialul.', en: 'We turn ideas into execution plans. Our engineers draw every cabinet in CAD/CAM software to eliminate errors and optimize material.' },
    bullets: [{ ro: 'Randări 3D', en: '3D Renders' }, { ro: 'Planuri instalații', en: 'Installation plans' }, { ro: 'Ofertă finală', en: 'Final quote' }],
    cta: { label: { ro: 'Vezi servicii', en: 'See services' }, href: '/servicii' }
  },
  {
    id: 'ps3', order: 3, isVisible: true, mediaId: 's3-hero',
    title: { ro: 'Producție & Finisare', en: 'Production & Finishing' },
    description: { ro: 'Proiectul intră în fabrică. Debitarea se face pe CNC, iar vopsirea în cabină presurizată. Totul se pre-asamblează în atelier pentru verificare.', en: 'Project goes to factory. Cutting on CNC, painting in pressurized booth. Everything is pre-assembled in workshop for check.' },
    bullets: [{ ro: 'Precizie CNC', en: 'CNC Precision' }, { ro: 'Vopsire 2K', en: '2K Painting' }, { ro: 'Pre-montaj', en: 'Pre-assembly' }],
    cta: { label: { ro: 'Tehnologia noastră', en: 'Our technology' }, href: '/despre' }
  },
  {
    id: 'ps4', order: 4, isVisible: true, mediaId: 's4-hero',
    title: { ro: 'Livrare & Montaj', en: 'Delivery & Install' },
    description: { ro: 'Echipa noastră transportă și montează mobilierul. Protejăm spațiul clientului și lăsăm totul curat ("white-glove service").', en: 'Our team transports and installs the furniture. We protect the client space and leave everything clean ("white-glove service").' },
    bullets: [{ ro: 'Transport propriu', en: 'Own transport' }, { ro: 'Aspirare finală', en: 'Final vacuuming' }, { ro: 'Reglaje fine', en: 'Fine adjustments' }],
    cta: { label: { ro: 'Cere ofertă', en: 'Get quote' }, href: '/cerere-oferta' }
  }
];

const SEED_DATA: AppDB = {
  version: DB_VERSION, // Track version
  settings: {
    id: 'global',
    maintenanceMode: true, // FORCED ON FOR ALL
    projectTypes: ['Rezidențial', 'HoReCa', 'Office', 'Comercial', 'Hotel'],
    rooms: ['Living', 'Bucătărie', 'Dormitor', 'Baie', 'Hol', 'Office', 'Lobby', 'Restaurant'],
    stages: ['Concept', 'Proiectare', 'Execuție', 'Finisaj', 'Montaj'],
    pieceTypes: ['Masă', 'Scaun', 'Dulap', 'Comodă', 'Insulă', 'Panou CNC', 'Bar', 'Recepție'],
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
    brand: {
      logoDarkUrl: BRAND_LOGO_DARK,
      logoLightUrl: BRAND_LOGO_LIGHT,
      brandName: 'CARVELLO',
      brandSlogan: 'Executat milimetric.',
      useTextLogo: true 
    },
    adminPassword: 'admin',
    hero: {
      mode: 'slider', // SLIDER ACTIVATED
      enabled: true,
      height: 'fullscreen',
      overlayStrength: 45,
      align: 'center',
      eyebrow: { ro: 'CARVELLO — Mobilier premium la comandă', en: 'CARVELLO — Premium Custom Furniture' },
      titleLine1: { ro: 'Mobilier premium la comandă.', en: 'Premium Custom Furniture.' },
      titleLine2: { ro: 'Executat milimetric.', en: 'Millimetrically Executed.' },
      subtitle: { 
        ro: 'De la concept și randare 3D, la producție CNC și montaj complet — pentru case, apartamente și spații comerciale.', 
        en: 'From concept and 3D rendering, to CNC production and full assembly — for homes, apartments, and commercial spaces.' 
      },
      microFeatures: ['3D', 'CNC', 'Vopsitorie 2K', 'Montaj In-House'],
      primaryCta: { label: { ro: 'Cere ofertă', en: 'Get Quote' }, href: '/cerere-oferta' },
      secondaryCta: { label: { ro: 'Vezi portofoliu', en: 'View Portfolio' }, href: '/portofoliu', visible: true },
      
      videoUrl: '', 
      posterUrl: '',
      muted: true,
      loop: true,
      showPlayButton: false,
      
      autoplay: true,
      interval: 6000,
      slides: [
        {
           id: 'sl1',
           imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000',
           title: { ro: 'Bucătării de Lux.', en: 'Luxury Kitchens.' },
           subtitle: { ro: 'Ergonomie perfectă și finisaje impecabile pentru inima casei tale.', en: 'Perfect ergonomics and flawless finishes for the heart of your home.' },
           primaryCta: { label: { ro: 'Vezi Galerie', en: 'View Gallery' }, href: '/galerie-mobilier' },
           secondaryCta: { label: { ro: 'Cere Ofertă', en: 'Get Quote' }, href: '/cerere-oferta' }
        },
        {
           id: 'sl2',
           imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000',
           title: { ro: 'Living & Dining.', en: 'Living & Dining.' },
           subtitle: { ro: 'Mobilier custom care transformă spațiul într-o experiență.', en: 'Custom furniture that turns space into an experience.' },
           primaryCta: { label: { ro: 'Portofoliu', en: 'Portfolio' }, href: '/portofoliu' },
           secondaryCta: { label: { ro: 'Contact', en: 'Contact' }, href: '/contact' }
        },
        {
           id: 'sl3',
           imageUrl: 'https://images.unsplash.com/photo-1551516594-56cb78394645?auto=format&fit=crop&q=80&w=2000',
           title: { ro: 'Dressing Walk-In.', en: 'Walk-In Wardrobes.' },
           subtitle: { ro: 'Organizare inteligentă într-un design spectaculos.', en: 'Smart organization in a spectacular design.' },
           primaryCta: { label: { ro: 'Detalii', en: 'Details' }, href: '/servicii' },
           secondaryCta: { label: { ro: 'Cere Ofertă', en: 'Get Quote' }, href: '/cerere-oferta' }
        },
        {
           id: 'sl4',
           imageUrl: 'https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=2000',
           title: { ro: 'Precizie CNC.', en: 'CNC Precision.' },
           subtitle: { ro: 'Tehnologie digitală pentru forme complexe și detalii arhitecturale.', en: 'Digital technology for complex shapes and architectural details.' },
           primaryCta: { label: { ro: 'Proces', en: 'Process' }, href: '/proces-garantii' },
           secondaryCta: { label: { ro: 'Expertiză', en: 'Expertise' }, href: '/servicii' }
        },
        {
           id: 'sl5',
           imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
           title: { ro: 'Spații Comerciale.', en: 'Commercial Spaces.' },
           subtitle: { ro: 'Amenajări office și HoReCa la cheie, durabile și estetice.', en: 'Turnkey office and HoReCa fit-outs, durable and aesthetic.' },
           primaryCta: { label: { ro: 'B2B', en: 'B2B' }, href: '/contact' },
           secondaryCta: { label: { ro: 'Proiecte', en: 'Projects' }, href: '/portofoliu' }
        }
      ]
    }
  },
  about: SEED_ABOUT,
  reviews: SEED_REVIEWS,
  contact: SEED_CONTACT,
  services: SEED_SERVICES,
  processSteps: SEED_PROCESS,
  projects: SEED_PROJECTS,
  media: SEED_MEDIA,
  pages: [],
  leads: []
};

class DBService {
  private db: AppDB | null = null;

  public async load(): Promise<AppDB> {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // CHECK VERSION: If code version is newer than stored data, force reset to seed
        if (!parsed.version || parsed.version < DB_VERSION) {
           console.log(`System Upgrade: ${parsed.version || 0} -> ${DB_VERSION}. Resetting local DB.`);
           this.db = { ...SEED_DATA };
           this.save();
           return this.db;
        }

        this.db = parsed;
        
        let needsSave = false;

        // Auto-fix: If primary collections are empty, re-inject seed data
        if (this.db && (!this.db.projects || this.db.projects.length === 0)) {
           this.db.projects = [...SEED_PROJECTS];
           needsSave = true;
        }
        if (this.db && (!this.db.services || this.db.services.length === 0)) {
           this.db.services = [...SEED_SERVICES];
           needsSave = true;
        }
        if (this.db && (!this.db.processSteps || this.db.processSteps.length === 0)) {
           this.db.processSteps = [...SEED_PROCESS];
           needsSave = true;
        }
        if (this.db && (!this.db.media || this.db.media.length === 0)) {
           this.db.media = [...SEED_MEDIA];
           needsSave = true;
        }
        
        // Ensure other mandatory sections exist
        if (this.db && !this.db.contact) { this.db.contact = SEED_CONTACT; needsSave = true; }
        if (this.db && !this.db.reviews) { this.db.reviews = SEED_REVIEWS; needsSave = true; }
        if (this.db && !this.db.about) { this.db.about = SEED_ABOUT; needsSave = true; }

        if (needsSave) this.save();

      } catch (e) {
        this.db = { ...SEED_DATA };
        this.save();
      }
    } else {
      this.db = { ...SEED_DATA };
      this.save();
    }
    return this.db!;
  }

  public save() {
    if (this.db) {
      localStorage.setItem(DB_KEY, JSON.stringify(this.db));
    }
  }

  // ... existing getters ...
  async getSettings(): Promise<Settings> {
    const db = await this.load();
    return db.settings;
  }
  async updateSettings(settings: Settings): Promise<void> {
    const db = await this.load();
    db.settings = settings;
    this.save();
  }
  
  async getContactData(): Promise<ContactPageData> {
    const db = await this.load();
    return db.contact;
  }
  async updateContactData(data: ContactPageData): Promise<void> {
    const db = await this.load();
    db.contact = data;
    this.save();
  }

  async getAboutData(): Promise<AboutPageData> {
    const db = await this.load();
    return db.about;
  }
  async updateAboutData(data: AboutPageData): Promise<void> {
    const db = await this.load();
    db.about = data;
    this.save();
  }

  // --- REVIEW METHODS ---
  async getReviews(): Promise<Review[]> {
    const db = await this.load();
    return db.reviews;
  }
  async upsertReview(review: Review): Promise<void> {
    const db = await this.load();
    const idx = db.reviews.findIndex(r => r.id === review.id);
    if (idx >= 0) db.reviews[idx] = review;
    else db.reviews.unshift(review);
    this.save();
  }
  async deleteReview(id: string): Promise<void> {
    const db = await this.load();
    db.reviews = db.reviews.filter(r => r.id !== id);
    this.save();
  }

  // ... (Projects, Media, Pages, Leads, Services, Process methods) ...
  async getProjects(): Promise<Project[]> { const db = await this.load(); return db.projects; }
  async getProject(id: string): Promise<Project | undefined> { const db = await this.load(); return db.projects.find(p => p.id === id); }
  async getProjectBySlug(slug: string): Promise<Project | undefined> { const db = await this.load(); return db.projects.find(p => p.slug === slug || p.id === slug); }
  async upsertProject(project: Project): Promise<void> { const db = await this.load(); const idx = db.projects.findIndex(p => p.id === project.id); if (idx >= 0) db.projects[idx] = project; else db.projects.push(project); this.save(); }
  async deleteProject(id: string): Promise<void> { const db = await this.load(); db.projects = db.projects.filter(p => p.id !== id); db.media = db.media.filter(m => m.projectId !== id); this.save(); }
  async getMedia(projectId?: string): Promise<Media[]> { const db = await this.load(); if (projectId) return db.media.filter(m => m.projectId === projectId); return db.media; }
  async getMediaById(id: string): Promise<Media | undefined> { const db = await this.load(); return db.media.find(m => m.id === id); }
  async upsertMedia(media: Media): Promise<void> { const db = await this.load(); const idx = db.media.findIndex(m => m.id === media.id); if (idx >= 0) db.media[idx] = media; else db.media.push(media); this.save(); }
  async deleteMedia(id: string): Promise<void> { const db = await this.load(); db.media = db.media.filter(m => m.id !== id); this.save(); }
  async getPages(): Promise<Page[]> { const db = await this.load(); return db.pages; }
  async getPageBySlug(slug: string): Promise<Page | undefined> { const db = await this.load(); return db.pages.find(p => p.slug === slug); }
  async upsertPage(page: Page): Promise<void> { const db = await this.load(); const idx = db.pages.findIndex(p => p.id === page.id); if (idx >= 0) db.pages[idx] = page; else db.pages.push(page); this.save(); }
  async deletePage(id: string): Promise<void> { const db = await this.load(); db.pages = db.pages.filter(p => p.id !== id); this.save(); }
  async getLeads(): Promise<Lead[]> { const db = await this.load(); return db.leads; }
  async addLead(lead: Lead): Promise<void> { const db = await this.load(); db.leads.unshift(lead); this.save(); }
  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> { const db = await this.load(); const lead = db.leads.find(l => l.id === id); if (lead) { lead.status = status; this.save(); } }
  async getServices(): Promise<ServicePage[]> { const db = await this.load(); return db.services.sort((a,b) => a.order - b.order); }
  async getServiceBySlug(slug: string): Promise<ServicePage | undefined> { const db = await this.load(); return db.services.find(s => s.slug === slug); }
  async upsertService(service: ServicePage): Promise<void> { const db = await this.load(); const idx = db.services.findIndex(s => s.id === service.id); if (idx >= 0) db.services[idx] = service; else db.services.push(service); this.save(); }
  async deleteService(id: string): Promise<void> { const db = await this.load(); db.services = db.services.filter(s => s.id !== id); this.save(); }
  async getProcessSteps(): Promise<ProcessStep[]> { const db = await this.load(); return db.processSteps.sort((a,b) => a.order - b.order); }
  async upsertProcessStep(step: ProcessStep): Promise<void> { const db = await this.load(); const idx = db.processSteps.findIndex(s => s.id === step.id); if (idx >= 0) db.processSteps[idx] = step; else db.processSteps.push(step); this.save(); }

  async exportDB(): Promise<string> {
    const db = await this.load();
    return JSON.stringify(db, null, 2);
  }
  async importDB(json: string): Promise<void> {
    const newDb = JSON.parse(json);
    this.db = newDb;
    this.save();
  }
  async resetToSeed(): Promise<void> {
    localStorage.removeItem(DB_KEY);
    this.db = { ...SEED_DATA };
    this.save();
  }
}

export const dbService = new DBService();