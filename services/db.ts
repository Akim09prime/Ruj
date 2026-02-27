
import { AppDB, Settings, Project, Media, Page, Lead, ServicePage, ProcessStep, AboutPageData, Review, ContactPageData } from '../types';

const getBasePath = () => {
  const path = window.location.pathname;
  if (path.includes('/admin')) {
    return path.substring(0, path.indexOf('/admin'));
  }
  // For public pages, we might be on /about, /portfolio, etc.
  // We need to find the root. Since we don't know the exact subdirectory,
  // it's safer to use a relative path if we are at the root, or just use /api if we assume it's hosted at domain root.
  // Actually, if we use Vite with React Router, the basename should be known.
  // Let's assume it's hosted at the domain root for now, or use import.meta.env.BASE_URL
  return import.meta.env.BASE_URL.replace(/\/$/, '');
};

const API_BASE = (getBasePath() || '') + '/api';

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
    info: { phone: '0729 728 880', email: 'office@carvello.ro', address: 'Strada Industriei 10', city: 'Cluj', country: 'Ro', hours: 'L-V', responseBuffer: {ro:'24h',en:'24h'}, whatsappLink: '', mapEmbedUrl: '' },
    timeline: { steps: [] }, faq: []
  },
  media: [
    { id: 'm1', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Kitchen Premium', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Living Room Luxury', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm3', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Bedroom Custom', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm4', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Office Setup', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm5', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Bathroom Details', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm6', url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Wood Texture', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm7', url: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Modern Kitchen', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm8', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Minimalist Living', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm9', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Cozy Bedroom', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm10', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Bathroom Vanity', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm11', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Kitchen Island', size: 1024, createdAt: new Date().toISOString() },
    { id: 'm12', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000', kind: 'image', name: 'Interior Details', size: 1024, createdAt: new Date().toISOString() }
  ],
  projects: [
    {
      id: 'p1', title: 'Vila Lumina', slug: 'vila-lumina', type: 'Rezidențial', year: 2024,
      shortDescription: { ro: 'Bucătărie și living open-space cu finisaje premium.', en: 'Open-space kitchen and living with premium finishes.' },
      description: { ro: 'Un proiect complet de amenajare interioară, punând accent pe materiale naturale și linii minimaliste. Am folosit MDF vopsit 2K și furnir natural de stejar.', en: 'A complete interior design project, focusing on natural materials and minimalist lines. We used 2K painted MDF and natural oak veneer.' },
      coverImageId: 'm1', heroImageId: 'm1', galleryIds: ['m1', 'm2', 'm6'],
      featured: true, visible: true, order: 1,
      stats: [{ label: { ro: 'Suprafață', en: 'Area' }, value: '120 mp' }, { label: { ro: 'Durată', en: 'Duration' }, value: '4 săptămâni' }]
    },
    {
      id: 'p2', title: 'Apartament Nord', slug: 'apartament-nord', type: 'Rezidențial', year: 2023,
      shortDescription: { ro: 'Dormitor matrimonial și dressing custom.', en: 'Master bedroom and custom walk-in closet.' },
      description: { ro: 'Optimizarea spațiului a fost prioritatea principală. Am creat un dressing pe comandă cu iluminare LED integrată și un pat cu tăblie tapițată.', en: 'Space optimization was the main priority. We created a custom walk-in closet with integrated LED lighting and a bed with an upholstered headboard.' },
      coverImageId: 'm3', heroImageId: 'm3', galleryIds: ['m3', 'm5'],
      featured: true, visible: true, order: 2,
      stats: [{ label: { ro: 'Materiale', en: 'Materials' }, value: 'MDF, Sticlă, Metal' }]
    },
    {
      id: 'p3', title: 'Office Central', slug: 'office-central', type: 'Office', year: 2024,
      shortDescription: { ro: 'Amenajare spațiu de birouri modern.', en: 'Modern office space fit-out.' },
      description: { ro: 'Mobilier ergonomic și soluții acustice pentru un mediu de lucru productiv. Am integrat birouri reglabile pe înălțime și panouri fonoabsorbante.', en: 'Ergonomic furniture and acoustic solutions for a productive work environment. We integrated height-adjustable desks and sound-absorbing panels.' },
      coverImageId: 'm4', heroImageId: 'm4', galleryIds: ['m4', 'm6'],
      featured: false, visible: true, order: 3,
      stats: [{ label: { ro: 'Posturi de lucru', en: 'Workstations' }, value: '24' }]
    },
    {
      id: 'p4', title: 'Bucătărie Obsidian', slug: 'bucatarie-obsidian', type: 'Rezidențial', year: 2024,
      shortDescription: { ro: 'Bucătărie modernă cu insulă și accente negre.', en: 'Modern kitchen with island and black accents.' },
      description: { ro: 'O abordare curajoasă folosind nuanțe închise și texturi mate. Insula centrală servește atât ca spațiu de lucru, cât și ca zonă de dining.', en: 'A bold approach using dark shades and matte textures. The central island serves as both a workspace and a dining area.' },
      coverImageId: 'm7', heroImageId: 'm7', galleryIds: ['m7', 'm11', 'm6'],
      featured: true, visible: true, order: 4,
      stats: [{ label: { ro: 'Materiale', en: 'Materials' }, value: 'MDF Mat, Cuarț' }]
    },
    {
      id: 'p5', title: 'Penthouse Panorama', slug: 'penthouse-panorama', type: 'Rezidențial', year: 2023,
      shortDescription: { ro: 'Amenajare completă pentru un penthouse de lux.', en: 'Complete fit-out for a luxury penthouse.' },
      description: { ro: 'Fiecare piesă de mobilier a fost realizată pe comandă pentru a se integra perfect în arhitectura spațiului. Finisaje din lemn masiv și detalii din alamă.', en: 'Every piece of furniture was custom-made to perfectly integrate into the architecture of the space. Solid wood finishes and brass details.' },
      coverImageId: 'm8', heroImageId: 'm8', galleryIds: ['m8', 'm9', 'm12'],
      featured: true, visible: true, order: 5,
      stats: [{ label: { ro: 'Suprafață', en: 'Area' }, value: '200 mp' }]
    },
    {
      id: 'p6', title: 'Băi Spa', slug: 'bai-spa', type: 'Rezidențial', year: 2024,
      shortDescription: { ro: 'Mobilier de baie rezistent la umezeală, design minimalist.', en: 'Moisture-resistant bathroom furniture, minimalist design.' },
      description: { ro: 'Am folosit materiale compozite și MDF tratat special pentru a asigura durabilitatea în medii umede, menținând în același timp un aspect elegant.', en: 'We used composite materials and specially treated MDF to ensure durability in wet environments while maintaining an elegant look.' },
      coverImageId: 'm10', heroImageId: 'm10', galleryIds: ['m10', 'm5'],
      featured: false, visible: true, order: 6,
      stats: [{ label: { ro: 'Finisaj', en: 'Finish' }, value: 'MDF Vopsit Poliuretanic' }]
    }
  ],
  services: [
    {
      id: 's1', title: { ro: 'Bucătării Premium', en: 'Premium Kitchens' }, slug: 'bucatarii-premium',
      shortDescription: { ro: 'Design ergonomic și materiale durabile.', en: 'Ergonomic design and durable materials.' },
      description: { ro: 'Bucătării la comandă, perfect adaptate spațiului și stilului tău de viață. Folosim feronerie Blum de ultimă generație și fronturi din MDF vopsit sau furniruit.', en: 'Custom kitchens, perfectly adapted to your space and lifestyle. We use state-of-the-art Blum hardware and painted or veneered MDF fronts.' },
      coverImageId: 'm1', heroImageId: 'm1', galleryIds: ['m1', 'm2'],
      features: [{ ro: 'Feronerie Blum', en: 'Blum Hardware' }, { ro: 'Blaturi Quartz/Ceramică', en: 'Quartz/Ceramic Worktops' }, { ro: 'Iluminare LED integrată', en: 'Integrated LED lighting' }],
      visible: true, order: 1
    },
    {
      id: 's2', title: { ro: 'Dormitoare & Dressinguri', en: 'Bedrooms & Closets' }, slug: 'dormitoare-dressinguri',
      shortDescription: { ro: 'Soluții inteligente de depozitare.', en: 'Smart storage solutions.' },
      description: { ro: 'Transformăm dormitorul tău într-un sanctuar de relaxare. Dressinguri cu compartimentare personalizată și paturi cu design exclusivist.', en: 'We transform your bedroom into a sanctuary of relaxation. Walk-in closets with custom compartments and beds with exclusive design.' },
      coverImageId: 'm3', heroImageId: 'm3', galleryIds: ['m3', 'm5'],
      features: [{ ro: 'Compartimentare custom', en: 'Custom compartments' }, { ro: 'Sisteme de glisare silențioase', en: 'Silent sliding systems' }],
      visible: true, order: 2
    }
  ],
  processSteps: [
    { id: 'ps1', title: { ro: '1. Consultanță & Măsurători', en: '1. Consulting & Measurements' }, description: { ro: 'Discutăm nevoile tale și realizăm releveul exact al spațiului.', en: 'We discuss your needs and take exact measurements of the space.' }, icon: 'ruler', order: 1 },
    { id: 'ps2', title: { ro: '2. Design 3D & Ofertare', en: '2. 3D Design & Quoting' }, description: { ro: 'Creăm simulări 3D realiste și stabilim bugetul final.', en: 'We create realistic 3D simulations and establish the final budget.' }, icon: 'monitor', order: 2 },
    { id: 'ps3', title: { ro: '3. Producție CNC', en: '3. CNC Production' }, description: { ro: 'Prelucrăm materialele cu precizie milimetrică în propriul atelier.', en: 'We process materials with millimeter precision in our own workshop.' }, icon: 'settings', order: 3 },
    { id: 'ps4', title: { ro: '4. Finisaj & Vopsire 2K', en: '4. Finishing & 2K Painting' }, description: { ro: 'Aplicăm finisaje premium, rezistente în timp.', en: 'We apply premium finishes, resistant over time.' }, icon: 'paint-roller', order: 4 },
    { id: 'ps5', title: { ro: '5. Montaj & Recepție', en: '5. Assembly & Handover' }, description: { ro: 'Echipa noastră instalează mobilierul cu atenție la fiecare detaliu.', en: 'Our team installs the furniture with attention to every detail.' }, icon: 'tool', order: 5 }
  ],
  reviews: [
    { id: 'r1', authorName: 'Andrei Popescu', authorRole: { ro: 'Client Rezidențial', en: 'Residential Client' }, text: { ro: 'Calitate excepțională și atenție la detalii. Bucătăria arată exact ca în randările 3D.', en: 'Exceptional quality and attention to detail. The kitchen looks exactly like the 3D renders.' }, rating: 5, date: '2024-01-15', visible: true, featured: true },
    { id: 'r2', authorName: 'Maria Ionescu', authorRole: { ro: 'Arhitect', en: 'Architect' }, text: { ro: 'Colaborez cu Carvello de peste 2 ani. Sunt singurii care pot executa detaliile complexe pe care le desenez.', en: 'I have been collaborating with Carvello for over 2 years. They are the only ones who can execute the complex details I draw.' }, rating: 5, date: '2023-11-20', visible: true, featured: true }
  ],
  pages: [], leads: []
};

