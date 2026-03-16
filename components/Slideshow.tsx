import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageItem } from '../types';

interface SlideshowProps {
  images: ImageItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Slideshow: React.FC<SlideshowProps> = ({ images, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
      >
        <X size={32} />
      </button>

      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={handlePrev}
          className="pointer-events-auto p-4 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={48} />
        </button>
        <button 
          onClick={handleNext}
          className="pointer-events-auto p-4 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight size={48} />
        </button>
      </div>

      <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center pointer-events-none">
        <img 
          key={currentImage.id} // Key change forces animation reset
          src={currentImage.url} 
          alt={currentImage.caption || ''} 
          className="max-h-[85vh] max-w-full object-contain shadow-2xl animate-fade-in pointer-events-auto"
        />
        {currentImage.caption && (
          <p className="mt-6 text-stone-400 font-sans tracking-widest text-sm animate-fade-in">
            {currentImage.caption}
          </p>
        )}
        <p className="absolute bottom-6 left-6 text-stone-600 font-display text-xs tracking-widest">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};
