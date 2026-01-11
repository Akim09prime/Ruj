
import { AppDB, Settings, Project, Media, Page, Lead } from '../types';

const DB_KEY = 'carvello_db';

const SEED_DATA: AppDB = {
  settings: {
    id: 'global',
    projectTypes: ['Rezidențial', 'HoReCa', 'Office', 'Comercial'],
    rooms: ['Living', 'Bucătărie', 'Dormitor', 'Baie', 'Hol', 'Terasa'],
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
    themeDefault: 'dark',
    featuredStarsThreshold: 4,
    brand: {
      logoDarkUrl: 'https://picsum.photos/200/50?text=CARVELLO-DARK',
      logoLightUrl: 'https://picsum.photos/200/50?text=CARVELLO-LIGHT'
    },
    adminPassword: 'admin'
  },
  projects: [
    {
      id: 'p1',
      title: { ro: 'Penthouse Minimalist Cluj', en: 'Cluj Minimalist Penthouse' },
      summary: { ro: 'Un proiect de anvergură cu mobilier din MDF vopsit 2K și detalii CNC.', en: 'A large-scale project featuring 2K painted MDF furniture and CNC details.' },
      projectType: 'Rezidențial',
      location: { ro: 'Cluj-Napoca, RO', en: 'Cluj-Napoca, RO' },
      publishedAt: new Date().toISOString(),
      coverMediaId: 'm1',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  media: [
    {
      id: 'm1',
      projectId: 'p1',
      kind: 'image',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      room: 'Living',
      stage: 'Montaj',
      pieceTypes: ['Comodă'],
      stars: 5,
      caption: { ro: 'Detalii finisaj vopsit mat', en: 'Matte paint finish details' },
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
    this.db = { ...SEED_DATA };
    this.save();
  }
}

export const dbService = new DBService();
