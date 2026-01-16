
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-square' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Adăugăm parametri de optimizare dacă sunt link-uri de Unsplash pentru a servi WebP/dimensiuni corecte
  const optimizedSrc = src.includes('unsplash.com') 
    ? `${src.split('?')[0]}?auto=format,compress&q=75&w=1000` 
    : src;

  return (
    <div className={`relative overflow-hidden bg-surface-2 ${aspectRatio} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out-expo ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-sm'
        }`}
      />
    </div>
  );
};
