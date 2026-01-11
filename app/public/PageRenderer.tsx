
import React from 'react';
import { SectionBlock, Page } from '../../types';
import { useI18n } from '../../lib/i18n';

interface PageRendererProps {
  page: Page;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  const { t } = useI18n();

  const renderSection = (block: SectionBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <section key={block.id} className="py-20 px-6 max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-xl leading-relaxed font-light">{t(block.content.text)}</p>
            </div>
          </section>
        );
      case 'imageText':
        return (
          <section key={block.id} className={`py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${block.content.reverse ? 'md:flex-row-reverse' : ''}`}>
            <div className={block.content.reverse ? 'md:order-2' : ''}>
              <img src={block.content.imageUrl} className="w-full aspect-square object-cover border border-border" alt="" />
            </div>
            <div className={block.content.reverse ? 'md:order-1' : ''}>
              <h2 className="font-serif text-4xl mb-6">{t(block.content.title)}</h2>
              <p className="text-muted leading-relaxed">{t(block.content.body)}</p>
            </div>
          </section>
        );
      case 'cta':
        return (
          <section key={block.id} className="py-24 bg-accent text-white text-center">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="font-serif text-4xl md:text-5xl mb-8">{t(block.content.title)}</h2>
              <a href={block.content.link} className="inline-block px-10 py-4 bg-white text-accent font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all">
                {t(block.content.buttonLabel)}
              </a>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-20">
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src={page.hero.darkImageUrl} 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
          alt="" 
        />
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">{t(page.hero.title)}</h1>
          <p className="text-xl font-light text-muted">{t(page.hero.subtitle)}</p>
        </div>
      </header>
      {page.sections.sort((a, b) => a.order - b.order).map(renderSection)}
    </div>
  );
};
