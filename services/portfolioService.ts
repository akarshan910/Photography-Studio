import { db } from './storage';
import { portfolioData as seedData } from '../data';
import { CollectionItem, Group } from '../types';

const STORAGE_KEY = 'portfolio_collections';

export interface ExtendedCollection extends CollectionItem {
  isFeatured?: boolean;
  order?: number;
}

export const portfolioService = {
  getCollections: async (): Promise<ExtendedCollection[]> => {
    await db.simulateNetwork(400);
    let data = db.getAll<ExtendedCollection>(STORAGE_KEY);
    
    if (data.length === 0) {
      // Add default metadata to seed data
      const processed = seedData.map((c, i) => ({ 
        ...c, 
        isFeatured: i < 3, 
        order: i 
      }));
      db.updateAll(STORAGE_KEY, processed);
      return processed;
    }
    
    return data.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  updateCollection: async (collection: ExtendedCollection): Promise<void> => {
    await db.simulateNetwork(500);
    const collections = db.getAll<ExtendedCollection>(STORAGE_KEY);
    const index = collections.findIndex(c => c.id === collection.id);
    if (index !== -1) {
      collections[index] = collection;
      db.updateAll(STORAGE_KEY, collections);
    }
  },

  createCollection: async (collection: Omit<ExtendedCollection, 'id' | 'groups'>): Promise<ExtendedCollection> => {
    await db.simulateNetwork(800);
    const collections = db.getAll<ExtendedCollection>(STORAGE_KEY);
    const newCollection: ExtendedCollection = {
      ...collection,
      id: Date.now(),
      groups: [],
      isFeatured: false,
      order: collections.length
    };
    db.updateAll(STORAGE_KEY, [...collections, newCollection]);
    return newCollection;
  },

  deleteCollection: async (id: number): Promise<void> => {
    await db.simulateNetwork(500);
    const collections = db.getAll<ExtendedCollection>(STORAGE_KEY);
    db.updateAll(STORAGE_KEY, collections.filter(c => c.id !== id));
  }
};