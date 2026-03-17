import { Testimonial } from '../types';
import { supabase } from './supabaseClient';

export interface ExtendedTestimonial extends Testimonial {
  image: string;
  rating: number;
  order: number;
}

export const testimonialService = {
  getAll: async (): Promise<ExtendedTestimonial[]> => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;

    return (data ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      quote: t.quote,
      image: t.image,
      rating: t.rating,
      order: t.display_order,
    }));
  },

  updateAll: async (data: ExtendedTestimonial[]) => {
    // Replace-all strategy via upserts + delete missing
    const ids = data.map(d => d.id).filter(Boolean);

    const { error: upsertError } = await supabase
      .from('testimonials')
      .upsert(
        data.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          quote: t.quote,
          image: t.image,
          rating: t.rating,
          display_order: t.order ?? 0,
        })),
        { onConflict: 'id' }
      );
    if (upsertError) throw upsertError;

    if (ids.length > 0) {
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .not('id', 'in', `(${ids.join(',')})`);
      if (deleteError) throw deleteError;
    }
  }
};