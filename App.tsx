import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Collections } from './components/Collections';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Equipment } from './components/Equipment';
import { Pricing } from './components/Pricing';
import { Enquiry } from './components/Enquiry';
import { Footer } from './components/Footer';
import { AllCollections } from './components/AllCollections';
import { CollectionGroups } from './components/CollectionGroups';
import { GroupGallery } from './components/GroupGallery';
import { Admin } from './components/Admin';
import { ViewState, CollectionItem } from './types';
import { portfolioService } from './services/portfolioService';
import { PLAYLIST } from './data';

function App() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'home' });
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Audio State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Initialize Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Initialize "Backend" Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getCollections();
        setCollections(data);
      } catch (err) {
        console.error("Backend fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [viewState.type]);

  // Reset scroll on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewState.type]);

  // Global Audio Manager
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteractedRef.current && isPlaying) {
        audioRef.current?.play().catch(() => {
          console.warn("Autoplay still blocked by browser. Interaction required.");
        });
        hasInteractedRef.current = true;
      }
    };

    window.addEventListener('mousedown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('mousedown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTrackEnded = () => {
    if (isShuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * PLAYLIST.length);
      } while (nextIndex === currentTrackIndex && PLAYLIST.length > 1);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }
  };

  const toggleAudio = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const handleNavigateHome = () => setViewState({ type: 'home' });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="w-12 h-12 border-2 border-stone-200 dark:border-stone-800 border-t-stone-900 dark:border-t-stone-100 rounded-full animate-spin mb-6" />
          <p className="font-display text-xs tracking-[0.3em] uppercase opacity-40 text-stone-900 dark:text-stone-100">Initializing Lumina Studio</p>
        </div>
      );
    }

    if (viewState.type === 'admin') {
      return <Admin onExit={handleNavigateHome} />;
    }

    switch (viewState.type) {
      case 'home':
        return (
          <main>
            <Hero 
              isPlaying={isPlaying} 
              onToggleAudio={toggleAudio} 
              isShuffle={isShuffle} 
              onToggleShuffle={toggleShuffle} 
            />
            <Collections 
              collections={collections}
              onViewAll={() => setViewState({ type: 'all-collections' })}
              onSelectCollection={(id) => setViewState({ type: 'collection-detail', collectionId: id })}
            />
            <Features />
            <Testimonials />
            <Equipment />
            <Pricing />
            <Enquiry />
          </main>
        );
      
      case 'all-collections':
        return (
          <AllCollections 
            collections={collections}
            onBack={() => setViewState({ type: 'home' })}
            onSelectCollection={(id) => setViewState({ type: 'collection-detail', collectionId: id })}
          />
        );

      case 'collection-detail':
        const collection = collections.find(c => c.id === viewState.collectionId);
        if (!collection) return <div className="pt-40 text-center uppercase tracking-widest text-xs">Collection not found</div>;
        return (
          <CollectionGroups 
            collection={collection}
            onBack={() => setViewState({ type: 'all-collections' })}
            onSelectGroup={(groupId) => setViewState({ 
              type: 'group-detail', 
              groupId, 
              fromCollectionId: collection.id 
            })}
          />
        );

      case 'group-detail':
         const parentCollection = collections.find(c => c.id === viewState.fromCollectionId);
         const group = parentCollection?.groups.find(g => g.id === viewState.groupId);
         if (!group) return <div className="pt-40 text-center uppercase tracking-widest text-xs">Group not found</div>;
         return (
           <GroupGallery 
             group={group}
             onBack={() => setViewState({ type: 'collection-detail', collectionId: viewState.fromCollectionId })}
           />
         );

      default:
        return <div className="pt-40 text-center uppercase tracking-widest text-xs">Page not found</div>;
    }
  };

  return (
    <div className="font-sans antialiased bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentTrackIndex].url} 
        onEnded={handleTrackEnded}
      />
      
      {viewState.type !== 'admin' && (
        <Navbar 
          onNavigateHome={handleNavigateHome} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          currentView={viewState.type}
        />
      )}
      
      {renderContent()}
      
      {viewState.type !== 'admin' && (
        <Footer onNavigateAdmin={() => setViewState({ type: 'admin' })} />
      )}
    </div>
  );
}

export default App;