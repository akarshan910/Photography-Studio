import React from 'react';
import { Instagram, Facebook, Twitter, Camera, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900 dark:border-stone-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
           <div className="flex items-center gap-2 mb-6 md:mb-0">
             <Camera className="w-8 h-8 text-stone-100" strokeWidth={1} />
             <span className="font-display text-3xl tracking-widest text-stone-100">LUMINA</span>
           </div>
           
           <div className="flex gap-8">
             <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
             <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
             <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-stone-800 pt-12">
           <div>
             <h4 className="text-white uppercase tracking-widest mb-6 font-display text-sm">Studio</h4>
             <ul className="space-y-2 text-xs">
               <li><a href="#" className="hover:text-white transition-colors">About</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Journal</a></li>
               <li><button onClick={onNavigateAdmin} className="hover:text-white transition-colors flex items-center gap-2"><Lock size={12} /> Management</button></li>
             </ul>
           </div>
           
           <div>
             <h4 className="text-white uppercase tracking-widest mb-6 font-display text-sm">Collections</h4>
             <ul className="space-y-2 text-xs">
               <li><a href="#" className="hover:text-white transition-colors">Weddings</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Portraits</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Editorial</a></li>
             </ul>
           </div>

           <div>
             <h4 className="text-white uppercase tracking-widest mb-6 font-display text-sm">Information</h4>
             <ul className="space-y-2 text-xs">
               <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
               <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
             </ul>
           </div>

           <div>
             <h4 className="text-white uppercase tracking-widest mb-6 font-display text-sm">Newsletter</h4>
             <p className="text-[10px] mb-4">Subscribe for latest updates and availability.</p>
             <div className="flex border-b border-stone-700 pb-2">
               <input type="email" placeholder="Email Address" className="bg-transparent w-full focus:outline-none text-stone-200 placeholder-stone-600 text-xs" />
               <button className="uppercase text-[10px] tracking-widest text-white hover:text-stone-300 font-bold">Join</button>
             </div>
           </div>
        </div>

        <div className="text-center mt-16 text-[10px] tracking-[0.3em] uppercase opacity-40">
          &copy; {new Date().getFullYear()} Lumina Photography. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};