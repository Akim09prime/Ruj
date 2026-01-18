import { AppDB, Settings, Project, Media, Page, Lead } from '../types';

const DB_KEY = 'carvello_db';

const BRAND_LOGO_DARK = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 
const BRAND_LOGO_LIGHT = "https://i.ibb.co/L9vC8Lh/carvello-logo-gold.png"; 

const SEED_DATA: AppDB = {
  settings: {
    id: 'global',
    projectTypes: ['Rezidențial', 'HoReCa', 'Office', 'Comercial'],
    rooms: ['Living', 'Bucătărie', 'Dormitor', 'Baie', 'Hol', 'Office'],
    stages: ['Concept', 'Proiectare', 'Execuție', 'Finisaj', 'Montaj'],
    pieceTypes: ['Masă', 'Scaun', 'Dulap', 'Comodă', 'Insulă', 'Panou CNC'],
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
      useTextLogo: true // Default to text logo per prompt "reintroduce text logo"
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
  projects: [
    {
      id: 'proj-1',
      slug: 'penthouse-obsidian',
      title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
      summary: { ro: 'Un proiect minimalist definit prin linii drepte și finisaj 2K negru mat profund.', en: 'Minimalist project defined by straight lines and deep matte black 2K finish.' },
      timelineDate: '2024-03-15',
      projectType: 'Rezidențial',
      location: { ro: 'București, RO', en: 'Bucharest, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm-1',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        duration: "45 Zile",
        finish: "MDF Vopsit 2K Mat",
        materials: "MDF + Sticlă Fumurie",
        hardware: "Blum Legrabox",
        services: ["Proiectare 3D", "CNC", "Finisaj", "Montaj"]
      },
      clientBrief: {
        ro: "Clientul a dorit o atmosferă masculină, sobră, dar caldă. Cerința principală a fost mascarea tuturor zonelor de depozitare în spatele unor panouri 'invizibile'.",
        en: "The client wanted a masculine, sober, yet warm atmosphere. The main requirement was to hide all storage areas behind 'invisible' panels."
      },
      ourSolution: {
        ro: "Am propus un sistem de panotare completă a pereților cu MDF vopsit 2K, integrând uși filomuro și spații de depozitare cu deschidere tip push-open.",
        en: "We proposed a complete wall paneling system with 2K painted MDF, integrating flush doors and push-open storage spaces."
      },
      result: {
        ro: "Un spațiu unitar, fluid, unde mobilierul devine parte din arhitectură. Zero cabluri vizibile, zero imperfecțiuni.",
        en: "A unified, fluid space where furniture becomes part of the architecture. Zero visible cables, zero imperfections."
      },
      stages: [
        { title: { ro: "Măsurători & Scanare", en: "Scanning" }, description: { ro: "Scanare laser 3D a spațiului pentru o precizie de 1mm.", en: "3D laser scanning." }, highlights: ["Scanare Laser", "Releu Digital"], images: [] },
        { title: { ro: "Producție CNC", en: "CNC Production" }, description: { ro: "Frezare parametrică a panourilor.", en: "Parametric milling of panels." }, highlights: ["Nesting Optimizat", "Toleranță 0.1mm"], images: [] },
        { title: { ro: "Finisaj 2K", en: "2K Finishing" }, description: { ro: "Aplicare 4 straturi vopsea mată.", en: "Applying 4 layers of matte paint." }, highlights: ["Cameră Presurizată", "Grad Luciu 5%"], images: [] },
      ],
      techSpecs: [
        { label: "Fronturi", value: "MDF 22mm Vopsit 2K NCS S 9000-N" },
        { label: "Structură", value: "PAL Egger U999 ST9" },
        { label: "Feronerie", value: "Blum Legrabox Pure + Tip-On" },
        { label: "Blat", value: "Ceramică Neolith 12mm" }
      ],
      testimonial: {
        text: { ro: "Rezultatul depășește randările. Montajul a fost impecabil, fără praf și fără întârzieri.", en: "The result exceeds the renderings. Installation was flawless, dust-free and on time." },
        author: "Andrei S.",
        role: "Proprietar"
      }
    },
    {
      id: 'proj-2',
      slug: 'showroom-luxury',
      title: { ro: 'Showroom Automobilistic', en: 'Automotive Showroom' },
      summary: { ro: 'Panotări CNC complexe pentru un spațiu expozițional de lux.', en: 'Complex CNC wall panels for a luxury exhibition space.' },
      timelineDate: '2023-11-10',
      projectType: 'Comercial',
      location: { ro: 'Cluj, RO', en: 'Cluj, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm-3',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        duration: "30 Zile",
        finish: "Furnir Natural + Lac",
        materials: "Placaj Mesteacăn",
        hardware: "Sisteme Suspendare",
        services: ["Randare", "CNC Parametric", "Montaj Înalt"]
      },
      stages: [
        { title: { ro: "Prototipare", en: "Prototyping" }, description: { ro: "Testarea modelului parametric.", en: "Testing parametric model." }, highlights: ["Mostre 1:1", "Test Lacuri"], images: [] },
        { title: { ro: "Execuție", en: "Execution" }, description: { ro: "Frezare continuă 72h.", en: "Continuous milling 72h." }, highlights: ["Utilaje 5 Axe", "Calibrare"], images: [] },
      ]
    },
    {
      id: 'proj-3',
      slug: 'villa-azure',
      title: { ro: 'Villa Azure', en: 'Villa Azure' },
      summary: { ro: 'Amenajare completă bucătărie și dressing cu accente de bronz și piatră naturală.', en: 'Complete kitchen and dressing layout with bronze accents and natural stone.' },
      timelineDate: '2023-08-20',
      projectType: 'Rezidențial',
      location: { ro: 'Brașov, RO', en: 'Brasov, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm-5',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        duration: "60 Zile",
        finish: "Vopsit Satinat",
        materials: "MDF + Metal + Piatră",
        hardware: "Häfele",
        services: ["Design", "Producție", "Montaj"]
      }
    }
  ],
  media: [
    {
      id: 'm-1',
      projectId: 'proj-1',
      kind: 'image',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      room: 'Living',
      stage: 'Finisaj',
      pieceTypes: ['Comodă'],
      stars: 5,
      caption: { ro: 'Detalii 2K Negru Mat', en: '2K Matte Black Details' },
      shotDate: new Date().toISOString(),
      orderInProject: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 'm-2',
      projectId: 'proj-1',
      kind: 'image',
      url: 'https://images.unsplash.com/photo-1556911223-e4524336297c?auto=format&fit=crop&q=80&w=1200',
      room: 'Bucătărie',
      stage: 'Montaj',
      pieceTypes: ['Insulă'],
      stars: 4,
      caption: { ro: 'Insulă Bucătărie CNC', en: 'CNC Kitchen Island' },
      shotDate: new Date().toISOString(),
      orderInProject: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'm-3',
      projectId: 'proj-2',
      kind: 'image',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      room: 'Office',
      stage: 'Execuție',
      pieceTypes: ['Panou CNC'],
      stars: 5,
      caption: { ro: 'Panouri Parametrice', en: 'Parametric Panels' },
      shotDate: new Date().toISOString(),
      orderInProject: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 'm-5',
      projectId: 'proj-3',
      kind: 'image',
      url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
      room: 'Bucătărie',
      stage: 'Final',
      pieceTypes: ['Bucătărie'],
      stars: 5,
      caption: { ro: 'Bucătărie Villa Azure', en: 'Villa Azure Kitchen' },
      shotDate: new Date().toISOString(),
      orderInProject: 0,
      createdAt: new Date().toISOString()
    }
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
        // Migrations
        if (this.db && !this.db.settings.hero) {
          this.db.settings.hero = SEED_DATA.settings.hero;
          this.save();
        }
        if (this.db && !this.db.settings.brand) {
          this.db.settings.brand = SEED_DATA.settings.brand;
          this.save();
        }
        if (this.db && this.db.projects.length < 3) {
           this.db = { ...SEED_DATA };
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
