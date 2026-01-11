
export type Lang = 'ro' | 'en';
export type Theme = 'light' | 'dark';

export interface I18nString {
  ro: string;
  en: string;
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
  themeDefault: Theme;
  featuredStarsThreshold: number;
  brand: {
    logoDarkUrl: string;
    logoLightUrl: string;
  };
  adminPassword: string; // Simplified for this local demo
}

export interface NavItem {
  id: string;
  label: I18nString;
  href: string;
  visible: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: I18nString;
  summary: I18nString;
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
  content: any; // Dynamic based on type
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface AppDB {
  settings: Settings;
  projects: Project[];
  media: Media[];
  pages: Page[];
  leads: Lead[];
}
