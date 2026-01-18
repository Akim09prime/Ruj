
import { AppDB, Settings, Project, Media, Page, Lead, ServicePage } from '../types';

const DB_KEY = 'carvello_db';

const BRAND_LOGO_DARK = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 
const BRAND_LOGO_LIGHT = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 

// Helper dates
const today = new Date().toISOString();
const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

const SEED_DATA: AppDB = {
  settings: {
    id: 'global',
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
      contact: { address: 'Strada Industriei Nr. 10, Cluj-Napoca', email: 'office@carvello.ro', phone: '+40 700 000 000' },
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
      mode: 'video',
      enabled: true,
      height: 'fullscreen',
      overlayStrength: 65,
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
      
      videoUrl: 'https://player.vimeo.com/external/494252666.sd.mp4?s=265c0293774618772023026742510167c645d944&profile_id=165&oauth2_token_id=57447761', 
      posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400',
      muted: true,
      loop: true,
      showPlayButton: false,
      
      autoplay: true,
      interval: 4500,
      slides: []
    }
  },
  services: [
    {
      id: 'custom-furniture',
      slug: 'mobilier-la-comanda',
      order: 1,
      isPublished: true,
      title: { ro: 'Mobilier la Comandă', en: 'Custom Furniture' },
      subtitle: { ro: 'Rezidențial & HoReCa', en: 'Residential & HoReCa' },
      shortDescription: { 
        ro: 'Mobilier premium realizat pe comandă, adaptat perfect spațiului tău — de la bucătării și dressinguri până la proiecte comerciale complete.', 
        en: 'Premium custom-made furniture, perfectly adapted to your space — from kitchens and walk-in closets to complete commercial projects.' 
      },
      fullDescription: {
        ro: 'Creăm mobilier care redefinește spațiile. Fie că este vorba de o reședință privată sau un spațiu HoReCa, abordarea noastră integrează ergonomia, estetica și funcționalitatea absolută.',
        en: 'We create furniture that redefines spaces. Whether it represents a private residence or a HoReCa space, our approach integrates ergonomics, aesthetics, and absolute functionality.'
      },
      heroMediaId: 'm-azure-hero',
      bullets: [
        { ro: 'Proiectare + măsurători precise', en: 'Design + precise measurements' },
        { ro: 'Materiale premium (MDF vopsit, Furnir, Ceramică)', en: 'Premium materials (Painted MDF, Veneer, Ceramics)' },
        { ro: 'Executat milimetric, pregătit pentru montaj', en: 'Millimetrically executed, ready for assembly' },
        { ro: 'Soluții ascunse + ergonomie modernă', en: 'Hidden solutions + modern ergonomics' }
      ],
      features: [
        { title: { ro: 'Adaptabilitate Totală', en: 'Total Adaptability' }, desc: { ro: 'Orice dimensiune, orice formă, orice material.', en: 'Any size, any shape, any material.' }, icon: '📐' },
        { title: { ro: 'Hardware Blum/Hettich', en: 'Blum/Hettich Hardware' }, desc: { ro: 'Sisteme de glisare și ridicare de top.', en: 'Top-tier sliding and lifting systems.' }, icon: '🔩' },
        { title: { ro: 'Iluminare Integrată', en: 'Integrated Lighting' }, desc: { ro: 'Senzori și benzi LED încastrate.', en: 'Recessed LED strips and sensors.' }, icon: '💡' }
      ],
      processSteps: [
        { title: { ro: 'Consultanță', en: 'Consultation' }, desc: { ro: 'Discuție inițială și releu foto.', en: 'Initial discussion and photo survey.' } },
        { title: { ro: 'Concept & 3D', en: 'Concept & 3D' }, desc: { ro: 'Propuneri vizuale fotorealiste.', en: 'Photorealistic visual proposals.' } },
        { title: { ro: 'Producție', en: 'Production' }, desc: { ro: 'Debitare, frezare și asamblare în atelier.', en: 'Cutting, milling, and assembly in workshop.' } },
        { title: { ro: 'Montaj', en: 'Installation' }, desc: { ro: 'Instalare finală la cheie.', en: 'Final turnkey installation.' } }
      ],
      faq: [
        { question: { ro: 'Cât durează execuția?', en: 'How long does execution take?' }, answer: { ro: 'Între 4 și 8 săptămâni, în funcție de complexitate.', en: 'Between 4 and 8 weeks, depending on complexity.' } },
        { question: { ro: 'Oferiți garanție?', en: 'Do you offer warranty?' }, answer: { ro: 'Da, oferim 24 luni garanție pentru structură și finisaje.', en: 'Yes, we offer 24 months warranty for structure and finishes.' } }
      ],
      relatedProjectTags: ['MDF Vopsit', 'Bucătărie', 'Dressing', 'Rezidențial', 'Comercial']
    },
    {
      id: 'cnc',
      slug: 'servicii-cnc-precizie',
      order: 2,
      isPublished: true,
      title: { ro: 'Servicii CNC Precizie', en: 'CNC Precision Services' },
      subtitle: { ro: 'Tehnologie Industrială', en: 'Industrial Technology' },
      shortDescription: { 
        ro: 'Frezare și găurire CNC cu toleranță controlată. Ideal pentru arhitecți și producători care externalizează producția.', 
        en: 'CNC milling and drilling with controlled tolerance. Ideal for architects and manufacturers outsourcing production.' 
      },
      fullDescription: {
        ro: 'Utilizăm centre de prelucrare CNC în 3 și 5 axe pentru a realiza repere complexe, panouri decorative și structuri precise. Tehnologia nesting ne permite optimizarea materialului la peste 95%.',
        en: 'We use 3 and 5-axis CNC machining centers to create complex parts, decorative panels, and precise structures. Nesting technology allows us to optimize material usage to over 95%.'
      },
      heroMediaId: 'm-azure-s2-1',
      bullets: [
        { ro: 'Toleranță până la 0.1mm', en: 'Tolerance up to 0.1mm' },
        { ro: 'Găurire automată + canturi curate', en: 'Automatic drilling + clean edges' },
        { ro: 'Nesting optimizat (pierderi minime)', en: 'Optimized nesting (minimal waste)' },
        { ro: 'Perfect pentru producție serie mică', en: 'Perfect for small batch production' }
      ],
      features: [
        { title: { ro: 'Nesting Software', en: 'Nesting Software' }, desc: { ro: 'Optimizare automată a tăierilor.', en: 'Automatic cut optimization.' }, icon: '💻' },
        { title: { ro: 'Frezare 3D', en: '3D Milling' }, desc: { ro: 'Forme organice și texturi complexe.', en: 'Organic shapes and complex textures.' }, icon: '🌀' },
        { title: { ro: 'Capacitate Mare', en: 'High Capacity' }, desc: { ro: 'Producție rapidă pentru volume mari.', en: 'Fast production for large volumes.' }, icon: '🏭' }
      ],
      processSteps: [
        { title: { ro: 'Fișiere CAD', en: 'CAD Files' }, desc: { ro: 'Primire DXF/DWG sau proiectare internă.', en: 'Receive DXF/DWG or internal design.' } },
        { title: { ro: 'Simulare', en: 'Simulation' }, desc: { ro: 'Verificare trasee scule și coliziuni.', en: 'Check toolpaths and collisions.' } },
        { title: { ro: 'Prelucrare', en: 'Machining' }, desc: { ro: 'Execuție pe utilaj CNC.', en: 'Execution on CNC machine.' } },
        { title: { ro: 'Control Calitate', en: 'QC' }, desc: { ro: 'Verificare dimensiuni și bavuri.', en: 'Check dimensions and burrs.' } }
      ],
      faq: [
        { question: { ro: 'Ce materiale prelucrați?', en: 'What materials do you machine?' }, answer: { ro: 'MDF, PAL, Placaj, Lemn Masiv, Corian, HPL.', en: 'MDF, Chipboard, Plywood, Solid Wood, Corian, HPL.' } }
      ],
      relatedProjectTags: ['CNC', 'CNC Custom', 'Frezare 3D', 'Panotări']
    },
    {
      id: 'finishing',
      slug: 'vopsitorie-2k-finisaje',
      order: 3,
      isPublished: true,
      title: { ro: 'Vopsitorie 2K & Finisaje', en: '2K Painting & Finishing' },
      subtitle: { ro: 'Calitate Automotivă', en: 'Automotive Quality' },
      shortDescription: { 
        ro: 'Finisaje poliuretanice premium — de la super-mat soft-touch până la high-gloss perfect uniform.', 
        en: 'Premium polyurethane finishes — from super-matte soft-touch to perfectly uniform high-gloss.' 
      },
      fullDescription: {
        ro: 'Atelierul nostru de vopsitorie dispune de cabină presurizată cu control al umidității și temperaturii. Aplicăm lacuri și vopseluri poliuretanice, acrilice sau pe bază de apă la standarde industriale.',
        en: 'Our paint shop features a pressurized booth with humidity and temperature control. We apply polyurethane, acrylic, or water-based varnishes and paints to industrial standards.'
      },
      heroMediaId: 'm-azure-s2-2',
      bullets: [
        { ro: 'Rezistență chimică + zgârieturi', en: 'Chemical + scratch resistance' },
        { ro: 'Potrivire nuanțe (RAL / NCS / Pantone)', en: 'Color matching (RAL / NCS / Pantone)' },
        { ro: 'Cabină presurizată, rezultat uniform', en: 'Pressurized booth, uniform result' },
        { ro: 'Finisaje speciale (metalic, texturat)', en: 'Special finishes (metallic, textured)' }
      ],
      features: [
        { title: { ro: 'Cabină Presurizată', en: 'Pressurized Booth' }, desc: { ro: 'Zero praf, zero imperfecțiuni.', en: 'Zero dust, zero imperfections.' }, icon: '🌪️' },
        { title: { ro: 'Colorimetrie', en: 'Colorimetry' }, desc: { ro: 'Orice nuanță din paletarele internaționale.', en: 'Any shade from international palettes.' }, icon: '🎨' },
        { title: { ro: 'Efecte Speciale', en: 'Special Effects' }, desc: { ro: 'Metalizat, perlat, beton aparent.', en: 'Metallic, pearlescent, concrete look.' }, icon: '✨' }
      ],
      processSteps: [
        { title: { ro: 'Pregătire', en: 'Prep' }, desc: { ro: 'Șlefuire și aplicare izolator.', en: 'Sanding and insulator application.' } },
        { title: { ro: 'Grunduire', en: 'Priming' }, desc: { ro: 'Aplicare 2 straturi grund.', en: 'Applying 2 coats of primer.' } },
        { title: { ro: 'Vopsire Finală', en: 'Final Painting' }, desc: { ro: 'Aplicare email colorat.', en: 'Applying colored enamel.' } },
        { title: { ro: 'Uscare & Polish', en: 'Drying & Polish' }, desc: { ro: 'Uscare controlată și polișare (pt lucios).', en: 'Controlled drying and polishing (for gloss).' } }
      ],
      faq: [
        { question: { ro: 'Vopsiți și fronturi vechi?', en: 'Do you paint old fronts?' }, answer: { ro: 'Doar dacă starea lor permite o refacere de calitate.', en: 'Only if their condition allows for a quality restoration.' } }
      ],
      relatedProjectTags: ['Vopsit 2K', 'MDF Vopsit', 'Black Matte', 'Vopsit Alb Mat', 'Lac Mat Open Pore']
    },
    {
      id: 'design',
      slug: 'proiectare-tehnica-3d',
      order: 4,
      isPublished: true,
      title: { ro: 'Proiectare Tehnică 3D', en: 'Technical 3D Design' },
      subtitle: { ro: 'De la Concept la Producție', en: 'From Concept to Production' },
      shortDescription: { 
        ro: 'Randări fotorealiste pentru vizualizare și fișiere tehnice CAD/CAM pregătite direct pentru producție.', 
        en: 'Photorealistic renderings for visualization and CAD/CAM technical files ready for production.' 
      },
      fullDescription: {
        ro: 'Transformăm orice schiță de mână într-un model digital complet. Generăm liste de debitare, fișiere CNC și planuri de montaj detaliate pentru a elimina orice eroare înainte de a tăia prima placă.',
        en: 'We transform any hand sketch into a complete digital model. We generate cutting lists, CNC files, and detailed assembly plans to eliminate any error before cutting the first board.'
      },
      heroMediaId: 'm-azure-s1-2',
      bullets: [
        { ro: 'Randări 3D fotorealiste', en: 'Photorealistic 3D renderings' },
        { ro: 'Planuri tehnice + cote exacte', en: 'Technical plans + exact dimensions' },
        { ro: 'Optimizare costuri înainte de execuție', en: 'Cost optimization before execution' },
        { ro: 'Eliminăm erori de producție', en: 'We eliminate production errors' }
      ],
      features: [
        { title: { ro: 'Software BIM', en: 'BIM Software' }, desc: { ro: 'Parametrizare completă.', en: 'Full parameterization.' }, icon: '🖥️' },
        { title: { ro: 'Randare 4K', en: '4K Rendering' }, desc: { ro: 'Vizualizare hiper-realistă.', en: 'Hyper-realistic visualization.' }, icon: '👁️' },
        { title: { ro: 'BOM Automat', en: 'Auto BOM' }, desc: { ro: 'Listă de materiale generată automat.', en: 'Automatically generated Bill of Materials.' }, icon: '📋' }
      ],
      processSteps: [
        { title: { ro: 'Brief', en: 'Brief' }, desc: { ro: 'Înțelegerea nevoilor clientului.', en: 'Understanding client needs.' } },
        { title: { ro: 'Modelare', en: 'Modeling' }, desc: { ro: 'Construcția spațiului 3D.', en: 'Building the 3D space.' } },
        { title: { ro: 'Randare', en: 'Rendering' }, desc: { ro: 'Aplicare texturi și lumini.', en: 'Applying textures and lights.' } },
        { title: { ro: 'Planuri Tehnice', en: 'Tech Plans' }, desc: { ro: 'Export cote și detalii.', en: 'Export dimensions and details.' } }
      ],
      faq: [],
      relatedProjectTags: ['Design', 'Proiectare', 'Proiectare 3D', 'Design Parametric']
    },
    {
      id: 'assembly',
      slug: 'montaj-integrare',
      order: 5,
      isPublished: true,
      title: { ro: 'Montaj & Integrare', en: 'Assembly & Integration' },
      subtitle: { ro: 'Serviciu White-Glove', en: 'White-Glove Service' },
      shortDescription: { 
        ro: 'Montaj profesionist și integrare perfectă în spațiu. Echipa noastră se asigură că aliniamentul este perfect.', 
        en: 'Professional assembly and perfect integration into the space. Our team ensures perfect alignment.' 
      },
      fullDescription: {
        ro: 'Ultimul pas este cel mai important. Echipele noastre proprii de montaj sunt echipate cu scule Festool de ultimă generație și aspiratoare profesionale pentru a asigura un montaj curat, rapid și silențios.',
        en: 'The last step is the most important. Our in-house assembly teams are equipped with state-of-the-art Festool tools and professional vacuums to ensure a clean, fast, and quiet installation.'
      },
      heroMediaId: 'm-azure-s3-1',
      bullets: [
        { ro: 'Protecție pardoseală și pereți', en: 'Floor and wall protection' },
        { ro: 'Aliniere perfectă & reglaje fine', en: 'Perfect alignment & fine adjustments' },
        { ro: 'Integrare electrocasnice', en: 'Appliance integration' },
        { ro: 'Predare la cheie', en: 'Turnkey handover' }
      ],
      features: [
        { title: { ro: 'Echipă Proprie', en: 'In-House Team' }, desc: { ro: 'Fără subcontractori.', en: 'No subcontractors.' }, icon: '👷' },
        { title: { ro: 'Curățenie', en: 'Cleanliness' }, desc: { ro: 'Aspirăm tot praful generat.', en: 'We vacuum all generated dust.' }, icon: '🧹' },
        { title: { ro: 'Reglaj Fin', en: 'Fine Tuning' }, desc: { ro: 'Aliniere fronturi la milimetru.', en: 'Millimetric front alignment.' }, icon: '📏' }
      ],
      processSteps: [
        { title: { ro: 'Pregătire', en: 'Prep' }, desc: { ro: 'Protejare zonă de lucru.', en: 'Protecting work area.' } },
        { title: { ro: 'Asamblare', en: 'Assembly' }, desc: { ro: 'Montaj corpuri și structuri.', en: 'Assembling cabinets and structures.' } },
        { title: { ro: 'Topuri & Electro', en: 'Tops & Appliances' }, desc: { ro: 'Montaj blaturi și aparatură.', en: 'Installing tops and appliances.' } },
        { title: { ro: 'Recepție', en: 'Handover' }, desc: { ro: 'Verificare finală cu clientul.', en: 'Final check with client.' } }
      ],
      faq: [],
      relatedProjectTags: ['Montaj', 'Fit-out', 'Organizare']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      slug: 'villa-azure',
      title: { ro: 'Villa Azure', en: 'Villa Azure' },
      summary: { ro: 'Amenajare completă bucătărie și dressing cu accente de bronz și piatră naturală.', en: 'Complete kitchen and dressing layout with bronze accents and natural stone.' },
      timelineDate: '2023-08-20',
      projectType: 'Rezidențial',
      location: { ro: 'Brașov, RO', en: 'Brasov, RO' },
      tags: ['MDF Vopsit', 'Piatră', 'LED', 'Dressing'],
      isFeatured: true,
      publishedAt: today,
      coverMediaId: 'm-azure-1',
      isPublished: true,
      createdAt: today,
      updatedAt: today,
      metrics: {
        duration: "60 Zile",
        finish: "Vopsit Satinat",
        materials: "MDF + Metal + Piatră",
        hardware: "Häfele",
        services: ["Design", "Producție", "Montaj"]
      },
      heroConfig: {
        mode: 'image',
        imageId: 'm-azure-hero',
        overlay: { intensity: 40, vignette: true, grain: true }
      },
      stages: [
        {
          id: 's1',
          title: { ro: 'Măsurători & Scanare', en: 'Scan & Measure' },
          subtitle: { ro: 'Ziua 1', en: 'Day 1' },
          dateLabel: 'Săptămâna 1',
          description: { ro: 'Am preluat spațiul la roșu și am efectuat o scanare laser 3D pentru a identifica imperfecțiunile pereților.', en: '3D Laser scanning of the site.' },
          highlights: ['Scanare Leica', 'Releu Digital', 'Toleranță 1mm'],
          media: { coverId: 'm-azure-s1-1', galleryIds: ['m-azure-s1-1', 'm-azure-s1-2'] }
        },
        {
          id: 's2',
          title: { ro: 'Producție CNC', en: 'CNC Production' },
          subtitle: { ro: 'Ziua 15-25', en: 'Day 15-25' },
          dateLabel: 'Săptămâna 3',
          description: { ro: 'Frezarea parametrică a panourilor frontale și pregătirea structurilor interne.', en: 'Parametric milling.' },
          highlights: ['Nesting Optimizat', 'MDF Hidrofugat'],
          media: { coverId: 'm-azure-s2-1', galleryIds: ['m-azure-s2-1', 'm-azure-s2-2'] }
        },
        {
          id: 's3',
          title: { ro: 'Montaj & Finalizare', en: 'Install & Finish' },
          subtitle: { ro: 'Ziua 55-60', en: 'Day 55-60' },
          dateLabel: 'Săptămâna 6',
          description: { ro: 'Asamblarea finală la client, reglajul fronturilor și integrarea electrocasnicelor.', en: 'Final assembly and adjustments.' },
          highlights: ['Echipă Internă', 'Curățenie Finală'],
          media: { coverId: 'm-azure-s3-1', galleryIds: ['m-azure-s3-1', 'm-azure-1'] }
        }
      ],
      techSpecs: [
        { label: "Fronturi", value: "MDF 22mm Vopsit 2K NCS S 2005-Y50R" },
        { label: "Structură", value: "PAL Egger W1000 ST9" },
        { label: "Feronerie", value: "Blum Legrabox + ServoDrive" },
        { label: "Blat", value: "Piatră Naturală (Marmură)" },
        { label: "Iluminat", value: "Loox LED 3000K, profil îngropat" }
      ],
      clientBrief: { ro: "Clientul a dorit o bucătărie care să ascundă complet funcționalitatea în spatele unui design sculptural.", en: "The client wanted a kitchen that completely hid functionality behind a sculptural design." },
      ourSolution: { ro: "Am utilizat sisteme pocket doors pentru zona de electrocasnice mici și fronturi frezate CNC pentru a crea textură și adâncime.", en: "We used pocket door systems for small appliances and CNC milled fronts to create texture and depth." },
      result: { ro: "O bucătărie care pare un monolit de piatră și lemn, complet funcțională și ergonomică.", en: "A kitchen that looks like a monolith of stone and wood, fully functional and ergonomic." }
    },
    {
      id: 'proj-2',
      slug: 'penthouse-obsidian',
      title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
      summary: { ro: 'Un proiect minimalist definit prin linii drepte și finisaj 2K negru mat profund.', en: 'Minimalist project defined by straight lines and deep matte black 2K finish.' },
      timelineDate: '2024-03-15',
      projectType: 'Rezidențial',
      location: { ro: 'București, RO', en: 'Bucharest, RO' },
      tags: ['Minimalist', 'Black Matte', 'Filomuro'],
      isFeatured: true,
      publishedAt: today,
      coverMediaId: 'm-obsidian-1',
      isPublished: true,
      createdAt: today,
      updatedAt: today,
      metrics: {
        duration: "45 Zile",
        finish: "MDF Vopsit 2K Mat",
        materials: "MDF + Sticlă Fumurie",
        hardware: "Blum Legrabox",
        services: ["Proiectare 3D", "CNC", "Finisaj", "Montaj"]
      },
      heroConfig: {
        mode: 'image',
        imageId: 'm-obsidian-1',
        overlay: { intensity: 50, vignette: true, grain: false }
      },
      stages: [],
      techSpecs: [
        { label: "Materiale", value: "MDF Vopsit Mat, Sticlă Fumurie" },
        { label: "Feronerie", value: "Blum Onyx" }
      ]
    },
    {
      id: 'proj-3',
      slug: 'showroom-automobilistic',
      title: { ro: 'Showroom Automobilistic', en: 'Automotive Showroom' },
      summary: { ro: 'Panotări CNC complexe și birouri recepție pentru un spațiu expozițional de lux.', en: 'Complex CNC wall panels and reception desks for a luxury showroom.' },
      timelineDate: '2023-11-10',
      projectType: 'Comercial',
      location: { ro: 'Cluj-Napoca, RO', en: 'Cluj-Napoca, RO' },
      tags: ['Comercial', 'CNC', 'Recepție', 'Panotări'],
      isFeatured: false,
      publishedAt: lastMonth,
      coverMediaId: 'm-showroom-1',
      isPublished: true,
      createdAt: lastMonth,
      updatedAt: lastMonth,
      metrics: {
        duration: "30 Zile",
        finish: "Furnir Natural",
        materials: "Placaj Mesteacăn",
        hardware: "Heavy Duty",
        services: ["Design Parametric", "CNC"]
      },
      heroConfig: {
        mode: 'image',
        imageId: 'm-showroom-hero',
        overlay: { intensity: 30, vignette: true, grain: false }
      },
      techSpecs: [
        { label: "Panouri", value: "MDF 18mm Frezat CNC Model Valuri" },
        { label: "Recepție", value: "Corian Glacier White termoformat" }
      ]
    },
    {
      id: 'proj-4',
      slug: 'bucatarie-sculpted-light',
      title: { ro: 'Bucătărie Sculpted Light', en: 'Sculpted Light Kitchen' },
      summary: { ro: 'Jocuri de lumină și umbră pe fronturi frezate custom, într-o reședință privată.', en: 'Play of light and shadow on custom milled fronts in a private residence.' },
      timelineDate: '2023-10-05',
      projectType: 'Rezidențial',
      location: { ro: 'Timișoara, RO', en: 'Timisoara, RO' },
      tags: ['Bucătărie', 'CNC Custom', 'Vopsit 2K'],
      isFeatured: true,
      publishedAt: lastMonth,
      coverMediaId: 'm-sculpted-1',
      isPublished: true,
      createdAt: lastMonth,
      updatedAt: lastMonth,
      metrics: {
        duration: "50 Zile",
        finish: "Vopsit Alb Mat",
        materials: "MDF 25mm",
        hardware: "Blum Movento",
        services: ["Proiectare", "Frezare 3D"]
      },
      heroConfig: {
        mode: 'image',
        imageId: 'm-sculpted-hero',
        overlay: { intensity: 20, vignette: false, grain: true }
      },
      techSpecs: [
        { label: "Fronturi", value: "MDF 25mm Frezare 3D 'Dune'" },
        { label: "Blat", value: "Compozit Cuarț 20mm" }
      ]
    },
    {
      id: 'proj-5',
      slug: 'hotel-lobby-noir',
      title: { ro: 'Hotel Lobby Noir', en: 'Hotel Lobby Noir' },
      summary: { ro: 'Mobilier recepție și bar pentru un boutique hotel, marcat de eleganță sobră.', en: 'Reception furniture and bar for a boutique hotel, marked by sober elegance.' },
      timelineDate: '2023-09-15',
      projectType: 'Hotel',
      location: { ro: 'Sibiu, RO', en: 'Sibiu, RO' },
      tags: ['Hotel', 'Bar', 'Recepție', 'Lemn Masiv'],
      isFeatured: false,
      publishedAt: twoMonthsAgo,
      coverMediaId: 'm-lobby-1',
      isPublished: true,
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      metrics: {
        duration: "40 Zile",
        finish: "Baiț Negru + Lac PU",
        materials: "Stejar Masiv",
        hardware: "Hettich",
        services: ["Execuție", "Montaj"]
      },
      heroConfig: { mode: 'image', imageId: 'm-lobby-1', overlay: { intensity: 60, vignette: true, grain: true } },
      techSpecs: [{ label: "Bar", value: "Structură Metalică + Stejar" }]
    },
    {
      id: 'proj-6',
      slug: 'restaurant-ember-oak',
      title: { ro: 'Restaurant Ember Oak', en: 'Ember Oak Restaurant' },
      summary: { ro: 'Mese și banchete custom din stejar ars și piele naturală.', en: 'Custom tables and banquettes made of burnt oak and natural leather.' },
      timelineDate: '2023-07-20',
      projectType: 'Restaurant',
      location: { ro: 'Oradea, RO', en: 'Oradea, RO' },
      tags: ['Restaurant', 'HoReCa', 'Stejar'],
      isFeatured: false,
      publishedAt: twoMonthsAgo,
      coverMediaId: 'm-ember-1',
      isPublished: true,
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      metrics: { duration: "35 Zile", finish: "Ulei Natural", materials: "Stejar", hardware: "-", services: ["Productie Serie"] },
      techSpecs: [{ label: "Blaturi", value: "Stejar 40mm Rustic" }]
    },
    {
      id: 'proj-7',
      slug: 'office-executive-walnut',
      title: { ro: 'Office Executive Walnut', en: 'Office Executive Walnut' },
      summary: { ro: 'Birouri executive și săli de consiliu placate cu nuc american.', en: 'Executive offices and boardrooms paneled in American walnut.' },
      timelineDate: '2023-06-10',
      projectType: 'Office',
      location: { ro: 'București, RO', en: 'Bucharest, RO' },
      tags: ['Office', 'Nuc American', 'Corporate'],
      isFeatured: true,
      publishedAt: twoMonthsAgo,
      coverMediaId: 'm-office-1',
      isPublished: true,
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      metrics: { duration: "55 Zile", finish: "Lac Mat Open Pore", materials: "Furnir Nuc", hardware: "Blum", services: ["Fit-out"] },
      techSpecs: [{ label: "Placări", value: "PAL Furniruit Nuc American" }]
    },
    {
      id: 'proj-8',
      slug: 'dressing-atelier',
      title: { ro: 'Dressing Atelier', en: 'Atelier Walk-in Closet' },
      summary: { ro: 'Sistem walk-in closet deschis, cu insulă centrală pentru accesorii și iluminare integrată.', en: 'Open walk-in closet system with central island for accessories and integrated lighting.' },
      timelineDate: '2023-05-05',
      projectType: 'Rezidențial',
      location: { ro: 'Iași, RO', en: 'Iasi, RO' },
      tags: ['Dressing', 'Organizare', 'Premium'],
      isFeatured: false,
      publishedAt: twoMonthsAgo,
      coverMediaId: 'm-dressing-1',
      isPublished: true,
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      metrics: { duration: "30 Zile", finish: "Melaminat Premium", materials: "Egger", hardware: "Hafele", services: ["Proiectare", "Montaj"] },
      techSpecs: [{ label: "Structură", value: "PAL Egger U963 ST9" }]
    }
  ],
  media: [
    // Hero & Covers
    { id: 'm-azure-hero', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000', room: 'Bucătărie', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Hero Azure', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-azure-1', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', room: 'Bucătărie', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Vedere Generală', en: '' }, shotDate: today, orderInProject: 1, createdAt: today },
    { id: 'm-obsidian-1', projectId: 'proj-2', kind: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', room: 'Living', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Living Dark', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-showroom-1', projectId: 'proj-3', kind: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', room: 'Office', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Showroom', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-showroom-hero', projectId: 'proj-3', kind: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000', room: 'Office', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Hero Showroom', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-sculpted-1', projectId: 'proj-4', kind: 'image', url: 'https://images.unsplash.com/photo-1556911223-e4524336297c?auto=format&fit=crop&q=80&w=1200', room: 'Bucătărie', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: 'Sculpted Fronts', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-sculpted-hero', projectId: 'proj-4', kind: 'image', url: 'https://images.unsplash.com/photo-1556911223-e4524336297c?auto=format&fit=crop&q=80&w=2000', room: 'Bucătărie', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: '', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-lobby-1', projectId: 'proj-5', kind: 'image', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200', room: 'Lobby', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: '', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-ember-1', projectId: 'proj-6', kind: 'image', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200', room: 'Restaurant', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: '', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-office-1', projectId: 'proj-7', kind: 'image', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200', room: 'Office', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: '', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    { id: 'm-dressing-1', projectId: 'proj-8', kind: 'image', url: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=1200', room: 'Dressing', stage: 'Final', pieceTypes: [], stars: 5, caption: { ro: '', en: '' }, shotDate: today, orderInProject: 0, createdAt: today },
    
    // Azure Stages
    { id: 'm-azure-s1-1', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800', room: 'Bucătărie', stage: 'Proiectare', pieceTypes: [], stars: 0, caption: { ro: 'Scanare', en: '' }, shotDate: today, orderInProject: 2, createdAt: today },
    { id: 'm-azure-s1-2', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800', room: 'Bucătărie', stage: 'Proiectare', pieceTypes: [], stars: 0, caption: { ro: 'Draft', en: '' }, shotDate: today, orderInProject: 3, createdAt: today },
    { id: 'm-azure-s2-1', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800', room: 'Atelier', stage: 'Execuție', pieceTypes: [], stars: 0, caption: { ro: 'CNC Detail', en: '' }, shotDate: today, orderInProject: 4, createdAt: today },
    { id: 'm-azure-s2-2', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1620613909778-83ae22f462a6?auto=format&fit=crop&q=80&w=800', room: 'Atelier', stage: 'Execuție', pieceTypes: [], stars: 0, caption: { ro: 'Vopsire', en: '' }, shotDate: today, orderInProject: 5, createdAt: today },
    { id: 'm-azure-s3-1', projectId: 'proj-1', kind: 'image', url: 'https://images.unsplash.com/photo-1556911223-e4524336297c?auto=format&fit=crop&q=80&w=800', room: 'Bucătărie', stage: 'Montaj', pieceTypes: [], stars: 0, caption: { ro: 'Montaj', en: '' }, shotDate: today, orderInProject: 6, createdAt: today },
  ],
  pages: [],
  leads: []
};

class DBService {
  private db: AppDB | null = null;

  public async load(): Promise<AppDB> {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        this.db = JSON.parse(stored);
        // Ensure services exist
        if (this.db && (!this.db.services || this.db.services.length === 0)) {
           this.db.services = [...SEED_DATA.services];
           this.save();
        }
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

  // ... (Settings, Projects, Media, Pages, Leads methods remain same) ...
  async getSettings(): Promise<Settings> {
    const db = await this.load();
    return db.settings;
  }
  async updateSettings(settings: Settings): Promise<void> {
    const db = await this.load();
    db.settings = settings;
    this.save();
  }
  async getProjects(): Promise<Project[]> {
    const db = await this.load();
    return db.projects;
  }
  async getProject(id: string): Promise<Project | undefined> {
    const db = await this.load();
    return db.projects.find(p => p.id === id);
  }
  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const db = await this.load();
    return db.projects.find(p => p.slug === slug || p.id === slug);
  }
  async upsertProject(project: Project): Promise<void> {
    const db = await this.load();
    const idx = db.projects.findIndex(p => p.id === project.id);
    if (idx >= 0) db.projects[idx] = project;
    else db.projects.push(project);
    this.save();
  }
  async deleteProject(id: string): Promise<void> {
    const db = await this.load();
    db.projects = db.projects.filter(p => p.id !== id);
    db.media = db.media.filter(m => m.projectId !== id);
    this.save();
  }
  async getMedia(projectId?: string): Promise<Media[]> {
    const db = await this.load();
    if (projectId) return db.media.filter(m => m.projectId === projectId);
    return db.media;
  }
  async getMediaById(id: string): Promise<Media | undefined> {
    const db = await this.load();
    return db.media.find(m => m.id === id);
  }
  async upsertMedia(media: Media): Promise<void> {
    const db = await this.load();
    const idx = db.media.findIndex(m => m.id === media.id);
    if (idx >= 0) db.media[idx] = media;
    else db.media.push(media);
    this.save();
  }
  async deleteMedia(id: string): Promise<void> {
    const db = await this.load();
    db.media = db.media.filter(m => m.id !== id);
    this.save();
  }
  async getPages(): Promise<Page[]> {
    const db = await this.load();
    return db.pages;
  }
  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const db = await this.load();
    return db.pages.find(p => p.slug === slug);
  }
  async upsertPage(page: Page): Promise<void> {
    const db = await this.load();
    const idx = db.pages.findIndex(p => p.id === page.id);
    if (idx >= 0) db.pages[idx] = page;
    else db.pages.push(page);
    this.save();
  }
  async deletePage(id: string): Promise<void> {
    const db = await this.load();
    db.pages = db.pages.filter(p => p.id !== id);
    this.save();
  }
  async getLeads(): Promise<Lead[]> {
    const db = await this.load();
    return db.leads;
  }
  async addLead(lead: Lead): Promise<void> {
    const db = await this.load();
    db.leads.unshift(lead);
    this.save();
  }
  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    const db = await this.load();
    const lead = db.leads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      this.save();
    }
  }

  // --- NEW SERVICE METHODS ---
  async getServices(): Promise<ServicePage[]> {
    const db = await this.load();
    return db.services.sort((a,b) => a.order - b.order);
  }

  async getServiceBySlug(slug: string): Promise<ServicePage | undefined> {
    const db = await this.load();
    return db.services.find(s => s.slug === slug);
  }

  async upsertService(service: ServicePage): Promise<void> {
    const db = await this.load();
    const idx = db.services.findIndex(s => s.id === service.id);
    if (idx >= 0) db.services[idx] = service;
    else db.services.push(service);
    this.save();
  }

  async deleteService(id: string): Promise<void> {
    const db = await this.load();
    db.services = db.services.filter(s => s.id !== id);
    this.save();
  }

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
