import React from 'react';
import { ArrowUpRight, MapPin, ArrowRight } from 'lucide-react';
import { CollectionItem, ImageItem } from '../types';

interface CollectionsProps {
  onViewAll: () => void;
  onSelectCollection: (id: number) => void;
  collections: any[];
}

export const Collections: React.FC<CollectionsProps> = ({ onViewAll, onSelectCollection, collections }) => {
  const featured = collections
    .filter(c => c.isFeatured)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getImages = (collection: CollectionItem): ImageItem[] => {
    if (!collection.groups.length) return [];
    const images = collection.groups.flatMap(g => [g.previewImages[0], g.previewImages[1]]).filter(Boolean);
    if (images.length < 3) return [...images, ...collection.groups[0].images.slice(0, 3 - images.length)];
    return images;
  };

  return (
    <section id="portfolio" className="pt-24 md:pt-48 pb-12 md:pb-24 bg-stone-50 dark:bg-stone-950 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        {/* Header - Optimized for Left Alignment */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 md:mb-32">
          <div className="relative max-w-2xl">
            <h2 className="font-serif text-5xl md:text-8xl text-stone-900 dark:text-stone-100 leading-[0.9] tracking-tight text-left">
              Selected <span className="italic">Visual</span> <br/> Chronicles
            </h2>
          </div>
          <div className="mt-8 md:mt-0 text-left">
             <p className="text-stone-500 dark:text-stone-400 font-sans text-sm md:text-base max-w-xs mb-6 md:mb-8 leading-relaxed text-left">
               A curated selection of commissions that define our pursuit of light and human connection.
             </p>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="flex flex-col gap-32 md:gap-72">
          {featured.map((item, index) => {
            const images = getImages(item);
            const isEven = index % 2 === 0;
            const displayNumber = (index + 1).toString().padStart(2, '0');

            return (
              <div 
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => onSelectCollection(item.id)}
              >
                <div className={`flex flex-col lg:flex-row items-center gap-0 lg:gap-0 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Visual metadata - Vertical (Desktop Only) */}
                  <div className={`hidden lg:flex flex-col justify-between h-[500px] text-stone-300 dark:text-stone-800 uppercase tracking-[0.5em] text-[10px] py-4 ${isEven ? 'mr-12' : 'ml-12'}`}>
                     <span className="vertical-text origin-top-left">EST. {new Date().getFullYear()}</span>
                     <span className="vertical-text origin-top-left flex items-center gap-2"><MapPin size={10} /> WORLDWIDE</span>
                  </div>

                  {/* Image Block */}
                  <div className="w-full lg:w-7/12 relative">
                      {/* Mobile Badge */}
                      <div className="lg:hidden absolute top-4 left-4 z-20 bg-stone-900/80 backdrop-blur-md text-white text-[10px] px-3 py-1 font-bold tracking-widest uppercase">
                        {displayNumber}
                      </div>

                      <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-xl">
                        <img 
                          src={images[0]?.url || item.imageUrl} 
                          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-700" />
                      </div>
                      
                      {/* Secondary Overlap Image (Desktop Only) */}
                      {images[1] && (
                        <div className={`absolute w-1/3 aspect-[3/4] hidden lg:block overflow-hidden shadow-2xl z-20 border-[12px] border-stone-50 dark:border-stone-900 transition-all duration-1000 ease-in-out
                            ${isEven ? '-bottom-24 -right-12 group-hover:-translate-y-8' : '-top-24 -left-12 group-hover:translate-y-8'}`}>
                            <img src={images[1].url} className="w-full h-full object-cover" alt="" />
                        </div>
                      )}
                  </div>

                  {/* Text Block / CTA Card */}
                  <div className={`w-[92%] lg:w-5/12 -mt-16 lg:mt-0 mx-auto lg:mx-0 ${isEven ? 'lg:-ml-24' : 'lg:-mr-24'} z-30`}>
                      <div className="bg-white dark:bg-stone-900 p-8 md:p-16 border border-stone-100 dark:border-stone-800 shadow-2xl transition-all duration-700 group-hover:lg:-translate-y-4">
                         <div className="flex items-center gap-4 mb-6 md:mb-8">
                           <span className="w-8 h-px bg-stone-900 dark:bg-stone-100"></span>
                           <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 dark:text-stone-500 uppercase">{item.category}</span>
                         </div>
                         <h3 className="font-serif text-4xl md:text-6xl text-stone-900 dark:text-stone-100 mb-6 md:mb-8 leading-[1.1] tracking-tight">
                            {item.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="italic block lg:pl-8">{word}</span> : word + ' ')}
                         </h3>
                         <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base leading-relaxed mb-10 md:mb-12 max-w-sm">
                            {item.description || "A deep dive into visual narratives, capturing moments where light meets emotion in the most authentic way possible."}
                         </p>
                         
                         {/* Clear Button CTA - Responses to the parent .group hover state */}
                         <div className="inline-flex items-center gap-6 px-8 py-4 border border-stone-200 dark:border-stone-800 transition-all duration-500 group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:border-transparent cursor-pointer">
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 dark:text-stone-100 group-hover:text-white dark:group-hover:text-stone-900 transition-colors">View Collection</span>
                            <ArrowRight size={16} className="text-stone-400 group-hover:text-white dark:group-hover:text-stone-900 group-hover:translate-x-2 transition-all" />
                         </div>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End of Featured Section */}
        <div className="mt-32 md:mt-56 flex flex-col items-center justify-center transition-all duration-700">
          <p className="text-stone-400 dark:text-stone-600 uppercase tracking-[0.4em] text-[10px] font-bold mb-10">
            End of Featured Selection
          </p>
          
          {/* Enhanced Archive CTA Button - Inversion Hover Effect */}
          <button 
            onClick={onViewAll}
            className="group relative px-14 py-7 md:px-16 md:py-8 transition-all duration-500 bg-stone-900 dark:bg-stone-100 rounded-full shadow-2xl animate-breathe cursor-pointer border-2 border-transparent hover:border-stone-900 dark:hover:border-stone-100 hover:bg-stone-50 dark:hover:bg-stone-950"
          >
            {/* Outline Glow Border */}
            <div className="absolute inset-0 border border-white/10 dark:border-stone-900/10 rounded-full group-hover:border-transparent transition-colors"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <span className="uppercase tracking-[0.4em] text-[11px] md:text-xs font-bold text-stone-50 dark:text-stone-950 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                Explore All Collections
              </span>
              <div className="p-2.5 bg-white/10 dark:bg-stone-900/10 rounded-full group-hover:bg-stone-900/10 dark:group-hover:bg-stone-100/10 transition-colors">
                <ArrowUpRight 
                  size={20} 
                  className="text-stone-50 dark:text-stone-950 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors" 
                />
              </div>
            </div>
          </button>
        </div>

      </div>
      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};