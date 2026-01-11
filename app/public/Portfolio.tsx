
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Project, Media } from '../../types';
import { dbService } from '../../services/db';
import { Skeleton } from '../../components/ui/Skeleton';

export const Portfolio: React.FC = () => {
  const { t, lang } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const p = await dbService.getProjects();
      const m = await dbService.getMedia();
      setProjects(p.filter(proj => proj.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      setMedia(m);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCoverUrl = (projectId: string, coverId: string | null) => {
    if (coverId) {
      const found = media.find(m => m.id === coverId);
      if (found) return found.url;
    }
    const first = media.find(m => m.projectId === projectId);
    return first ? first.url : 'https://picsum.photos/800/600';
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-2">Our Work</span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Timeline Proiecte</h1>
        <p className="max-w-2xl text-muted text-lg">
          {lang === 'ro' 
            ? 'O cronologie a execuțiilor noastre. Fiecare proiect este un parteneriat între viziune și precizie.' 
            : 'A timeline of our executions. Every project is a partnership between vision and precision.'}
        </p>
      </div>

      <div className="relative border-l border-border pl-8 md:pl-20 space-y-24">
        {loading ? (
          [1,2].map(i => <Skeleton key={i} className="h-96 w-full" />)
        ) : (
          projects.map((proj, idx) => (
            <div key={proj.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] md:-left-[89px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background group-hover:scale-125 transition-transform"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 flex flex-col justify-center">
                  <span className="text-sm font-mono text-muted mb-4">
                    {new Date(proj.publishedAt).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { year: 'numeric', month: 'long' })}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 group-hover:text-accent transition-colors">
                    {t(proj.title)}
                  </h2>
                  <p className="text-muted mb-8 line-clamp-3">
                    {t(proj.summary)}
                  </p>
                  <div className="flex items-center space-x-6">
                    <span className="text-xs uppercase tracking-widest font-bold py-1 px-3 bg-surface-2 border border-border">
                      {proj.projectType}
                    </span>
                    <Link to={`/proiect/${proj.id}`} className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:border-accent hover:text-accent transition-all">
                      Vezi Detalii
                    </Link>
                  </div>
                </div>
                
                <div className="md:col-span-7 aspect-[16/10] overflow-hidden bg-surface-2">
                  <img 
                    src={getCoverUrl(proj.id, proj.coverMediaId)} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                    alt=""
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
