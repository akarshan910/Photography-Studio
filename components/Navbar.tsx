import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
  theme: string;
  onToggleTheme: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigateHome, 
  theme, 
  onToggleTheme, 
  currentView
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    onNavigateHome();
    setTimeout(() => {
       const element = document.querySelector(href);
       element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinks = [
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Philosophy', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#enquiry' },
  ];

  const isNavbarSolid = isScrolled || isMenuOpen || isHovered;
  const isSubPage = currentView !== 'home';
  const hideNavbar = isSubPage && !isScrolled && !isMenuOpen && !isHovered;

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 w-full z-50 transition-[transform,opacity,background-color,padding,border-color,box-shadow] duration-500 ease-in-out border-b will-change-transform ${
        hideNavbar 
          ? '-translate-y-full opacity-0 pointer-events-none invisible' 
          : 'translate-y-0 opacity-100 pointer-events-auto visible'
      } ${
        isNavbarSolid 
          ? 'bg-stone-900 dark:bg-stone-950 text-stone-50 py-4 shadow-lg border-stone-800' 
          : 'bg-transparent text-white py-6 border-transparent shadow-none'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={onNavigateHome} className="flex items-center gap-2 group">
          <Camera className="w-6 h-6" strokeWidth={1.5} />
          <span className="font-display text-2xl tracking-widest font-bold group-hover:text-stone-300 transition-colors">
            LUMINA
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="font-sans text-xs uppercase tracking-[0.2em] hover:text-stone-400 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all hover:after:w-full"
            >
              {link.name}
            </button>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-500 group"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon size={18} className="group-hover:rotate-[360deg] transition-transform duration-700" />
              ) : (
                <Sun size={18} className="group-hover:rotate-[360deg] transition-transform duration-700 text-champagne" />
              )}
            </button>
            <button
              onClick={() => handleLinkClick('#enquiry')}
              className={`border px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-white hover:bg-white hover:text-stone-900 ml-2`}
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={onToggleTheme} className="p-2">
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-champagne" />}
          </button>
          <button
            className="text-inherit"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 w-full h-screen bg-stone-900 dark:bg-stone-950 text-white flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out z-40 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button
          className="absolute top-6 right-6"
          onClick={() => setIsMenuOpen(false)}
        >
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleLinkClick(link.href)}
            className="font-display text-3xl hover:text-stone-400 transition-colors"
          >
            {link.name}
          </button>
        ))}
      </div>
    </nav>
  );
};