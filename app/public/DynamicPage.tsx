
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Page } from '../../types';
import { PageRenderer } from './PageRenderer';
import { Skeleton } from '../../components/ui/Skeleton';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      dbService.getPageBySlug(slug).then(p => {
        setPage(p || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return (
    <div className="pt-20">
      <Skeleton className="h-[60vh] w-full" />
      <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

  if (!page) return <Navigate to="/" replace />;

  return <PageRenderer page={page} />;
};
