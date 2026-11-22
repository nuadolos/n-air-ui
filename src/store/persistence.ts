import type { CartItem, User } from "../types";

export interface SavedState {
  cart: CartItem[];
  user: User | null;
}

export function readSaved(): SavedState | undefined {
  try {
    const data = JSON.parse(localStorage.getItem("n-air") || "null");
    if (!data || !Array.isArray(data.cart)) return;
    if (
      data.user !== null &&
      (typeof data.user !== "object" || Array.isArray(data.user))
    )
      return;
    return { cart: data.cart, user: data.user };
  } catch {
    return;
  }
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem("n-air", JSON.stringify(state));
  } catch {
    return;
  }
}
