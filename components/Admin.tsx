import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ImageIcon, Mail, Plus, Trash2, CheckCircle, 
  Camera, X, ArrowLeft, Star, Tag, Settings, Save, GripVertical, Eye, EyeOff,
  MoveUp, MoveDown, ImagePlus, Cloud, Link, RefreshCw, Loader2, Download
} from 'lucide-react';
import { portfolioService, ExtendedCollection } from '../services/portfolioService';
import { enquiryService } from '../services/enquiryService';
import { testimonialService, ExtendedTestimonial } from '../services/testimonialService';
import { pricingService } from '../services/pricingService';
import { PricingTier, ImageItem, Group } from '../types';

export const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'enquiries' | 'portfolio' | 'testimonials' | 'pricing'>('stats');
  const [collections, setCollections] = useState<ExtendedCollection[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<ExtendedTestimonial[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection for editing
  const [editingCollection, setEditingCollection] = useState<ExtendedCollection | null>(null);

  // iCloud Import State
  const [icloudModal, setIcloudModal] = useState<{ isOpen: boolean, targetGroupIdx: number | null }>({ isOpen: false, targetGroupIdx: null });
  const [icloudUrl, setIcloudUrl] = useState('');
  const [isResolvingIcloud, setIsResolvingIcloud] = useState(false);
  const [resolveProgress, setResolveProgress] = useState(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    const [c, e, t, p] = await Promise.all([
      portfolioService.getCollections(),
      enquiryService.getEnquiries(),
      testimonialService.getAll(),
      pricingService.getAll()
    ]);
    setCollections(c);
    setEnquiries(e);
    setTestimonials(t);
    setPricing(p);
    setIsLoading(false);
  };

  const toggleFeatured = async (col: ExtendedCollection) => {
    const updated = { ...col, isFeatured: !col.isFeatured };
    await portfolioService.updateCollection(updated);
    refreshData();
  };

  const updateOrder = async (col: ExtendedCollection, newOrder: number) => {
    const updated = { ...col, order: newOrder };
    await portfolioService.updateCollection(updated);
    refreshData();
  };

  const savePricing = async (newPricing: PricingTier[]) => {
    await pricingService.updateAll(newPricing);
    setPricing(newPricing);
  };

  const saveTestimonials = async (newTestimonials: ExtendedTestimonial[]) => {
    await testimonialService.updateAll(newTestimonials);
    setTestimonials(newTestimonials);
  };

  // Portfolio Hierarchy Helpers
  const handleUpdateGroupImage = (gIdx: number, imgIdx: number, url: string) => {
    if (!editingCollection) return;
    const next = { ...editingCollection };
    next.groups[gIdx].images[imgIdx].url = url;
    setEditingCollection(next);
  };

  const handleAddImageToGroup = (gIdx: number) => {
    if (!editingCollection) return;
    const next = { ...editingCollection };
    const newImg: ImageItem = { id: Date.now(), url: 'https://picsum.photos/800/1200', orientation: 'portrait' };
    next.groups[gIdx].images.push(newImg);
    if (next.groups[gIdx].previewImages.length < 3) {
      next.groups[gIdx].previewImages.push(newImg);
    }
    setEditingCollection(next);
  };

  const handleIcloudImport = async () => {
    if (!icloudUrl.includes('icloud.com/sharedalbum')) {
      alert("Please provide a valid iCloud Shared Album URL.");
      return;
    }

    setIsResolvingIcloud(true);
    setResolveProgress(0);

    // Simulate high-performance album resolution
    const steps = [15, 30, 45, 70, 90, 100];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 400));
      setResolveProgress(step);
    }

    if (editingCollection && icloudModal.targetGroupIdx !== null) {
      const next = { ...editingCollection };
      const gIdx = icloudModal.targetGroupIdx;
      
      // Mocked resolved assets from the iCloud stream
      const newImages: ImageItem[] = [
        { id: Date.now() + 1, url: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2000', caption: 'Imported from iCloud', orientation: 'landscape' },
        { id: Date.now() + 2, url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2000', caption: 'High Res Asset', orientation: 'portrait' },
        { id: Date.now() + 3, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000', caption: 'Lumina Stream', orientation: 'landscape' },
      ];

      next.groups[gIdx].images = [...next.groups[gIdx].images, ...newImages];
      
      // Update previews if they are empty
      if (next.groups[gIdx].previewImages.length === 0) {
        next.groups[gIdx].previewImages = newImages.slice(0, 3);
      }

      setEditingCollection(next);
    }

    setIsResolvingIcloud(false);
    setIcloudModal({ isOpen: false, targetGroupIdx: null });
    setIcloudUrl('');
  };

  const handleMoveImage = (gIdx: number, imgIdx: number, direction: 'up' | 'down') => {
    if (!editingCollection) return;
    const next = { ...editingCollection };
    const images = [...next.groups[gIdx].images];
    const targetIdx = direction === 'up' ? imgIdx - 1 : imgIdx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    
    [images[imgIdx], images[targetIdx]] = [images[targetIdx], images[imgIdx]];
    next.groups[gIdx].images = images;
    setEditingCollection(next);
  };

  const handleRemoveImage = (gIdx: number, imgIdx: number) => {
    if (!editingCollection) return;
    const next = { ...editingCollection };
    next.groups[gIdx].images.splice(imgIdx, 1);
    setEditingCollection(next);
  };

  const handleAddGroup = () => {
    if (!editingCollection) return;
    const newGroup: Group = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project details...',
      date: new Date().getFullYear().toString(),
      location: 'Location',
      previewImages: [],
      images: []
    };
    setEditingCollection({
      ...editingCollection,
      groups: [...editingCollection.groups, newGroup]
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex items-center justify-center z-[100]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-800 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3 border-b border-stone-800">
          <Camera className="text-white" />
          <span className="font-display font-bold tracking-widest text-white">LUMINA STUDIO</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {[
            { id: 'stats', label: 'Overview', icon: LayoutDashboard },
            { id: 'enquiries', label: 'Enquiries', icon: Mail },
            { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
            { id: 'testimonials', label: 'Testimonials', icon: Star },
            { id: 'pricing', label: 'Packages', icon: Tag },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-stone-950 font-bold shadow-lg' : 'hover:bg-stone-900 text-stone-400'}`}
            >
              <tab.icon size={18} /> {tab.label}
              {tab.id === 'enquiries' && enquiries.length > 0 && <span className="ml-auto bg-stone-800 text-white text-[10px] px-2 py-0.5 rounded">{enquiries.length}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-white transition-colors">
            <ArrowLeft size={18} /> View Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-[#0a0a0a]">
        
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-fade-in max-w-6xl">
            <header>
              <h1 className="text-4xl font-serif text-white mb-2">Studio Control</h1>
              <p className="text-stone-500 uppercase tracking-widest text-xs">Curation & Growth Insights</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <StatCard title="Total Leads" value={enquiries.length} icon={<Mail />} />
               <StatCard title="Active Works" value={collections.length} icon={<ImageIcon />} />
               <StatCard title="Testimonials" value={testimonials.length} icon={<Star />} />
               <StatCard title="Packages" value={pricing.length} icon={<Tag />} />
            </div>

            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800">
               <h3 className="text-white font-serif text-xl mb-6 flex items-center gap-2">
                 <Settings size={20} className="text-stone-500" /> Quick Actions
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <QuickAction label="New Project" icon={<Plus />} onClick={() => setActiveTab('portfolio')} />
                  <QuickAction label="View Leads" icon={<Mail />} onClick={() => setActiveTab('enquiries')} />
                  <QuickAction label="Update Rates" icon={<Tag />} onClick={() => setActiveTab('pricing')} />
                  <QuickAction label="Add Review" icon={<Star />} onClick={() => setActiveTab('testimonials')} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-8 animate-fade-in max-w-6xl">
             <header className="flex justify-between items-end">
               <div>
                  <h1 className="text-3xl font-serif text-white mb-2">Portfolio Curation</h1>
                  <p className="text-stone-500 uppercase tracking-widest text-xs">Manage Visibility & Order</p>
               </div>
               <button className="bg-white text-stone-950 px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-stone-200 transition-all">
                 <Plus size={16} /> New Collection
               </button>
             </header>

             <div className="grid grid-cols-1 gap-4">
                {collections.map((col) => (
                  <div key={col.id} className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex items-center gap-6 group">
                     <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-stone-800">
                        <img src={col.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-white font-serif text-lg">{col.title}</h3>
                           <span className="text-[10px] px-2 py-0.5 bg-stone-800 rounded text-stone-500 uppercase tracking-widest">{col.category}</span>
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1 max-w-md">{col.description}</p>
                     </div>

                     <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[9px] uppercase tracking-tighter text-stone-600">Home Featured</span>
                           <button 
                             onClick={() => toggleFeatured(col)}
                             className={`transition-all ${col.isFeatured ? 'text-white' : 'text-stone-700 hover:text-stone-500'}`}
                           >
                             {col.isFeatured ? <Eye size={22} /> : <EyeOff size={22} />}
                           </button>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[9px] uppercase tracking-tighter text-stone-600">Display Order</span>
                           <input 
                             type="number" 
                             value={col.order} 
                             onChange={(e) => updateOrder(col, parseInt(e.target.value))}
                             className="w-12 bg-stone-800 border-none text-center text-xs py-1 rounded text-white focus:ring-1 focus:ring-white"
                           />
                        </div>

                        <div className="flex gap-2">
                           <button 
                              onClick={() => setEditingCollection(col)}
                              className="p-2 hover:bg-stone-800 rounded-lg text-stone-500 hover:text-white transition-all"
                           >
                              <Settings size={18} />
                           </button>
                           <button className="p-2 hover:bg-red-950/30 rounded-lg text-stone-700 hover:text-red-400 transition-all">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Other tabs follow the same pattern... */}
        {activeTab === 'pricing' && (
           <div className="space-y-8 animate-fade-in max-w-4xl">
              <header className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl font-serif text-white mb-2">Plans & Packages</h1>
                   <p className="text-stone-500 uppercase tracking-widest text-xs">Curate your service offerings</p>
                </div>
                <button onClick={() => savePricing([...pricing, { name: 'New Tier', price: '$0', features: [] }])} className="bg-stone-800 text-white px-4 py-2 rounded text-xs">Add Tier</button>
              </header>

              <div className="grid gap-6">
                {pricing.map((tier, idx) => (
                   <div key={idx} className="bg-stone-900 border border-stone-800 p-8 rounded-xl">
                      <div className="flex justify-between mb-6">
                        <div className="flex gap-4 items-center">
                           <input 
                             value={tier.name} 
                             onChange={(e) => {
                                const next = [...pricing];
                                next[idx].name = e.target.value;
                                savePricing(next);
                             }}
                             className="bg-transparent border-b border-stone-700 text-white font-serif text-xl focus:border-white outline-none" 
                           />
                           <input 
                             value={tier.price} 
                             onChange={(e) => {
                                const next = [...pricing];
                                next[idx].price = e.target.value;
                                savePricing(next);
                             }}
                             className="bg-stone-800 border-none text-stone-400 text-sm p-1 rounded w-20 text-center" 
                           />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={tier.recommended} 
                             onChange={(e) => {
                                const next = [...pricing];
                                next[idx].recommended = e.target.checked;
                                savePricing(next);
                             }}
                           /> Most Popular
                        </label>
                        <button onClick={() => {
                          const next = pricing.filter((_, i) => i !== idx);
                          savePricing(next);
                        }} className="text-red-900 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                      <div className="space-y-2">
                         {tier.features.map((f, fidx) => (
                            <div key={fidx} className="flex items-center gap-2 group">
                               <CheckCircle size={14} className="text-stone-600" />
                               <input 
                                 value={f} 
                                 onChange={(e) => {
                                    const next = [...pricing];
                                    next[idx].features[fidx] = e.target.value;
                                    savePricing(next);
                                 }}
                                 className="bg-transparent border-none text-sm text-stone-400 focus:text-white outline-none flex-1"
                               />
                               <button onClick={() => {
                                  const next = [...pricing];
                                  next[idx].features.splice(fidx, 1);
                                  savePricing(next);
                               }} className="opacity-0 group-hover:opacity-100 text-red-900 hover:text-red-500 transition-all"><X size={14}/></button>
                            </div>
                         ))}
                         <button 
                           onClick={() => {
                              const next = [...pricing];
                              next[idx].features.push('New feature');
                              savePricing(next);
                           }}
                           className="text-[10px] text-stone-600 hover:text-white flex items-center gap-1 mt-2"
                         >
                           <Plus size={10} /> Add Feature
                         </button>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === 'enquiries' && (
           <div className="space-y-8 animate-fade-in max-w-6xl">
              <header>
                 <h1 className="text-3xl font-serif text-white mb-2">Lead Inbox</h1>
                 <p className="text-stone-500 uppercase tracking-widest text-xs">Direct communications from potential clients</p>
              </header>
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-stone-800/50 text-stone-500 text-[10px] uppercase tracking-widest">
                       <tr><th className="p-6">Client</th><th className="p-6">Project</th><th className="p-6">Date</th><th className="p-6">Message Preview</th></tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                       {enquiries.map(enq => (
                          <tr key={enq.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                             <td className="p-6">
                                <div className="text-white font-medium">{enq.name}</div>
                                <div className="text-xs text-stone-600">{enq.email}</div>
                             </td>
                             <td className="p-6 text-sm">{enq.type}</td>
                             <td className="p-6 text-xs text-stone-600">{new Date(enq.createdAt).toLocaleDateString()}</td>
                             <td className="p-6 text-xs text-stone-500 italic max-w-xs truncate group-hover:text-stone-300">"{enq.message}"</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'testimonials' && (
           <div className="space-y-8 animate-fade-in max-w-4xl">
              <header className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl font-serif text-white mb-2">Client Testimonials</h1>
                   <p className="text-stone-500 uppercase tracking-widest text-xs">Curate your public social proof</p>
                </div>
                <button onClick={() => saveTestimonials([...testimonials, { id: Date.now(), name: 'Client Name', role: 'Role', image: 'https://picsum.photos/400/500', rating: 5, quote: '', order: testimonials.length + 1 }])} className="bg-white text-black px-4 py-2 rounded text-xs font-bold">Add Testimonial</button>
              </header>

              <div className="grid gap-6">
                 {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex gap-6 group relative">
                       <button onClick={() => saveTestimonials(testimonials.filter((_, i) => i !== idx))} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-stone-700 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                       <div className="w-20 h-24 bg-stone-800 rounded-lg overflow-hidden shrink-0">
                          <img src={t.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex-1 space-y-4">
                          <div className="flex justify-between gap-4">
                             <div className="flex-1 flex flex-col gap-2">
                                <input value={t.name} onChange={(e) => {
                                   const next = [...testimonials];
                                   next[idx].name = e.target.value;
                                   saveTestimonials(next);
                                }} placeholder="Name" className="bg-transparent text-white font-serif text-lg outline-none border-b border-transparent focus:border-stone-700 w-full" />
                                <input value={t.role} onChange={(e) => {
                                   const next = [...testimonials];
                                   next[idx].role = e.target.value;
                                   saveTestimonials(next);
                                }} placeholder="Role" className="bg-transparent text-xs text-stone-500 outline-none border-b border-transparent focus:border-stone-700 w-full" />
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-[9px] uppercase tracking-tighter text-stone-600 mb-1">Order</span>
                                <input type="number" value={t.order} onChange={(e) => {
                                   const next = [...testimonials];
                                   next[idx].order = parseInt(e.target.value);
                                   saveTestimonials(next);
                                }} className="w-10 bg-stone-800 text-center text-xs py-1 rounded" />
                             </div>
                          </div>
                          <textarea 
                             value={t.quote} 
                             onChange={(e) => {
                                const next = [...testimonials];
                                next[idx].quote = e.target.value;
                                saveTestimonials(next);
                             }}
                             placeholder="Quote..."
                             className="w-full bg-stone-800/50 border-none rounded p-3 text-sm text-stone-400 focus:text-white italic outline-none" 
                             rows={2}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>

      {/* Detail Editor Modal (Full Hierarchy Management) */}
      {editingCollection && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[300] flex justify-end">
            <div className="w-full max-w-5xl bg-stone-900 h-full overflow-y-auto p-8 md:p-12 animate-slide-left shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h2 className="text-4xl font-serif text-white mb-2">Edit: {editingCollection.title}</h2>
                     <p className="text-stone-500 uppercase tracking-widest text-xs">Hierarchy & Asset Manager</p>
                  </div>
                  <button onClick={() => setEditingCollection(null)} className="p-3 bg-stone-800 rounded-full text-white hover:bg-stone-700 transition-all"><X /></button>
               </div>

               <div className="space-y-12 pb-32">
                  {/* Basic Metadata */}
                  <div className="bg-stone-800/30 p-8 rounded-2xl border border-stone-800">
                     <h3 className="text-white text-sm uppercase tracking-widest mb-6 border-b border-stone-800 pb-2 flex items-center gap-2">
                       <Link size={14}/> Primary Assets (Supports Public URLs)
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] text-stone-500 mb-2 uppercase">Hero Image URL</label>
                           <input 
                              className="w-full bg-stone-800 rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-white/20 text-xs font-mono" 
                              value={editingCollection.imageUrl}
                              onChange={(e) => setEditingCollection({...editingCollection, imageUrl: e.target.value})}
                              placeholder="https://icloud.com/..."
                           />
                           <div className="mt-4">
                              <label className="block text-[10px] text-stone-500 mb-2 uppercase">Description</label>
                              <textarea 
                                 className="w-full bg-stone-800 rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-white/20 h-24 text-sm" 
                                 value={editingCollection.description}
                                 onChange={(e) => setEditingCollection({...editingCollection, description: e.target.value})}
                              />
                           </div>
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden border border-stone-700 shadow-2xl">
                           <img src={editingCollection.imageUrl} className="w-full h-full object-cover" alt="Hero Preview" />
                        </div>
                     </div>
                  </div>

                  {/* Groups Management */}
                  <div className="space-y-6">
                     <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                        <h3 className="text-white text-sm uppercase tracking-widest">Groups / Projects ({editingCollection.groups.length})</h3>
                        <button onClick={handleAddGroup} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-stone-200 transition-all flex items-center gap-2">
                          <Plus size={14}/> Add Group
                        </button>
                     </div>
                     
                     <div className="grid gap-8">
                        {editingCollection.groups.map((group, gidx) => (
                           <div key={group.id} className="bg-stone-800/20 border border-stone-800 p-8 rounded-xl space-y-6 shadow-inner">
                              <div className="flex justify-between items-start">
                                 <div className="flex-1 space-y-2">
                                    <input 
                                       className="bg-transparent font-serif text-2xl text-white outline-none border-b border-transparent focus:border-stone-700 w-full" 
                                       value={group.title}
                                       onChange={(e) => {
                                          const next = {...editingCollection};
                                          next.groups[gidx].title = e.target.value;
                                          setEditingCollection(next);
                                       }}
                                    />
                                    <div className="flex gap-4">
                                       <input className="bg-stone-800 text-[10px] p-1 px-2 rounded outline-none" value={group.location} onChange={(e) => {
                                          const next = {...editingCollection}; next.groups[gidx].location = e.target.value; setEditingCollection(next);
                                       }} placeholder="Location"/>
                                       <input className="bg-stone-800 text-[10px] p-1 px-2 rounded outline-none" value={group.date} onChange={(e) => {
                                          const next = {...editingCollection}; next.groups[gidx].date = e.target.value; setEditingCollection(next);
                                       }} placeholder="Date"/>
                                    </div>
                                 </div>
                                 <button onClick={() => {
                                    const next = {...editingCollection}; next.groups.splice(gidx, 1); setEditingCollection(next);
                                 }} className="text-red-900 hover:text-red-500 ml-4 transition-colors"><Trash2 size={18} /></button>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] text-stone-500 uppercase tracking-widest">Gallery Images ({group.images.length})</h4>
                                    <div className="flex gap-4">
                                       <button 
                                         onClick={() => setIcloudModal({ isOpen: true, targetGroupIdx: gidx })}
                                         className="flex items-center gap-2 text-[10px] text-stone-400 hover:text-white font-bold uppercase transition-colors"
                                       >
                                         <Cloud size={14} className="text-sky-500"/> Import from iCloud
                                       </button>
                                       <button 
                                         onClick={() => handleAddImageToGroup(gidx)}
                                         className="flex items-center gap-2 text-[10px] text-stone-400 hover:text-white font-bold uppercase transition-colors"
                                       >
                                         <ImagePlus size={14}/> Add Single Photo
                                       </button>
                                    </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {group.images.map((img, iidx) => (
                                       <div key={img.id} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden group/img relative">
                                          <div className="aspect-square relative">
                                             <img src={img.url} className="w-full h-full object-cover" alt="" />
                                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                <div className="flex gap-2">
                                                   <button onClick={() => handleMoveImage(gidx, iidx, 'up')} className="p-1.5 bg-stone-800 rounded hover:bg-stone-700 transition-colors"><MoveUp size={14}/></button>
                                                   <button onClick={() => handleMoveImage(gidx, iidx, 'down')} className="p-1.5 bg-stone-800 rounded hover:bg-stone-700 transition-colors"><MoveDown size={14}/></button>
                                                </div>
                                                <button onClick={() => handleRemoveImage(gidx, iidx)} className="p-1.5 bg-red-950/80 rounded hover:bg-red-900 transition-colors"><Trash2 size={14}/></button>
                                             </div>
                                          </div>
                                          <div className="p-2 bg-stone-950">
                                             <input 
                                                className="w-full bg-transparent text-[8px] p-1 rounded outline-none text-stone-600 focus:text-stone-100 font-mono truncate"
                                                value={img.url}
                                                onChange={(e) => handleUpdateGroupImage(gidx, iidx, e.target.value)}
                                                placeholder="Asset URL"
                                             />
                                          </div>
                                       </div>
                                    ))}
                                    <button 
                                       onClick={() => handleAddImageToGroup(gidx)}
                                       className="aspect-square border-2 border-dashed border-stone-800 rounded-lg flex flex-col gap-2 items-center justify-center text-stone-700 hover:border-stone-500 hover:text-stone-400 cursor-pointer transition-all group"
                                    >
                                       <Plus size={24} className="group-hover:scale-110 transition-transform" />
                                       <span className="text-[9px] uppercase font-bold tracking-widest">New Image</span>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="fixed bottom-0 right-0 w-full max-w-5xl bg-stone-900/90 backdrop-blur-xl p-8 border-t border-stone-800 flex gap-4 z-[310]">
                  <button 
                    onClick={async () => {
                      await portfolioService.updateCollection(editingCollection);
                      setEditingCollection(null);
                      refreshData();
                    }}
                    className="flex-1 bg-white text-stone-950 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-200 transition-all shadow-xl active:scale-[0.98]"
                  >
                    <Save size={20} /> Commit All Changes
                  </button>
                  <button onClick={() => setEditingCollection(null)} className="px-8 bg-stone-800 text-white rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-stone-700 transition-all">Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* iCloud Import Resolver Modal */}
      {icloudModal.isOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[400] flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slide-up">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 rounded-xl">
                    <Cloud className="text-sky-500" size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">Import Album</h3>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest">iCloud Shared Gallery Integration</p>
                  </div>
               </div>
               <button onClick={() => setIcloudModal({ isOpen: false, targetGroupIdx: null })} className="text-stone-500 hover:text-white transition-colors"><X/></button>
            </div>

            <div className="space-y-8">
               <div>
                  <label className="block text-[10px] text-stone-500 mb-3 uppercase tracking-widest font-bold">Paste Shared Album URL</label>
                  <div className="relative">
                    <input 
                      className={`w-full bg-stone-800 border-2 rounded-xl p-4 text-white outline-none focus:ring-1 transition-all ${icloudUrl.includes('icloud.com') ? 'border-sky-500/30' : 'border-stone-700 focus:border-white'}`}
                      value={icloudUrl}
                      onChange={(e) => setIcloudUrl(e.target.value)}
                      placeholder="https://www.icloud.com/sharedalbum/#B1..."
                      disabled={isResolvingIcloud}
                    />
                    {icloudUrl.includes('icloud.com') && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-500" size={18}/>}
                  </div>
                  <p className="mt-4 text-[10px] text-stone-600 italic leading-relaxed">
                    Ensure the album is set to "Public Website" in your iCloud Photos settings. This allows Lumina Studio to resolve the high-resolution media stream.
                  </p>
               </div>

               {isResolvingIcloud ? (
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-400">
                      <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin text-sky-500"/> Resolving Stream...</span>
                      <span>{resolveProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                       <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${resolveProgress}%` }}></div>
                    </div>
                    <p className="text-center text-[9px] text-stone-500 animate-pulse">Scanning metadata and verifying high-res versions</p>
                 </div>
               ) : (
                 <button 
                   onClick={handleIcloudImport}
                   disabled={!icloudUrl}
                   className="w-full bg-white text-stone-950 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-200 transition-all disabled:opacity-20 shadow-lg"
                 >
                   <RefreshCw size={18} /> Resolve & Import Assets
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: any, icon: any }) => (
  <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 hover:border-stone-700 transition-colors shadow-sm">
    <div className="text-stone-500 mb-4">{icon}</div>
    <h3 className="text-stone-500 text-[10px] uppercase tracking-widest mb-1 font-bold">{title}</h3>
    <p className="text-4xl text-white font-serif tracking-tighter">{value}</p>
  </div>
);

const QuickAction = ({ label, icon, onClick }: { label: string, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-6 bg-stone-950 border border-stone-800 rounded-xl hover:border-white/20 hover:bg-stone-900 transition-all text-stone-500 hover:text-white group"
  >
    <div className="p-3 bg-stone-900 rounded-full group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
  </button>
);