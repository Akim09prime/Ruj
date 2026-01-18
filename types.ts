
export type Lang = 'ro' | 'en';
export type Theme = 'light' | 'dark' | 'obsidian' | 'champagne' | 'marble' | 'navy' | 'emerald' | 'desert' | 'industrial' | 'nordic' | 'rose';

export interface I18nString {
  ro: string;
  en: string;
}

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

// --- NEW PROCESS STAGE TYPE ---
export interface ProjectStage {
  title: I18nString;
  description: I18nString;
  date?: string;
  highlights: string[];
  images: string[]; // URLs
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
  
  // Detailed Process Timeline
  stages?: ProjectStage[];
  
  // Tech Specs (Key-Value)
  techSpecs?: { label: string; value: string }[];

  testimonial?: {
    text: I18nString;
    author: string;
    role: string;
  };

  projectType: string;
  location: I18nString;
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
  url: string;
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
}

export interface AppDB {
  settings: Settings;
  projects: Project[];
  media: Media[];
  pages: Page[];
  leads: Lead[];
}
