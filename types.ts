export interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface ImageItem {
  id: number;
  url: string;
  caption?: string;
  orientation?: 'portrait' | 'landscape';
}

export interface Group {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  previewImages: ImageItem[]; 
  images: ImageItem[];
}

export interface CollectionItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  groups: Group[];
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'all-collections' }
  | { type: 'collection-detail'; collectionId: number }
  | { type: 'group-detail'; groupId: number; fromCollectionId: number }
  | { type: 'admin' };