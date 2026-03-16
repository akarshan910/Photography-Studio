import { db } from './storage';
import { PricingTier } from '../types';

const STORAGE_KEY = 'pricing_tiers';

const initialTiers: PricingTier[] = [
  {
    name: "Portrait",
    price: "$450",
    features: ["1 Hour Session", "20 Edited High-Res Images", "Online Gallery"],
  },
  {
    name: "Wedding",
    price: "$3,200",
    features: ["8 Hours Coverage", "Second Shooter", "600+ Edited Images"],
    recommended: true,
  }
];

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    await db.simulateNetwork(300);
    let data = db.getAll<PricingTier>(STORAGE_KEY);
    if (data.length === 0) {
      db.updateAll(STORAGE_KEY, initialTiers);
      return initialTiers;
    }
    return data;
  },

  updateAll: async (data: PricingTier[]) => {
    await db.simulateNetwork(500);
    db.updateAll(STORAGE_KEY, data);
  }
};