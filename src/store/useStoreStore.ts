import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Book } from "@/components/store/store-mock-data";
import { toast } from "sonner";

interface StoreState {
  cart: (Book & { quantity: number })[];
  wishlist: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  toggleWishlist: (book: Book) => void;
  isInWishlist: (bookId: string) => boolean;
  clearCart: () => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      
      addToCart: (book) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === book.id);
          if (existingItem) {
            toast.success(`Increased quantity of ${book.title} in cart`);
            return {
              cart: state.cart.map((item) =>
                item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          toast.success(`${book.title} added to cart`);
          return { cart: [...state.cart, { ...book, quantity: 1 }] };
        });
      },
      
      removeFromCart: (bookId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== bookId),
        }));
      },
      
      updateQuantity: (bookId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(bookId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === bookId ? { ...item, quantity } : item
          ),
        }));
      },
      
      toggleWishlist: (book) => {
        set((state) => {
          const isFavourited = state.wishlist.some((item) => item.id === book.id);
          if (isFavourited) {
            toast.info(`${book.title} removed from favourites`);
            return {
              wishlist: state.wishlist.filter((item) => item.id !== book.id),
            };
          }
          toast.success(`${book.title} added to favourites`);
          return {
            wishlist: [...state.wishlist, book],
          };
        });
      },
      
      isInWishlist: (bookId) => {
        return get().wishlist.some((item) => item.id === bookId);
      },
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "adf-store-storage",
    }
  )
);
