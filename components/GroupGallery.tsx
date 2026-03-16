import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Group, ImageItem } from '../types';
import { Slideshow } from './Slideshow';

interface GroupGalleryProps {
  group: Group;
  onBack: () => void;
}

/**
 * LazyImage Component
 * Handles intersection-based loading and smooth entry animations
 */
const LazyImage: React.FC<{ 
  image: ImageItem; 
  index: number; 
  onClick: () => void 
}> = ({ image, index, onClick }) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px' } // Load slightly before coming into view
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef}
      className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-stone-100 dark:bg-stone-900 masonry-item mb-4 md:mb-8 lg:mb-12"
      onClick={onClick}
    >
      <div className={`relative overflow-hidden shadow-sm transition-all duration-700 ${isLoaded ? 'shadow-sm group-hover:shadow-2xl' : 'opacity-0'}`}>
        {isIntersecting && (
          <img 
            src={image.url} 
            alt={image.caption || `Gallery image ${index + 1}`}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-auto object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        {/* Visual Overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all duration-700" />
        
        {/* Caption Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
              {image.caption || "View Full Resolution"}
            </p>
        </div>
      </div>
      
      {/* Placeholder / Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900/50 animate-pulse">
           <Camera size={20} className="text-stone-300 dark:text-stone-800" strokeWidth={1} />
        </div>
      )}
    </div>
  );
};

export const GroupGallery: React.FC<GroupGalleryProps> = ({ group, onBack }) => {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const openSlide = (index: number) => {
    setInitialSlide(index);
    setSlideshowOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-20 pb-24 animate-fade-in transition-colors duration-500">
      <div className="container mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-stone-900 dark:text-stone-100 hover:opacity-70 transition-all mb-16 uppercase text-[10px] font-bold tracking-[0.4em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Collection</span>
        </button>

        <header className="mb-16 md:mb-32 max-w-4xl relative">
          <div className="absolute -left-12 top-0 h-full w-px bg-stone-200 dark:bg-stone-900 hidden lg:block" />
          <span className="block text-stone-700 dark:text-stone-300 uppercase tracking-[0.4em] text-[10px] font-bold mb-6 italic">
            {group.location} — {group.date}
          </span>
          <h1 className="font-serif text-5xl md:text-8xl text-stone-900 dark:text-stone-100 mb-8 md:mb-10 leading-[0.9] tracking-tighter">
            {group.title}
          </h1>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <p className="font-sans text-stone-600 dark:text-stone-300 text-lg leading-relaxed max-w-xl">
              {group.description}
            </p>
            <div className="flex items-center gap-3 text-stone-400 dark:text-stone-700 shrink-0 mt-2">
              <Camera size={24} strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Lumina Captured</span>
            </div>
          </div>
        </header>

        {/* High-Density Optimized Masonry Layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-8 lg:gap-12">
          {group.images.map((img, index) => (
            <LazyImage 
              key={img.id}
              image={img}
              index={index}
              onClick={() => openSlide(index)}
            />
          ))}
        </div>

        {/* Narrative Footer */}
        <div className="mt-32 pt-16 border-t border-stone-200 dark:border-stone-900 flex flex-col items-center justify-center text-center">
           <p className="text-stone-600 dark:text-stone-400 uppercase tracking-[0.4em] text-[10px] font-bold mb-8 italic">End of Visual Narrative</p>
           <button 
             onClick={onBack}
             className="px-10 py-5 border border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900 transition-all uppercase tracking-[0.3em] text-[10px] font-bold rounded-full"
           >
             Return to Collection
           </button>
        </div>

        <Slideshow 
          images={group.images}
          isOpen={slideshowOpen}
          onClose={() => setSlideshowOpen(false)}
          initialIndex={initialSlide}
        />
      </div>
      
      <style>{`
        .masonry-item {
          animation: masonryFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        
        @keyframes masonryFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};