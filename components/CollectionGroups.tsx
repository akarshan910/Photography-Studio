import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { CollectionItem } from '../types';
import { Slideshow } from './Slideshow';

interface CollectionGroupsProps {
  collection: CollectionItem;
  onSelectGroup: (groupId: number) => void;
  onBack: () => void;
}

export const CollectionGroups: React.FC<CollectionGroupsProps> = ({ collection, onSelectGroup, onBack }) => {
  const [quickViewImage, setQuickViewImage] = React.useState<{isOpen: boolean, images: any[], index: number}>({ isOpen: false, images: [], index: 0 });

  const handleQuickView = (e: React.MouseEvent, images: any[], index: number) => {
    e.stopPropagation();
    setQuickViewImage({ isOpen: true, images, index });
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pt-20 pb-24 animate-fade-in transition-colors duration-500">
      <div className="container mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-stone-900 dark:text-stone-100 hover:opacity-70 transition-all mb-12 uppercase text-[10px] font-bold tracking-[0.4em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Archives</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b border-stone-200 dark:border-stone-900 pb-12">
           <div className="max-w-2xl">
             <h1 className="font-serif text-5xl md:text-8xl text-stone-900 dark:text-stone-100 leading-[0.9] tracking-tight">{collection.title}</h1>
           </div>
           <p className="max-w-sm text-stone-500 dark:text-stone-400 mt-8 md:mt-0 font-sans text-sm md:text-base leading-relaxed">
             {collection.description}
           </p>
        </div>

        <div className="space-y-24 md:space-y-56">
          {collection.groups.map((group, index) => (
            <div key={group.id} className="group-card relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                
                {/* 3-Image Collage Layout - Rich thumbnail on mobile */}
                <div 
                  className={`lg:col-span-7 cursor-pointer order-1 ${index % 2 === 1 ? 'lg:order-last' : ''}`} 
                  onClick={() => onSelectGroup(group.id)}
                >
                   <div className="grid grid-cols-12 gap-2 md:gap-4 h-[250px] md:h-[500px] lg:h-[600px]">
                      {/* Main Large Image */}
                      <div className="col-span-8 h-full overflow-hidden bg-stone-200 dark:bg-stone-900 relative group shadow-xl">
                        <img 
                          src={group.previewImages[0]?.url} 
                          alt="Preview Main" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                          onClick={(e) => handleQuickView(e, group.previewImages, 0)}
                        />
                        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-all duration-500" />
                      </div>
                      
                      {/* Stacked Side Images */}
                      <div className="col-span-4 flex flex-col gap-2 md:gap-4 h-full">
                        <div className="h-1/2 overflow-hidden bg-stone-200 dark:bg-stone-900 relative group shadow-lg">
                           <img 
                             src={group.previewImages[1]?.url} 
                             alt="Preview Top" 
                             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                             onClick={(e) => handleQuickView(e, group.previewImages, 1)}
                           />
                           <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-all duration-500" />
                        </div>
                        <div className="h-1/2 overflow-hidden bg-stone-200 dark:bg-stone-900 relative group shadow-lg">
                           <img 
                             src={group.previewImages[2]?.url} 
                             alt="Preview Bottom" 
                             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                             onClick={(e) => handleQuickView(e, group.previewImages, 2)}
                           />
                           <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <span className="text-white uppercase text-[8px] md:text-[10px] font-bold tracking-[0.3em] border border-white/30 px-3 py-1.5 md:px-4 md:py-2 bg-black/20 backdrop-blur-sm">View</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Text Info & CTA */}
                <div className={`lg:col-span-5 flex flex-col justify-center order-2 ${index % 2 === 1 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="w-6 h-px bg-stone-300 dark:bg-stone-800"></span>
                      <span className="text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">{group.date} — {group.location}</span>
                   </div>
                   <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 mb-4 md:mb-6 leading-tight tracking-tight">{group.title}</h3>
                   <p className="text-stone-500 dark:text-stone-400 mb-10 md:mb-12 leading-relaxed font-sans text-sm md:text-base max-w-md">{group.description}</p>
                   
                   {/* Improved CTA Button - Pill Style with Inversion */}
                   <button 
                     onClick={() => onSelectGroup(group.id)}
                     className="group/btn relative inline-flex items-center gap-6 px-10 py-5 rounded-full border border-stone-300 dark:border-stone-800 self-start text-stone-900 dark:text-stone-100 hover:bg-stone-900 dark:hover:bg-stone-100 transition-all duration-500"
                   >
                     <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.3em] group-hover/btn:text-white dark:group-hover/btn:text-stone-900 transition-colors">
                       Explore Gallery
                     </span>
                     <div className="relative z-10 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-full group-hover/btn:bg-white/10 dark:group-hover/btn:bg-stone-900/10 transition-colors">
                        <ArrowUpRight 
                          size={16} 
                          className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:text-white dark:group-hover/btn:text-stone-900 transition-all duration-300" 
                        />
                     </div>
                   </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick View Slideshow for preview images */}
      <Slideshow 
         images={quickViewImage.images} 
         initialIndex={quickViewImage.index}
         isOpen={quickViewImage.isOpen}
         onClose={() => setQuickViewImage({ ...quickViewImage, isOpen: false })}
      />
    </div>
  );
};