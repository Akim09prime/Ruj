
import { AppDB, Settings, Project, Media, Page, Lead } from '../types';

const DB_KEY = 'carvello_db';

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
      logoDarkUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200&h=50&text=CARVELLO',
      logoLightUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200&h=50&text=CARVELLO'
    },
    adminPassword: 'admin'
  },
  projects: [
    {
      id: 'proj-1',
      title: { ro: 'Penthouse Obsidian', en: 'Obsidian Penthouse' },
      summary: { ro: 'Un proiect minimalist definit prin linii drepte și finisaj 2K negru mat profund.', en: 'A minimalist project defined by straight lines and deep black matte 2K finish.' },
      projectType: 'Rezidențial',
      location: { ro: 'București, RO', en: 'Bucharest, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm-1',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj-2',
      title: { ro: 'Showroom Automobilistic', en: 'Automotive Showroom' },
      summary: { ro: 'Panotări CNC complexe pentru un spațiu expozițional de lux.', en: 'Complex CNC wall panels for a luxury exhibition space.' },
      projectType: 'Comercial',
      location: { ro: 'Cluj, RO', en: 'Cluj, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm-3',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
        // Dacă baza de date e goală (proiecte), forțăm seed-ul pentru demo
        if (this.db && this.db.projects.length === 0 && this.db.media.length === 0) {
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
