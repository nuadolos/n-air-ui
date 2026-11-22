import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authReducer } from "../store/authSlice";
import { cartReducer } from "../store/cartSlice";
import { flightsReducer } from "../store/flightsSlice";
import { bookingsReducer } from "../store/bookingsSlice";
import { readSaved, saveState } from "../store/persistence";
const saved = readSaved();
// Store объединяет слайсы: каждый управляет своей частью общего состояния
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    flights: flightsReducer,
    bookings: bookingsReducer,
  },
  preloadedState: saved
    ? {
        auth: { user: saved.user },
        cart: saved.cart,
      }
    : undefined,
});
// После изменений сохраняем только профиль и корзину; билеты остаются в памяти
store.subscribe(() => {
  const state = store.getState();
  saveState({
    cart: state.cart,
    user: state.auth.user,
  });
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// dispatch отправляет действия в Redux; useSelector подписывает компонент на выбранные данные
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
