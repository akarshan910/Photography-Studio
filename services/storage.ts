/**
 * Mock Database Persistence Layer
 * Simulates a real backend database storage
 */

export const db = {
  save: <T>(key: string, data: T): void => {
    try {
      const existing = db.getAll<T>(key);
      const updated = [...existing, { ...data, id: Date.now(), createdAt: new Date().toISOString() }];
      localStorage.setItem(`lumina_${key}`, JSON.stringify(updated));
    } catch (e) {
      console.error(`Database write error [${key}]:`, e);
    }
  },

  updateAll: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(`lumina_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Database overwrite error [${key}]:`, e);
    }
  },

  getAll: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(`lumina_${key}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Database read error [${key}]:`, e);
      return [];
    }
  },

  // Simulates network latency for a realistic "backend" feel
  simulateNetwork: (ms = 400) => new Promise(resolve => setTimeout(resolve, ms))
};