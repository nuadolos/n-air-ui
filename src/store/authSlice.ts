import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";
const slice = createSlice({
  name: "auth",
  initialState: { user: null as User | null },
  reducers: {
    signIn(state, action: PayloadAction<User>) {
      state.user = {
        ...action.payload,
        email: action.payload.email.trim().toLowerCase(),
      };
    },
    signOut(state) {
      state.user = null;
    },
  },
});
export const { signIn, signOut } = slice.actions;
export const authReducer = slice.reducer;
