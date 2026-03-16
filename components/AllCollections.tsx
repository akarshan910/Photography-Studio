import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { CollectionItem } from '../types';

interface AllCollectionsProps {
  collections: CollectionItem[];
  onSelectCollection: (id: number) => void;
  onBack: () => void;
}

export const AllCollections: React.FC<AllCollectionsProps> = ({ collections, onSelectCollection, onBack }) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-20 pb-24 animate-fade-in transition-colors duration-500">
      <div className="container mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-stone-900 dark:text-stone-100 hover:opacity-70 transition-all mb-20 uppercase text-[10px] font-bold tracking-[0.4em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Return Home</span>
        </button>

        <header className="mb-20">
          <h1 className="font-serif text-6xl md:text-8xl text-stone-900 dark:text-stone-100 leading-[0.9] tracking-tighter">
            The <span className="italic">Complete</span> <br/> Archives
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {collections.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer flex flex-col"
              onClick={() => onSelectCollection(item.id)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-200 dark:bg-stone-900 mb-8 relative shadow-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              
              <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-3">
                      <span className="w-6 h-px bg-stone-300 dark:bg-stone-800"></span>
                      <p className="text-stone-400 dark:text-stone-500 text-[10px] uppercase tracking-[0.3em] font-bold">{item.category}</p>
                   </div>
                   <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mb-4 transition-colors group-hover:text-stone-600 dark:group-hover:text-stone-300">{item.title}</h2>
                   <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm line-clamp-2">
                     {item.description || "An immersive journey through light and narrative, exploring the profound beauty of captured moments."}
                   </p>
                </div>

                {/* Dark CTA Arrow with Expand-Collapse Animation */}
                <div className="relative shrink-0 mt-2">
                  <div className="w-14 h-14 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-stone-800 dark:group-hover:bg-white overflow-hidden">
                    <div className="animate-pulse-subtle">
                      <ArrowUpRight 
                        size={20} 
                        className="text-stone-50 dark:text-stone-900 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                      />
                    </div>
                  </div>
                  {/* Outer ring for extra clickability feel */}
                  <div className="absolute inset-0 rounded-full border border-stone-900/10 dark:border-white/10 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer Note */}
        <div className="mt-40 pt-16 border-t border-stone-200 dark:border-stone-900 flex flex-col items-center">
           <p className="text-stone-400 dark:text-stone-600 uppercase tracking-[0.4em] text-[9px] font-bold mb-4 italic">Curation in Progress</p>
           <div className="w-px h-16 bg-gradient-to-b from-stone-200 dark:from-stone-800 to-transparent"></div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.85); opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};