class DBService {
  private getToken(): string | null {
    return localStorage.getItem('carvello_auth_token');
  }

  private getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = { ...extraHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Helper to fetch data with fallback to SEED_DATA
  private async fetchContent<T>(type: string, fallback: T): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}/content.php?type=${type}`, { 
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      
      if (text.trim().startsWith('<?php')) {
        const mockData = localStorage.getItem(`carvello_mock_${type}`);
        if (mockData) {
          return JSON.parse(mockData) as T;
        }
        return fallback;
      }
      
      if (!text) return fallback;
      const data = JSON.parse(text);
      
      // If data is empty array or empty object, use fallback if provided
      if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback) && fallback.length > 0) return fallback;
      if (typeof data === 'object' && data !== null && !Array.isArray(data) && Object.keys(data).length === 0 && typeof fallback === 'object' && fallback !== null && Object.keys(fallback).length > 0) return fallback;
      
      // Merge with fallback for objects to ensure all keys exist (e.g. new settings)
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
         return { ...fallback, ...data };
      }
      
      return data as T;
    } catch (e) {
      console.warn(`Failed to fetch ${type}, using fallback`, e);
      return fallback;
    }
  }

  // Helper to save data
  private async saveContent<T>(type: string, data: T): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/content.php?type=${type}`, {
        method: 'POST',
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
        credentials: 'include'
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) {
        localStorage.setItem(`carvello_mock_${type}`, JSON.stringify(data));
        return;
      }
      if (!res.ok) throw new Error('Failed to save data');
    } catch (e) {
      console.error(`Failed to save ${type}`, e);
      throw e;
    }
  }

  // Auth methods
  async checkAuth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=check`, { 
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) {
        return localStorage.getItem('carvello_auth_token') === 'dev_mock_token';
      }
      const data = JSON.parse(text);
      return data.authenticated;
    } catch { return false; }
  }

  async login(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      });
      const text = await res.text();
      if (text.trim().startsWith('<?php')) {
        if (password === 'admin') {
          localStorage.setItem('carvello_auth_token', 'dev_mock_token');
          return true;
        }
        return false;
      }
      const data = JSON.parse(text);
      if (data.success && data.token) {
        localStorage.setItem('carvello_auth_token', data.token);
      }
      return data.success;
    } catch { return false; }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth.php?action=logout`, { 
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('carvello_auth_token');
  }

  async changePassword(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth.php?action=change_password`, {
        method: 'POST',
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ password }),
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
    // Also clean up media references if needed, but keeping it simple for now
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
    
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
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
    // Leads might be sensitive, ensure auth check on server side (already done in content.php)
    return this.fetchContent('leads', SEED_DATA.leads); 
  }
  async addLead(lead: Lead): Promise<void> { 
    // This is public, so we might need a separate endpoint or allow public POST to leads
    // But content.php requires auth for POST.
    // However, the contact form uses /api/contact.php which sends email.
    // If we want to save lead to DB, we should do it in contact.php on the server side.
    // For now, let's assume this is only called by Admin or we need to allow public write to leads (risky).
    // Actually, the user requirement says "Stocare date CMS pe server". Leads are part of CMS.
    // The public contact form submits to /api/contact.php. I should update /api/contact.php to save the lead to leads.json as well.
    // So this method might be redundant for public use, but useful for admin manual add?
    // Let's keep it but it will fail if not logged in.
    // WAIT: The previous implementation saved to localStorage in Contact.tsx.
    // Now Contact.tsx sends to /api/contact.php.
    // I should update /api/contact.php to save to leads.json.
    // So I will remove the call to addLead from Contact.tsx or make it a no-op for public.
    // But for Admin, we might want to see leads.
    
    // Let's just implement it for Admin use.
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
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Export failed');
    const data = await res.text();
    return data;
  }
  
  async importDB(json: string): Promise<void> {
    try {
      const parsed = JSON.parse(json);
      const res = await fetch(`${API_BASE}/backup.php?action=import`, {
        method: 'POST',
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(parsed),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Import failed');
      window.location.reload();
    } catch (e) {
      console.error('Import failed:', e);
      throw e;
    }
  }
  
  async resetToSeed(): Promise<void> { 
    await fetch(`${API_BASE}/backup.php?action=reset`, { 
      method: 'POST', 
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    window.location.reload(); 
  }
}

export const dbService = new DBService();
