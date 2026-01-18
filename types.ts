
export type Lang = 'ro' | 'en';
export type Theme = 'light' | 'dark' | 'obsidian' | 'champagne' | 'marble' | 'navy' | 'emerald' | 'desert' | 'industrial' | 'nordic' | 'rose';

export interface I18nString {
  ro: string;
  en: string;
}

// Global Hero (Home Page)
export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: I18nString;
  subtitle: I18nString;
  primaryCta: { label: I18nString; href: string };
  secondaryCta: { label: I18nString; href: string };
}

export interface HeroConfig {
  mode: 'video' | 'slider' | 'image';
  enabled: boolean;
  height: 'fullscreen' | 'large' | 'medium';
  overlayStrength: number; // 0-100
  align: 'left' | 'center';
  eyebrow: I18nString;
  titleLine1: I18nString;
  titleLine2: I18nString;
  subtitle: I18nString;
  microFeatures: string[]; 
  primaryCta: { label: I18nString; href: string };
  secondaryCta: { label: I18nString; href: string; visible: boolean };
  videoUrl: string;
  posterUrl: string;
  muted: boolean;
  loop: boolean;
  showPlayButton: boolean;
  autoplay: boolean;
  interval: number;
  slides: HeroSlide[];
}

export interface Settings {
  id: 'global';
  projectTypes: string[];
  rooms: string[];
  stages: string[];
  pieceTypes: string[];
  nav: NavItem[];
  footer: {
    contact: {
      address: string;
      email: string;
      phone: string;
    };
    socials: { platform: string; url: string }[];
    legal: I18nString;
  };
  activeTheme: Theme;
  featuredStarsThreshold: number;
  brand: {
    logoDarkUrl: string;
    logoLightUrl: string;
    brandName: string; // Default: CARVELLO
    brandSlogan: string; // Default: Executat milimetric.
    useTextLogo: boolean;
  };
  adminPassword: string;
  hero: HeroConfig; 
}

export interface NavItem {
  id: string;
  label: I18nString;
  href: string;
  visible: boolean;
  order: number;
}

// --- SERVICE TYPES ---
export interface ServiceFeature {
  title: I18nString;
  desc: I18nString;
  icon: string; // Emoji or simple string identifier
}

export interface ServiceProcessStep {
  title: I18nString;
  desc: I18nString;
}

export interface ServiceFAQ {
  question: I18nString;
  answer: I18nString;
}

export interface ServicePage {
  id: string;
  slug: string;
  title: I18nString;
  subtitle: I18nString;
  shortDescription: I18nString; // For the Hub
  fullDescription: I18nString; // For the Detail Page hero
  
  heroMediaId: string | null; // Image or Video
  
  bullets: I18nString[]; // For the Hub
  
  // Detail Page Content
  features: ServiceFeature[]; // "What you get" cards
  processSteps: ServiceProcessStep[];
  faq: ServiceFAQ[];
  
  relatedProjectTags: string[]; // To filter portfolio gallery
  
  isPublished: boolean;
  order: number;
}


// --- PROJECT SPECIFIC TYPES ---

export interface ProjectHeroConfig {
  mode: 'image' | 'video';
  imageId?: string; // Media ID
  videoId?: string; // Media ID
  posterId?: string; // Media ID (fallback for video)
  overlay: {
    intensity: number; // 0-100
    vignette: boolean;
    grain: boolean;
  };
}

export interface StageMedia {
  coverId?: string;
  galleryIds: string[];
  videoId?: string;
  posterId?: string;
}

export interface ProjectStage {
  id: string;
  title: I18nString;
  subtitle?: I18nString;
  dateLabel?: string; // e.g. "Week 1", "Ziua 10"
  description: I18nString;
  highlights: string[];
  media: StageMedia;
}

export interface Album {
  id: string;
  title: I18nString;
  description?: I18nString;
  mediaIds: string[];
}

export interface ProjectMetrics {
  duration: string;
  finish: string;
  materials: string;
  hardware: string;
  services: string[];
}

export interface Project {
  id: string;
  slug?: string;
  title: I18nString;
  summary: I18nString; // Short summary for card
  
  // Timeline Sorting
  timelineDate: string; // ISO Date for sorting on portfolio page
  
  // Executive Summary (Case Study)
  clientBrief?: I18nString; // "Challenge"
  ourSolution?: I18nString; // "Solution"
  result?: I18nString; // "Result"

  metrics?: ProjectMetrics;
  
  // Cinematic Hero Per Project
  heroConfig?: ProjectHeroConfig;

  // Detailed Process Timeline
  stages?: ProjectStage[];
  
  // Organized Albums (Optional)
  albums?: Album[];

  // Tech Specs (Key-Value)
  techSpecs?: { label: string; value: string }[];

  projectType: string; // "Rezidențial", "Comercial", etc.
  location: I18nString;
  tags?: string[]; // New: For filtering tags like "CNC", "MDF"
  isFeatured?: boolean; // New: For "Featured" sort

  publishedAt: string;
  coverMediaId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  projectId: string;
  kind: 'image' | 'video';
  url: string; // Base64 or URL
  room: string;
  stage: string;
  pieceTypes: string[];
  stars: number;
  caption: I18nString | null;
  shotDate: string | null;
  orderInProject: number;
  createdAt: string;
}

export interface Page {
  id: string;
  routeType: 'system' | 'custom';
  slug: string;
  template: 'standard' | 'service' | 'info' | 'spotlight';
  hero: {
    title: I18nString;
    subtitle: I18nString;
    primaryCta?: { label: I18nString; href: string };
    secondaryCta?: { label: I18nString; href: string };
    darkImageUrl: string;
    lightImageUrl: string;
    overlayStrength: number;
  };
  sections: SectionBlock[];
  seo: {
    title: I18nString;
    description: I18nString;
  };
  isPublished: boolean;
  order: number;
  updatedAt: string;
}

export type SectionType = 'text' | 'imageText' | 'cards' | 'steps' | 'cta' | 'galleryStrip' | 'faq' | 'testimonials';

export interface SectionBlock {
  id: string;
  type: SectionType;
  content: any;
  order: number;
}

export interface Lead {
  id: string;
  type: 'general' | 'project-feedback';
  projectRef?: { id: string; title: string }; // If feedback
  rating?: number; // If feedback
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string; // Or "Feedback"
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'won' | 'lost' | 'approved' | 'archived'; // Approved for testimonials
  company?: string; // Honeypot
  userAgent?: string;
  currentUrl?: string;
}

export interface AppDB {
  settings: Settings;
  projects: Project[];
  services: ServicePage[]; // NEW
  media: Media[];
  pages: Page[];
  leads: Lead[];
}
