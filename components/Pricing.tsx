import React, { useState, useEffect, useRef } from 'react';
import { pricingService } from '../services/pricingService';
import { PricingTier } from '../types';
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    pricingService.getAll().then(setTiers);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: width * index,
      behavior: 'smooth'
    });
  };

  if (tiers.length === 0) return null;

  return (
    <section id="pricing" className="py-32 md:py-48 bg-stone-50 dark:bg-stone-950 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl text-left mb-32">
          <span className="text-stone-400 dark:text-stone-600 text-[10px] uppercase tracking-[0.4em] font-bold block mb-6">Investment</span>
          <h2 className="font-serif text-5xl md:text-7xl text-stone-900 dark:text-stone-100 mb-8 leading-tight">Collections & <span className="italic">Rates</span></h2>
          <p className="text-stone-500 dark:text-stone-400 font-sans max-w-xl text-sm md:text-base leading-relaxed">
            Every story is unique. We offer curated packages designed to preserve your memories with the highest level of craftsmanship.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Scroll Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-8 pb-16 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tiers.map((tier, idx) => (
              <div 
                key={tier.name + idx} 
                className="min-w-full md:min-w-[calc(33.333%-1.5rem)] snap-center"
              >
                <div className={`relative h-full p-12 md:p-14 border transition-all duration-700 flex flex-col group ${
                  tier.recommended 
                    ? 'border-stone-900 dark:border-champagne bg-stone-900 dark:bg-stone-900 text-stone-50 shadow-2xl scale-[1.02]' 
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm hover:border-stone-400 dark:hover:border-stone-600'
                }`}>
                  
                  {tier.recommended && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-900 via-stone-400 dark:via-champagne to-stone-900 opacity-50" />
                  )}
                  
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="font-display text-lg uppercase tracking-[0.3em] mb-2">{tier.name}</h3>
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${tier.recommended ? 'text-stone-400 dark:text-champagne' : 'text-stone-400'}`}>
                        {tier.recommended ? 'Signature Experience' : 'Essential Collection'}
                      </p>
                    </div>
                    {tier.recommended && <Sparkles size={18} className="text-stone-400 dark:text-champagne" />}
                  </div>

                  <div className="flex items-baseline mb-12 pb-12 border-b border-current border-opacity-10">
                    <span className="text-6xl font-serif tracking-tighter">{tier.price}</span>
                    <span className="ml-3 text-[10px] uppercase tracking-widest opacity-60">Investment starting from</span>
                  </div>

                  <ul className="space-y-6 mb-16 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm opacity-80 group-hover:translate-x-1 transition-transform duration-300">
                        <Check size={14} className={`mt-0.5 shrink-0 ${tier.recommended ? 'text-stone-400 dark:text-champagne' : 'text-stone-900 dark:text-stone-400'}`} /> 
                        <span className="font-sans leading-relaxed tracking-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-6">
                    <button className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-bold border transition-all duration-500 rounded-sm ${
                      tier.recommended 
                        ? 'bg-white text-stone-900 border-transparent hover:bg-stone-200 dark:hover:bg-champagne' 
                        : 'bg-transparent text-stone-900 dark:text-stone-100 border-stone-900 dark:border-stone-700 hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900'
                    }`}>
                      Check Availability
                    </button>
                    <p className="text-center text-[9px] uppercase tracking-widest opacity-40 font-bold">
                      Limited Commissions per Year
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Wrapper */}
          <div className="flex flex-col items-center gap-12">
            
            {/* Indicators */}
            <div className="flex items-center gap-4">
               {tiers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-1 transition-all duration-700 rounded-full ${activeIndex === i ? 'w-16 bg-stone-900 dark:bg-stone-100' : 'w-4 bg-stone-200 dark:bg-stone-800 hover:bg-stone-400 dark:hover:bg-stone-600'}`}
                  aria-label={`View ${tiers[i].name} package`}
                />
              ))}
            </div>

            {/* Nav Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => scrollTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="w-12 h-12 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900 disabled:opacity-20 transition-all rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollTo(activeIndex + 1)}
                disabled={activeIndex === tiers.length - 1}
                className="w-12 h-12 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900 disabled:opacity-20 transition-all rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};