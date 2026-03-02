
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
  overlayStrength: number;
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

export interface ContactPageData {
  hero: {
    title: I18nString;
    subtitle: I18nString;
    ctaPrimary: I18nString;
    ctaSecondary: I18nString;
    coverImageId: string | null;
  };
  info: {
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
    hours: string;
    responseBuffer: I18nString;
    whatsappLink: string;
    mapEmbedUrl: string;
  };
  timeline: {
    steps: { title: I18nString; desc: I18nString }[];
  };
  faq: { question: I18nString; answer: I18nString }[];
}

export interface Review {
  id: string;
  status: 'pending' | 'approved' | 'hidden';
  consentPublic: boolean;
  rating: number;
  text: string;
  clientNameDisplay: string;
  city: string;
  projectType: 'Rezidențial' | 'Comercial';
  projectLabel: string;
  avatarMediaId?: string;
  createdAt: string;
  isFeatured: boolean;
  source: 'internal' | 'google' | 'instagram';
}

export interface AboutPageData {
  hero: {
    title: I18nString;
    subtitle: I18nString;
    text: I18nString;
    mediaId: string | null;
  };
  manifesto: {
    title: I18nString;
    text: I18nString;
    bullets: I18nString[];
  };
  pillars: {
    title: I18nString;
    desc: I18nString;
    bullets: I18nString[];
  }[];
  quality: {
    title: I18nString;
    bullets: I18nString[];
    images: string[];
  };
  timeline: {
    year: string;
    title: I18nString;
    desc: I18nString;
  }[];
  clients: {
    resTitle: I18nString;
    resDesc: I18nString;
    comTitle: I18nString;
    comDesc: I18nString;
  };
  cta: {
    title: I18nString;
    trustLine: I18nString;
  }
}

export interface Settings {
  id: 'global';
  maintenanceMode: boolean;
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
    brandName: string;
    brandSlogan: string;
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

export interface ServicePage {
  id: string;
  slug: string;
  title: I18nString;
  subtitle: I18nString;
  shortDescription: I18nString;
  fullDescription: I18nString;
  heroMediaId: string | null;
  bullets: I18nString[];
  features: { title: I18nString; desc: I18nString; icon: string; }[];
  processSteps: { title: I18nString; desc: I18nString; }[];
  faq: { question: I18nString; answer: I18nString; }[];
  relatedProjectTags: string[];
  isPublished: boolean;
  order: number;
}

export interface ProcessStep {
  id: string;
  order: number;
  title: I18nString;
  description: I18nString;
  bullets: I18nString[];
  mediaId: string | null;
  cta: { label: I18nString; href: string };
  isVisible: boolean;
}

/**
 * Interface for individual project stages.
 */
export interface ProjectStage {
  id: string;
  title: I18nString;
  subtitle?: I18nString;
  dateLabel?: string;
  description: I18nString;
  highlights: string[];
  media: {
    coverId?: string;
    galleryIds: string[];
    videoId?: string;
    posterId?: string;
  };
}

export interface Project {
  id: string;
  slug?: string;
  title: I18nString;
  summary: I18nString;
  timelineDate: string;
  clientBrief?: I18nString;
  ourSolution?: I18nString;
  result?: I18nString;
  metrics?: { duration: string; finish: string; materials: string; hardware: string; services: string[]; };
  heroConfig?: { mode: 'image' | 'video'; imageId?: string; videoId?: string; posterId?: string; overlay: { intensity: number; vignette: boolean; grain: boolean; }; };
  stages?: ProjectStage[];
  albums?: { id: string; title: I18nString; description?: I18nString; mediaIds: string[]; }[];
  techSpecs?: { label: string; value: string }[];
  projectType: string;
  location: I18nString;
  tags?: string[];
  isFeatured?: boolean;
  publishedAt: string;
  coverMediaId: string | null;
  isPublished: boolean;
  isVisible?: boolean; // Added for admin visibility toggle
  createdAt: string;
  updatedAt: string;
  agentId?: string; // Added for agent tracking
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
  seo: { title: I18nString; description: I18nString; };
  isPublished: boolean;
  order: number;
  updatedAt: string;
}

export interface SectionBlock {
  id: string;
  type: 'text' | 'imageText' | 'cards' | 'steps' | 'cta' | 'galleryStrip' | 'faq' | 'testimonials';
  content: any;
  order: number;
}

export interface Lead {
  id: string;
  type: 'general' | 'project-feedback';
  projectRef?: { id: string; title: string };
  rating?: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string; 
  category?: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'won' | 'lost' | 'approved' | 'archived'; 
  userAgent?: string;
  currentUrl?: string;
}

export interface AppDB {
  version?: number;
  settings: Settings;
  about: AboutPageData;
  contact: ContactPageData;
  reviews: Review[];
  projects: Project[];
  services: ServicePage[];
  processSteps: ProcessStep[];
  media: Media[];
  pages: Page[];
  leads: Lead[];
  offerTemplates: OfferTemplate[];
  offers: Offer[];
}

export interface OfferTemplate {
  id: string;
  name: string;
  layout: 'grid' | 'masonry' | 'carousel';
  theme: 'light' | 'dark' | 'gold';
  defaultTitle: string;
  defaultMessage: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  logoUrl?: string;
  createdBy?: string; // username of the creator
  createdAt: string;
}

export interface Offer {
  id: string;
  templateId: string;
  agentId: string; // username of the agent
  clientEmail: string;
  subject: string;
  message: string; // Personalized message for this offer
  images: string[]; // URLs of selected images
  viewCount: number;
  createdAt: string;
  status: 'sent' | 'viewed' | 'archived';
}

declare module 'react' {
  interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}

export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly DEV: boolean;
  // more env variables...
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
