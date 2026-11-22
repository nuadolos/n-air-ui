import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import type { Flight } from "../types";
import {
  getFlights,
  getAirlines,
  initialQuery,
  type FlightQuery,
  type FlightPageResult,
} from "../api/flights";
import { errorMessage } from "../api/client";
// Асинхронный thunk выполняет запрос и отправляет в Redux действия о его ходе и результате
export const fetchFlights = createAsyncThunk<
  FlightPageResult,
  FlightQuery,
  { rejectValue: string }
>("flights/load", async (query, api) => {
  try {
    return await getFlights(query, api.signal);
  } catch (error) {
    return api.rejectWithValue(errorMessage(error));
  }
});
export const fetchAirlines = createAsyncThunk("flights/airlines", getAirlines, {
  condition: (_, api) => {
    const state = (api.getState() as RootState).flights;
    return !state.airlinesLoading && !state.airlines.length;
  },
});
const slice = createSlice({
  name: "flights",
  initialState: {
    items: [] as Flight[],
    loading: false,
    error: "",
    query: initialQuery,
    total: 0,
    pages: 0,
    requestId: "",
    airlines: [] as { id: string; name: string }[],
    airlinesLoading: false,
    airlinesError: false,
  },
  reducers: {
    setFilters(
      state,
      action: PayloadAction<{
        airline?: string;
        budget?: string;
        sort?: string;
      }>,
    ) {
      state.query = { ...state.query, ...action.payload, page: 1 };
      state.requestId = "";
      state.loading = true;
      state.error = "";
      state.items = [];
    },
    setPage(state, action: PayloadAction<number>) {
      state.query.page = action.payload;
      state.requestId = "";
      state.loading = true;
      state.error = "";
      state.items = [];
    },
    resetFilters(state) {
      state.query = { ...initialQuery };
      state.requestId = "";
      state.loading = true;
      state.error = "";
      state.items = [];
    },
  },
  // pending — запрос начат, fulfilled — получен результат, rejected — ошибка или отмена
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.loading = true;
        state.error = "";
        state.items = [];
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        // Ответ старого запроса не должен заменять результаты более нового поиска
        if (state.requestId !== action.meta.requestId) return;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.loading = false;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.loading = false;
        if (!action.meta.aborted)
          state.error = action.payload || "Не удалось загрузить рейсы";
      });
    builder
      .addCase(fetchAirlines.pending, (state) => {
        state.airlinesLoading = true;
        state.airlinesError = false;
      })
      .addCase(fetchAirlines.fulfilled, (state, action) => {
        state.airlines = action.payload;
        state.airlinesLoading = false;
      })
      .addCase(fetchAirlines.rejected, (state) => {
        state.airlinesLoading = false;
        state.airlinesError = true;
      });
  },
});
export const { setFilters, setPage, resetFilters } = slice.actions;
export const flightsReducer = slice.reducer;
