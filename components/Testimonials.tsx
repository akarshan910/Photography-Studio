import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonialService, ExtendedTestimonial } from '../services/testimonialService';

export const Testimonials: React.FC = () => {
  const [data, setData] = useState<ExtendedTestimonial[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    testimonialService.getAll().then(setData);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current || data.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, data.length - 1));
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: width * safeIndex,
      behavior: 'smooth'
    });
  };

  if (!data.length) return null;

  return (
    <section className="py-32 md:py-48 bg-white dark:bg-stone-950 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-stone-50 dark:bg-stone-900/30 -z-10" />
      <div className="container mx-auto px-6">
        
        {/* Testimonials Header - Minimalist Editorial */}
        <div className="mb-24 md:mb-32 max-w-4xl text-left">
          <span className="text-stone-400 dark:text-stone-600 text-[10px] uppercase tracking-[0.5em] font-bold block mb-6 italic">Client Chronicles</span>
          <h2 className="font-serif text-5xl md:text-8xl text-stone-900 dark:text-stone-100 leading-[0.9] tracking-tighter text-left">
            Kind <span className="italic text-stone-400 dark:text-stone-500 font-normal">Testimonials</span>
          </h2>
        </div>

        <div className="relative">
          {/* Scroll Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.map((item, idx) => (
              <div key={item.id} className="min-w-full snap-center py-10 px-4 md:px-0">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 max-w-7xl mx-auto">
                  
                  {/* Image Frame - Large Editorial Presence */}
                  <div className="w-full lg:w-5/12 relative group shrink-0">
                    <div className="aspect-[3/4] overflow-hidden relative z-10 bg-stone-200 dark:bg-stone-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-[1.5s] ease-out group-hover:shadow-stone-900/20">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
                    </div>
                    {/* Floating Quote Block */}
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 md:w-32 md:h-32 bg-stone-900 dark:bg-stone-100 z-20 flex items-center justify-center text-white dark:text-stone-900 shadow-2xl">
                      <Quote size={window.innerWidth < 768 ? 24 : 44} strokeWidth={1} />
                    </div>
                  </div>

                  {/* Quote Content - Enhanced Typography */}
                  <div className="w-full lg:w-7/12 flex flex-col justify-center text-left">
                    <div className="max-w-2xl">
                      <div className="flex gap-2 text-stone-300 dark:text-stone-800 mb-12">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                      
                      <blockquote className="min-h-[220px] md:min-h-[300px] mb-16">
                        <p className="font-serif italic font-medium text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-stone-800 dark:text-stone-100 tracking-tight">
                          “{item.quote}”
                        </p>
                      </blockquote>
                      
                      <div className="pt-12 border-t border-stone-100 dark:border-stone-900 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                          <h4 className="font-display text-2xl md:text-3xl text-stone-900 dark:text-stone-100 tracking-[0.1em] mb-3">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-px bg-stone-300 dark:bg-stone-700"></div>
                             <p className="font-sans text-stone-400 dark:text-stone-500 text-[11px] uppercase tracking-[0.4em] font-bold">
                                {item.role}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Navigation Controls */}
          <div className="flex items-center justify-center lg:justify-start lg:ml-[48%] gap-12 mt-20">
            <button 
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="group flex items-center gap-4 text-stone-400 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-20 transition-all active:scale-90"
              aria-label="Previous testimonial"
            >
              <div className="p-5 border border-stone-200 dark:border-stone-800 rounded-full group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-white dark:group-hover:text-stone-900 transition-all duration-500">
                <ChevronLeft size={18} />
              </div>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold">Prev</span>
            </button>
            
            {/* Elegant Line Progress */}
            <div className="flex items-center gap-4">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-[1px] transition-all duration-[1.2s] ease-in-out ${activeIndex === i ? 'w-20 bg-stone-900 dark:bg-stone-100' : 'w-4 bg-stone-200 dark:bg-stone-800'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={activeIndex === data.length - 1}
              className="group flex items-center gap-4 text-stone-400 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-20 transition-all active:scale-90"
              aria-label="Next testimonial"
            >
              <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold">Next</span>
              <div className="p-5 border border-stone-200 dark:border-stone-800 rounded-full group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-white dark:group-hover:text-stone-900 transition-all duration-500">
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
