
import { AppDB, Settings, Project, Media, Page, Lead, ServicePage, ProcessStep, AboutPageData, Review, ContactPageData } from '../types';

// DEBUG FLAG - Set to true for preview environment (Node.js) where PHP doesn't run.
// On cPanel (Apache/PHP), the server will execute PHP, so the "<?php" check will fail, 
// and this flag won't matter (it will use the real backend).
const DEBUG_MODE = false;

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
    hero: { title: {ro:'Despre',en:'About'}, subtitle: {ro:'Precizie',en:'Precision'}, text: {ro:'Atelier premium.',en:'Premium workshop.'}, mediaId: null },
    manifesto: { title: {ro:'Manifest',en:'Manifesto'}, text: {ro:'Calitate.',en:'Quality.'}, bullets: [] },
    pillars: [], quality: { title: {ro:'Calitate',en:'Quality'}, bullets: [], images: [] }, timeline: [],
    clients: { resTitle: {ro:'',en:''}, resDesc: {ro:'',en:''}, comTitle: {ro:'',en:''}, comDesc: {ro:'',en:''}},
    cta: { title: {ro:'',en:''}, trustLine: {ro:'',en:''}}
  },
  contact: {
    hero: { title: {ro:'Contact',en:'Contact'}, subtitle: {ro:'Hai să discutăm',en:'Lets talk'}, ctaPrimary: {ro:'Mesaj',en:'Message'}, ctaSecondary: {ro:'WhatsApp',en:'WhatsApp'}, coverImageId: null },
    info: { phone: '0729 728 880', email: 'office@carvello.ro', address: 'Strada Industriei 10', city: 'Cluj', country: 'Ro', hours: 'L-V', "responseBuffer": {"ro":"24h","en":"24h"}, whatsappLink: '', mapEmbedUrl: '' },
    timeline: { steps: [] }, faq: []
  },
  media: [],
  projects: [],
  services: [],
  processSteps: [],
  reviews: [],
  pages: [], leads: []
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
      if (json.error) throw new Error(json.error);
      
    } catch (e) {
      console.error(`Failed to save ${type}`, e);
      throw e;
    }
  }

  // Auth methods
  async checkAuth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=session`, { 
        credentials: 'include'
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) return DEBUG_MODE; // Dev fallback
      const data = JSON.parse(text);
      return data.authenticated === true;
    } catch { return false; }
  }

  async login(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }), // Default username
        credentials: 'include'
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) return DEBUG_MODE && password === 'admin';
      
      const data = JSON.parse(text);
      return data.success === true;
    } catch { return false; }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth.php?action=logout`, { 
        method: 'POST',
        credentials: 'include'
      });
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
    const idx = media.findIndex(m => m.id === mediaItem.id);
    if (idx >= 0) media[idx] = mediaItem; else media.push(mediaItem);
    await this.saveContent('gallery', media);
  }
  async deleteMedia(id: string): Promise<void> { 
    const media = await this.getMedia();
    const newMedia = media.filter(m => m.id !== id);
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
