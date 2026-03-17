import { CollectionItem, Group } from '../types';
import { supabase } from './supabaseClient';

export interface ExtendedCollection extends CollectionItem {
  isFeatured?: boolean;
  order?: number;
}

export const portfolioService = {
  getCollections: async (): Promise<ExtendedCollection[]> => {
    const { data: collections, error: cErr } = await supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true });
    if (cErr) throw cErr;

    const colIds = (collections ?? []).map((c: any) => c.id);
    if (colIds.length === 0) return [];

    const { data: groups, error: gErr } = await supabase
      .from('groups')
      .select('*')
      .in('collection_id', colIds)
      .order('display_order', { ascending: true });
    if (gErr) throw gErr;

    const groupIds = (groups ?? []).map((g: any) => g.id);
    const { data: images, error: iErr } = groupIds.length
      ? await supabase
          .from('images')
          .select('*')
          .in('group_id', groupIds)
          .order('display_order', { ascending: true })
      : { data: [], error: null };
    if (iErr) throw iErr;

    const imagesByGroup = new Map<number, any[]>();
    for (const img of images ?? []) {
      const arr = imagesByGroup.get(img.group_id) ?? [];
      arr.push(img);
      imagesByGroup.set(img.group_id, arr);
    }

    const groupsByCollection = new Map<number, any[]>();
    for (const g of groups ?? []) {
      const arr = groupsByCollection.get(g.collection_id) ?? [];
      arr.push(g);
      groupsByCollection.set(g.collection_id, arr);
    }

    return (collections ?? []).map((c: any) => {
      const gs = groupsByCollection.get(c.id) ?? [];
      const mappedGroups: Group[] = gs.map((g: any) => {
        const imgs = (imagesByGroup.get(g.id) ?? []).slice().sort((a, b) => a.display_order - b.display_order);
        // UI expects up to 3 preview images, but galleries can have any length.
        // Keep it stable by always using the first 3 images as previews.
        const preview = imgs.slice(0, 3).map((im) => ({
          id: im.id,
          url: im.url,
          caption: im.caption ?? undefined,
          orientation: im.orientation ?? undefined,
        }));

        return {
          id: g.id,
          title: g.title,
          description: g.description,
          date: g.date_text,
          location: g.location,
          previewImages: preview,
          images: imgs.map((im) => ({
            id: im.id,
            url: im.url,
            caption: im.caption ?? undefined,
            orientation: im.orientation ?? undefined,
          })),
        };
      });

      return {
        id: c.id,
        title: c.title,
        category: c.category,
        imageUrl: c.image_url,
        description: c.description ?? undefined,
        groups: mappedGroups,
        isFeatured: c.is_featured,
        order: c.display_order,
      };
    });
  },

  updateCollection: async (collection: ExtendedCollection): Promise<void> => {
    // Convert client shape to RPC payload
    const payload = {
      id: collection.id,
      title: collection.title,
      category: collection.category,
      imageUrl: collection.imageUrl,
      description: collection.description ?? '',
      isFeatured: !!collection.isFeatured,
      order: collection.order ?? 0,
      groups: collection.groups.map((g, gIdx) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        date: g.date,
        location: g.location,
        order: gIdx,
        images: g.images.map((im, imIdx) => ({
          id: im.id,
          url: im.url,
          caption: im.caption ?? '',
          orientation: im.orientation ?? null,
          order: imIdx,
          // First 3 images become previews (public UI collage).
          isPreview: imIdx < 3,
          previewOrder: imIdx < 3 ? imIdx + 1 : 0,
        })),
      })),
    };

    const { error } = await supabase.rpc('admin_upsert_collection_hierarchy', { payload });
    if (error) throw error;
  },

  createCollection: async (collection: Omit<ExtendedCollection, 'id' | 'groups'>): Promise<ExtendedCollection> => {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        title: collection.title,
        category: collection.category,
        image_url: collection.imageUrl,
        description: collection.description ?? null,
        is_featured: !!collection.isFeatured,
        display_order: collection.order ?? 0,
      })
      .select('*')
      .single();
    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      imageUrl: data.image_url,
      description: data.description ?? undefined,
      groups: [],
      isFeatured: data.is_featured,
      order: data.display_order,
    };
  },

  deleteCollection: async (id: number): Promise<void> => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
  }
};