import { create } from "zustand";
import * as api from "@/lib/api";

interface ContentState {
  items: Record<string, string>;
  loaded: boolean;
  loadContent: () => Promise<void>;
  getContent: (key: string, fallback: string) => string;
  saveContent: (key: string, value: string) => Promise<void>;
}

export const useContentStore = create<ContentState>()((set, get) => ({
  items: {},
  loaded: false,

  loadContent: async () => {
    const { items } = await api.fetchAllContent();
    set({ items, loaded: true });
  },

  getContent: (key, fallback) => {
    const value = get().items[key];
    return value !== undefined ? value : fallback;
  },

  saveContent: async (key, value) => {
    const previous = get().items[key];
    set((state) => ({ items: { ...state.items, [key]: value } }));
    try {
      await api.updateContent(key, value);
    } catch (err) {
      set((state) => {
        const nextItems = { ...state.items };
        if (previous === undefined) {
          delete nextItems[key];
        } else {
          nextItems[key] = previous;
        }
        return { items: nextItems };
      });
      throw err;
    }
  },
}));
