import { PricingTier } from '../types';
import { supabase } from './supabaseClient';

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;

    return (data ?? []).map((t: any) => ({
      name: t.name,
      price: t.price,
      features: t.features ?? [],
      recommended: t.recommended,
    }));
  },

  updateAll: async (data: PricingTier[]) => {
    // Replace-all by deleting and re-inserting (admin-only operation)
    const { error: delError } = await supabase.from('pricing_tiers').delete().neq('id', 0);
    if (delError) throw delError;

    const { error: insError } = await supabase.from('pricing_tiers').insert(
      data.map((t, idx) => ({
        name: t.name,
        price: t.price,
        features: t.features ?? [],
        recommended: !!t.recommended,
        display_order: idx,
      }))
    );
    if (insError) throw insError;
  }
};