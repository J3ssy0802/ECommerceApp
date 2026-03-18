import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import type { CartItem } from './cartSlice';

const SESSION_KEY = 'cart_items';

function loadCartFromSession(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToSession(items: CartItem[]): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
}

const savedItems = loadCartFromSession();

const preloadedState = savedItems.length > 0
  ? {
      cart: {
        items: savedItems,
        totalItems: savedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: savedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    }
  : undefined;

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

// Persist cart items to sessionStorage on every state change
store.subscribe(() => {
  saveCartToSession(store.getState().cart.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
