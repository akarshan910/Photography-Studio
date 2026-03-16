import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Equipment: React.FC = () => {
  const gear = [
    {
      id: 1,
      name: "Fujifilm X-E5",
      type: "Primary Body",
      description: "A compact masterpiece of tactile photography, delivering film-like textures with modern precision.",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800", // Generic high-quality camera body
      specs: ["40MP X-Trans Sensor", "Classic Chrome Science", "Ultralight Chassis"]
    },
    {
      id: 2,
      name: "35mm f/2 Fujifilm Lens",
      type: "Prime Optic",
      description: "The 'everyday' lens that mimics the human eye. Fast, sharp, and undeniably characterful.",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800", // Generic lens photo
      specs: ["f/2.0 Maximum Aperture", "Weather Sealed", "Silent Focusing"]
    }
  ];

  return (
    <section className="py-24 bg-stone-100 dark:bg-stone-900 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20">
          <div className="max-w-2xl">
            <span className="text-stone-400 dark:text-stone-500 text-[10px] uppercase tracking-[0.4em] font-bold block mb-4">Precision Tools</span>
            <h2 className="font-serif text-5xl md:text-7xl text-stone-900 dark:text-stone-100 leading-tight tracking-tight text-left">
              The <span className="italic">Equipment</span>
            </h2>
          </div>
          <p className="mt-8 md:mt-0 text-stone-500 dark:text-stone-400 max-w-xs font-sans text-sm leading-relaxed text-left">
            Minimalist gear for maximalist expression. We believe the best tools are those that disappear, leaving only the moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {gear.map((item) => (
            <div key={item.id} className="group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-stone-200 dark:bg-stone-800 mb-8 relative shadow-xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-700" />
                
                {/* Tech Label Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md px-4 py-2 flex items-center gap-2">
                   <ShieldCheck size={14} className="text-stone-900 dark:text-champagne" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100">{item.type}</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-serif text-3xl text-stone-900 dark:text-stone-100">{item.name}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {item.specs.map((spec, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};