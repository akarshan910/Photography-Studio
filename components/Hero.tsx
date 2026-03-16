import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { Slide } from '../types';

interface HeroProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
}

const slides: Slide[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000',
    title: 'Ethereal Moments',
    subtitle: 'Capturing the unseen beauty of life',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000',
    title: 'Timeless Portraits',
    subtitle: 'Stories told through silence and light',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000',
    title: 'Urban Poetry',
    subtitle: 'Finding rhythm in the chaos',
  },
];

export const Hero: React.FC<HeroProps> = ({ isPlaying, onToggleAudio, isShuffle, onToggleShuffle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-stone-900">
      {/* Slider Content */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
            <div className="overflow-hidden mb-4">
              <h2 className={`font-sans text-xs md:text-sm tracking-[0.6em] uppercase transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                   index === currentSlide ? 'translate-y-0 opacity-100 blur-0 tracking-[0.5em]' : 'translate-y-full opacity-0 blur-md tracking-[1.2em]'
              }`}>
                {slide.subtitle}
              </h2>
            </div>
            
            <div className="overflow-hidden">
              <h1 className={`font-display text-5xl md:text-8xl lg:text-[9rem] leading-tight transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) delay-200 ${
                   index === currentSlide ? 'translate-y-0 opacity-100 scale-100 tracking-tight' : 'translate-y-full opacity-0 scale-95 tracking-[-0.05em]'
              }`}>
                {slide.title}
              </h1>
            </div>
            
            <div className={`w-24 h-px bg-white/30 mt-12 transition-all duration-[2000ms] delay-500 ${index === currentSlide ? 'w-24 opacity-100' : 'w-0 opacity-0'}`} />
          </div>
        </div>
      ))}

      {/* Control Bar - Redesigned for Side-by-Side Audio & Nav */}
      <div className="absolute bottom-12 left-0 w-full z-40 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center text-white">
          
          {/* Left Side: Navigation Arrows */}
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="group p-4 border border-white/20 hover:bg-white/10 rounded-full backdrop-blur-md transition-all duration-500 active:scale-90"
              aria-label="Previous Slide"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={nextSlide}
              className="group p-4 border border-white/20 hover:bg-white/10 rounded-full backdrop-blur-md transition-all duration-500 active:scale-90"
              aria-label="Next Slide"
            >
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Side: Audio Controls (Shuffle & Volume) */}
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
             <button 
               onClick={onToggleShuffle}
               className={`transition-all duration-500 hover:scale-110 active:rotate-12 ${isShuffle ? 'text-champagne drop-shadow-[0_0_8px_rgba(247,231,206,0.5)]' : 'text-white/40 hover:text-white/70'}`}
               title={isShuffle ? "Shuffle Active" : "Shuffle Disabled"}
             >
               <Shuffle size={18} />
             </button>
             
             <div className="w-px h-4 bg-white/10" />
             
             <button 
               onClick={onToggleAudio}
               className="flex items-center gap-3 group transition-all duration-500"
               aria-label={isPlaying ? "Mute Ambient" : "Unmute Ambient"}
             >
               <div className="relative flex items-center">
                 {isPlaying ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white/40" />}
               </div>
               {/* Label removed as per request */}
             </button>
          </div>

        </div>
      </div>

      {/* Narrative Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-40 overflow-hidden">
         <div 
           className="h-full bg-white/40"
           style={{ 
             animation: 'heroProgress 8s linear forwards' 
           }}
           key={currentSlide}
         />
      </div>
      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};