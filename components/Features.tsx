import React from 'react';
import { Aperture, Clock, Heart } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-stone-300 dark:bg-stone-900 overflow-hidden relative z-10">
                <img src="https://picsum.photos/800/1000?random=20" alt="Photographer at work" className="w-full h-full object-cover grayscale-[20%]" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-stone-900 dark:bg-stone-800 z-0 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-full h-full border border-stone-400 dark:border-stone-700 z-20 hidden md:block"></div>
          </div>

          <div className="lg:col-span-1"></div>

          <div className="lg:col-span-6 space-y-12">
            <div>
              <div className="flex items-center gap-6 mb-8">
                <span className="w-12 h-px bg-stone-900 dark:bg-champagne"></span>
                <span className="text-stone-900 dark:text-champagne text-xs md:text-sm uppercase tracking-[0.6em] font-bold block italic">Why Choose Us ?</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-stone-100 mb-6 leading-tight">The Art of Seeing</h2>
              <p className="font-sans text-stone-600 dark:text-stone-400 text-lg leading-relaxed">
                We don't just take pictures; we craft heirlooms. Our philosophy is rooted in the belief that every fleeting moment holds a universe of emotion waiting to be preserved.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <Aperture className="w-10 h-10 text-stone-800 dark:text-champagne" strokeWidth={1} />
                 <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Cinematic Vision</h3>
                 <p className="text-stone-600 dark:text-stone-500 text-sm leading-relaxed">Using natural light and architectural composition to turn ordinary scenes into cinematic stills.</p>
               </div>
               <div className="space-y-4">
                 <Heart className="w-10 h-10 text-stone-800 dark:text-champagne" strokeWidth={1} />
                 <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Emotive Connection</h3>
                 <p className="text-stone-600 dark:text-stone-500 text-sm leading-relaxed">We focus on the raw, unscripted connection between subjects, ensuring authenticity reigns supreme.</p>
               </div>
               <div className="space-y-4">
                 <Clock className="w-10 h-10 text-stone-800 dark:text-champagne" strokeWidth={1} />
                 <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">Timeless Editing</h3>
                 <p className="text-stone-600 dark:text-stone-500 text-sm leading-relaxed">Our post-processing style is resistant to fads. Clean, rich, and true-to-life tones that age gracefully.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};