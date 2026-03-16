import { db } from './storage';
import { Testimonial } from '../types';

const STORAGE_KEY = 'testimonials';

export interface ExtendedTestimonial extends Testimonial {
  image: string;
  rating: number;
  order: number;
}

const initialTestimonials: ExtendedTestimonial[] = [
  {
    id: 1,
    name: "Sarah & James",
    role: "Wedding Clients",
    image: "https://picsum.photos/600/800?random=50",
    rating: 5,
    order: 1,
    quote: "The photos are breathtaking. You didn't just capture how it looked, you captured how it felt. Every time we look at our album, we are transported back to that lake in Como."
  },
  {
    id: 2,
    name: "Elena Rossi",
    role: "Editorial Model",
    image: "https://picsum.photos/600/800?random=51",
    rating: 5,
    order: 2,
    quote: "Working with Lumina was a masterclass in light and shadow. The editorial vision is unlike anything I've seen in the industry. Truly cinematic results."
  },
  {
    id: 3,
    name: "The Miller Family",
    role: "Portrait Session",
    image: "https://picsum.photos/600/800?random=52",
    rating: 5,
    order: 3,
    quote: "We've had family photos before, but never anything that felt this 'us'. No awkward posing, just genuine moments caught by a true artist."
  },
  {
    id: 4,
    name: "Marc & Sofia",
    role: "Elopement in Iceland",
    image: "https://picsum.photos/600/800?random=53",
    rating: 5,
    order: 4,
    quote: "Lumina braved the winds and the cold with us to capture our vows. The dedication to the craft is incredible, and the images are pure poetry."
  }
];

export const testimonialService = {
  getAll: async (): Promise<ExtendedTestimonial[]> => {
    await db.simulateNetwork(300);
    let data = db.getAll<ExtendedTestimonial>(STORAGE_KEY);
    if (data.length === 0) {
      db.updateAll(STORAGE_KEY, initialTestimonials);
      return initialTestimonials;
    }
    // Ensure we always have at least the seed data if somehow empty or for first-time refresh
    return data.sort((a, b) => a.order - b.order);
  },

  updateAll: async (data: ExtendedTestimonial[]) => {
    await db.simulateNetwork(500);
    db.updateAll(STORAGE_KEY, data);
  }
};