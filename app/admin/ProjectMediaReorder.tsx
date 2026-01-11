
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Media, Project } from '../../types';

export const ProjectMediaReorder: React.FC = () => {
  const { id } = useParams();
  const [media, setMedia] = useState<Media[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      dbService.getProject(id).then(p => setProject(p || null));
      dbService.getMedia(id).then(m => setMedia(m.sort((a, b) => a.orderInProject - b.orderInProject)));
    }
  }, [id]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newMedia = [...media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMedia.length) return;

    [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
    
    // Update orders
    const updatedMedia = newMedia.map((m, i) => ({ ...m, orderInProject: i }));
    setMedia(updatedMedia);
  };

  const saveOrder = async () => {
    for (const m of media) {
      await dbService.upsertMedia(m);
    }
    alert('Ordine salvată!');
  };

  if (!project) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Ordonare Media: {project.title.ro}</h1>
        <button onClick={saveOrder} className="bg-accent text-white px-8 py-2 text-xs font-bold uppercase tracking-widest">
          Salvează Ordinea
        </button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {media.map((m, idx) => (
          <div key={m.id} className="bg-surface p-4 border border-border flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={m.url} className="w-16 h-16 object-cover border border-border" alt="" />
              <div>
                <p className="text-xs font-bold uppercase">{m.room}</p>
                <p className="text-[10px] text-muted">Stele: {m.stars}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => moveItem(idx, 'up')} className="p-2 hover:bg-surface-2">↑</button>
              <button onClick={() => moveItem(idx, 'down')} className="p-2 hover:bg-surface-2">↓</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
