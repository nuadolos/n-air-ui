import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Booking, BookingInput } from "../types";
import type { RootState } from "../app/store";
import { createBooking, checkInBooking } from "../api/bookings";
import { errorMessage } from "../api/client";
import { removeItem } from "./cartSlice";
export const purchaseTickets = createAsyncThunk<
  void,
  BookingInput[],
  { state: RootState; rejectValue: string }
>(
  "bookings/purchase",
  async (inputs, { dispatch, getState, rejectWithValue }) => {
    for (const input of inputs) {
      const state = getState();
      if (state.auth.user?.email !== input.owner)
        return rejectWithValue("Войдите в свой профиль");
      if (!state.cart.some((item) => item.key === input.item.key))
        return rejectWithValue("Состав корзины изменился");
      try {
        const booking = await createBooking(input);
        dispatch(addBooking(booking));
        dispatch(removeItem(input.item.key));
      } catch (error) {
        return rejectWithValue(errorMessage(error));
      }
    }
  },
  {
    condition: (_, { getState }) =>
      !getState().bookings.sending && !getState().bookings.checking,
  },
);
export const registerBooking = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  "bookings/checkin",
  async (id, { getState, rejectWithValue }) => {
    const booking = getState().bookings.items.find(
      (item) =>
        item.id === id && item.input.owner === getState().auth.user?.email,
    );
    if (!booking || booking.checkedIn)
      return rejectWithValue("Регистрация недоступна");
    try {
      await checkInBooking(booking);
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
  {
    condition: (_, { getState }) =>
      !getState().bookings.checking && !getState().bookings.sending,
  },
);
const slice = createSlice({
  name: "bookings",
  initialState: {
    items: [] as Booking[],
    sending: false,
    checking: false,
    error: "",
  },
  reducers: {
    addBooking(state, action: PayloadAction<Booking>) {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(purchaseTickets.pending, (state) => {
        state.sending = true;
        state.error = "";
      })
      .addCase(purchaseTickets.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(purchaseTickets.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || "Не удалось оформить перелёт";
      });
    builder
      .addCase(registerBooking.pending, (state) => {
        state.checking = true;
        state.error = "";
      })
      .addCase(registerBooking.fulfilled, (state, action) => {
        state.checking = false;
        const booking = state.items.find((item) => item.id === action.payload);
        if (booking) booking.checkedIn = true;
      })
      .addCase(registerBooking.rejected, (state, action) => {
        state.checking = false;
        state.error = action.payload || "Регистрация не выполнена";
      });
  },
});
export const { addBooking } = slice.actions;
export const bookingsReducer = slice.reducer;
