import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, selectedSize: string) => void;
  removeItem: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      addItem: (product, selectedSize) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.$id === product.$id && item.selectedSize === selectedSize
        );

        set({ isOpen: true }); // Open drawer when item added

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.$id === product.$id && item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...product, selectedSize, quantity: 1 }],
          });
        }
      },
      removeItem: (itemId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.$id === itemId && item.selectedSize === size)
          ),
        });
      },
      updateQuantity: (itemId, size, quantity) => {
        set({
          items: get().items.map((item) =>
            item.$id === itemId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (acc, item) => acc + (item.sale_price || item.price) * item.quantity,
          0
        ),
    }),
    {
      name: 'vastraya-cart',
    }
  )
);
