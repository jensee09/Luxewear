import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import productsJson from '../data/products.json';

export type Product = {
  id: string; title: string; category: string; price: number; oldPrice: number; tag: string;
  image: string; rating: number; reviewCount: number; sizes: string[]; colors: string[];
  description: string; featured: boolean;
};
export type CartLine = { productId: string; quantity: number; size: string; color: string };
export type DeliveryAddress = { fullName: string; phone: string; email: string; address: string; city: string; state: string; pin: string };
export type Order = {
  id: string; items: CartLine[]; subtotal: number; discount: number; shipping: number; codFee: number; total: number;
  address: DeliveryAddress; placedAt: string; eta: string; status: number;
};
export const products = productsJson as Product[];

const saved = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
};

type LuxeStore = {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  user: { name: string; email: string } | null;
  promoApplied: boolean;
  theme: 'light' | 'dark';
  addToCart: (productId: string, size: string, color: string, quantity?: number) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  moveToWishlist: (productId: string, size: string) => void;
  toggleWishlist: (productId: string) => void;
  setPromo: (applied: boolean) => void;
  addOrder: (order: Order) => void;
  setUser: (name: string, email: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  clearCart: () => void;
};

export const useStore = create<LuxeStore>()(persist((set, get) => ({
  cart: saved('luxewear-cart', []),
  wishlist: saved('luxewear-wishlist', []),
  orders: saved('luxewear-orders', []),
  user: saved('luxewear-user', { name: 'Avery Morgan', email: 'avery@example.com' }),
  promoApplied: saved('luxewear-promo', false),
  theme: saved<'light' | 'dark'>('luxewear-theme', 'light'),
  addToCart: (productId, size, color, quantity = 1) => set((state) => {
    const existing = state.cart.find((line) => line.productId === productId && line.size === size && line.color === color);
    return { cart: existing
      ? state.cart.map((line) => line === existing ? { ...line, quantity: line.quantity + quantity } : line)
      : [...state.cart, { productId, size, color, quantity }] };
  }),
  setQuantity: (productId, size, quantity) => set((state) => ({ cart: quantity <= 0
    ? state.cart.filter((line) => !(line.productId === productId && line.size === size))
    : state.cart.map((line) => line.productId === productId && line.size === size ? { ...line, quantity } : line) })),
  removeFromCart: (productId, size) => set((state) => ({ cart: state.cart.filter((line) => !(line.productId === productId && line.size === size)) })),
  moveToWishlist: (productId, size) => {
    const { wishlist, cart } = get();
    set({ wishlist: wishlist.includes(productId) ? wishlist : [...wishlist, productId], cart: cart.filter((line) => !(line.productId === productId && line.size === size)) });
  },
  toggleWishlist: (productId) => set((state) => ({ wishlist: state.wishlist.includes(productId) ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId] })),
  setPromo: (applied) => set({ promoApplied: applied }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders], cart: [], promoApplied: false })),
  setUser: (name, email) => set({ user: { name, email } }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
  clearCart: () => set({ cart: [], promoApplied: false }),
}), {
  name: 'luxewear-store',
  partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist, orders: state.orders, user: state.user, promoApplied: state.promoApplied, theme: state.theme }) as LuxeStore,
}));

export const findProduct = (id: string) => products.find((item) => item.id === id);
export const cartCount = (cart: CartLine[]) => cart.reduce((total, line) => total + line.quantity, 0);
export const totalsFor = (cart: CartLine[], promoApplied: boolean) => {
  const subtotal = cart.reduce((total, line) => total + (findProduct(line.productId)?.price ?? 0) * line.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal > 999 ? 0 : 79;
  const codFee = subtotal === 0 ? 0 : 49;
  return { subtotal, discount, shipping, codFee, total: Math.max(0, subtotal - discount) + shipping + codFee };
};
