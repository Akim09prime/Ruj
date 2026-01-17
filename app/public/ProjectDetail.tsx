import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../../services/db';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const p = await dbService.getProject(id);
      const m = await dbService.getMedia(id);
      setProject(p || null);
      setMedia(m.sort((a, b) => b.stars - a.stars || a.orderInProject - b.orderInProject));
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (project) {
      document.title = `${t(project.title)} | CARVELLO`;
    }
  }, [project, t]);

  if (loading) return <div className="pt-40 px-6 max-w-7xl mx-auto"><Skeleton className="h-[60vh] w-full" /></div>;
  if (!project) return <div className="pt-40 text-center font-serif text-3xl">Proiectul nu a fost găsit.</div>;

  const coverImage = media.find(m => m.id === project.coverMediaId)?.url || media[0]?.url;

  return (
    <div className="pt-20">
      <div className="relative h-[60vh] overflow-hidden bg-surface-2">
        <img 
          src={coverImage} 
          className="w-full h-full object-cover opacity-60 grayscale"
          alt="" 
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 bg-gradient-to-t from-background via-transparent">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-accent uppercase tracking-widest text-xs font-bold mb-4 block">{project.projectType} — {t(project.location)}</span>
            <h1 className="font-serif text-5xl md:text-7xl mb-6">{t(project.title)}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-muted mb-6">Despre Proiect</h2>
            <p className="text-xl leading-relaxed font-light">{t(project.summary)}</p>
          </div>
          <div className="space-y-8 border-l border-border pl-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Locație</h4>
              <p className="font-medium">{t(project.location)}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">An Finalizare</h4>
              <p className="font-medium">{new Date(project.publishedAt).getFullYear()}</p>
            </div>
            <Link to="/cerere-oferta" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-accent pb-1 text-accent hover:opacity-80">
              Vreau ceva similar
            </Link>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {media.map((item) => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden cursor-zoom-in bg-surface-2"
              onClick={() => setSelectedImg(item.url)}
            >
              <img src={item.url} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-widest font-bold">Zoom</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
          <button className="absolute top-8 right-8 text-3xl">×</button>
        </div>
      )}
    </div>
  );
};