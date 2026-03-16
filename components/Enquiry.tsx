import React, { useState } from 'react';
import { generateEnquiryDraft } from '../services/geminiService';
import { enquiryService } from '../services/enquiryService';
import { Sparkles, Send, CheckCircle, Loader2 } from 'lucide-react';

export const Enquiry: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    type: 'Wedding',
    guests: '50-100',
    style: 'Candid & Natural',
    message: ''
  });
  
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleAISuggest = async () => {
    if (!formData.name || !formData.type) {
        alert("Please fill in your name and event type first to help the AI craft a personalized draft.");
        return;
    }
    setIsDrafting(true);
    const draft = await generateEnquiryDraft(formData.type, formData.style, formData.guests);
    setFormData(prev => ({ ...prev, message: draft }));
    setIsDrafting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await enquiryService.submitEnquiry(formData);
      if (response.success) {
        setIsSuccess(true);
        setFormData({ ...formData, message: '', name: '', email: '' });
      }
    } catch (err: any) {
      setError(err.message || "Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="enquiry" className="py-24 bg-stone-900 dark:bg-stone-950 text-white flex items-center justify-center min-h-[600px] transition-colors duration-500">
        <div className="text-center animate-slide-up max-w-md px-6">
          <CheckCircle className="w-20 h-20 text-stone-100 dark:text-champagne mx-auto mb-8 stroke-1" />
          <h2 className="font-serif text-4xl mb-6">Enquiry Received</h2>
          <p className="text-stone-400 leading-relaxed mb-10">
            Thank you for reaching out. Your details have been securely transmitted to our studio. We carefully review every commission and will get back to you shortly.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="py-24 bg-stone-200 dark:bg-stone-900 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-5xl text-stone-900 dark:text-stone-100 mb-6">Let's Create Together</h2>
            <p className="font-sans text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
              We take on a limited number of commissions each year to ensure every client receives our full creative attention. Fill out the form, and tell us about your vision.
            </p>
            <div className="aspect-video bg-stone-300 dark:bg-stone-800 w-full overflow-hidden mb-8">
               <img src="https://picsum.photos/800/600?random=30" alt="Contact" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="space-y-2 font-sans text-stone-800 dark:text-stone-300">
              <p className="hover:text-stone-500 transition-colors cursor-pointer">hello@lumina-studio.com</p>
              <p>+1 (555) 000-0000</p>
              <p>Los Angeles, CA & Worldwide</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-950 p-8 md:p-12 shadow-xl border border-stone-100 dark:border-stone-800 relative overflow-hidden transition-colors duration-500">
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 dark:bg-stone-950/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-stone-900 dark:text-stone-100 animate-spin mb-4" />
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 dark:text-stone-100">Transmitting Data...</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors font-serif bg-transparent text-stone-900 dark:text-stone-100"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors font-serif bg-transparent text-stone-900 dark:text-stone-100"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Event Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors font-sans bg-transparent text-stone-900 dark:text-stone-100"
                >
                  <option className="bg-white dark:bg-stone-900">Wedding</option>
                  <option className="bg-white dark:bg-stone-900">Elopement</option>
                  <option className="bg-white dark:bg-stone-900">Portrait Session</option>
                  <option className="bg-white dark:bg-stone-900">Editorial</option>
                  <option className="bg-white dark:bg-stone-900">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Event Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors font-sans bg-transparent text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Estimated Guests</label>
                  <select 
                    name="guests" 
                    value={formData.guests} 
                    onChange={handleChange}
                    className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors bg-transparent text-stone-900 dark:text-stone-100"
                  >
                     <option className="bg-white dark:bg-stone-900">Just the two of us</option>
                     <option className="bg-white dark:bg-stone-900">20-50</option>
                     <option className="bg-white dark:bg-stone-900">50-100</option>
                     <option className="bg-white dark:bg-stone-900">100-200</option>
                     <option className="bg-white dark:bg-stone-900">200+</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Preferred Style</label>
                  <select 
                    name="style" 
                    value={formData.style} 
                    onChange={handleChange}
                    className="w-full border-b border-stone-300 dark:border-stone-800 py-2 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors bg-transparent text-stone-900 dark:text-stone-100"
                  >
                     <option className="bg-white dark:bg-stone-900">Candid & Natural</option>
                     <option className="bg-white dark:bg-stone-900">Cinematic & Moody</option>
                     <option className="bg-white dark:bg-stone-900">Bright & Airy</option>
                     <option className="bg-white dark:bg-stone-900">Editorial & Posed</option>
                  </select>
                </div>
             </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs uppercase tracking-widest text-stone-500">Your Message</label>
                <button 
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isDrafting}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-900/60 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors disabled:opacity-50 group"
                >
                  <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                  {isDrafting ? 'Studio AI Writing...' : 'Help me write this'}
                </button>
              </div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border border-stone-200 dark:border-stone-800 p-4 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-colors font-sans bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                placeholder="Tell us about your story..."
              ></textarea>
            </div>

            {error && <p className="mb-4 text-xs text-red-600 font-bold uppercase tracking-widest">{error}</p>}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 uppercase tracking-[0.2em] hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-bold"
            >
              Send Enquiry <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};