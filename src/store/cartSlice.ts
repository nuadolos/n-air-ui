import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../types";
const slice = createSlice({
  name: "cart",
  initialState: [] as CartItem[],
  reducers: {
    upsertItem(state, action: PayloadAction<CartItem>) {
      const index = state.findIndex((item) => item.key === action.payload.key);
      if (index < 0) state.push(action.payload);
      else state[index] = action.payload;
    },
    removeItem(state, action: PayloadAction<string>) {
      return state.filter((item) => item.key !== action.payload);
    },
  },
});
export const { upsertItem, removeItem } = slice.actions;
export const cartReducer = slice.reducer;
