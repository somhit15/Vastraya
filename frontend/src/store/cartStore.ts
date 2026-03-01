import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.size === newItem.size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id && item.size === newItem.size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...newItem, quantity: 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.size === size)),
        });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'vastraya-cart',
      skipHydration: true, // Handle hydration manually for SSR safety
    }
  )
);

// --- Selectors ---
export const getTotal = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const getTotalItems = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);

export const getWhatsAppMessage = (state: CartState, whatsappNumber: string) => {
  let message = 'Hello! I want to order from Vastraya:%0A%0A';
  state.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - Size: [${item.size}] - Qty: [${item.quantity}] - Rs. [${item.price * item.quantity}]%0A`;
  });
  message += `%0A*Total: Rs. [${getTotal(state)}]*%0A%0A`;
  message += 'Please confirm availability.';
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};
