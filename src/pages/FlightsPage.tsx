import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import { initialQuery } from "../api/flights";
import { useAppDispatch, useAppSelector } from "../app/store";
import {
  fetchFlights,
  fetchAirlines,
  setFilters,
  setPage,
  resetFilters,
} from "../store/flightsSlice";
import { FlightCard } from "../components/FlightCard";
export function FlightsPage() {
  const dispatch = useAppDispatch();
  const {
    items,
    loading,
    error,
    query,
    total,
    pages,
    airlines,
    airlinesError,
  } = useAppSelector((state) => state.flights);
  // useState хранит черновик формы и вызывает перерисовку при его изменении
  // В Redux query попадает только после нажатия «Применить»
  const [filters, setLocalFilters] = useState({
    airline: query.airline,
    budget: query.budget,
    sort: query.sort,
  });
  // Эффект запускается при открытии страницы и изменении зависимостей dispatch или query
  useEffect(() => {
    const request = dispatch(fetchFlights(query));
    // React вызывает очистку перед повторным эффектом и при уходе со страницы
    return () => request.abort();
  }, [dispatch, query]);
  useEffect(() => {
    void dispatch(fetchAirlines());
  }, [dispatch]);
  function reset() {
    setLocalFilters({
      airline: initialQuery.airline,
      budget: initialQuery.budget,
      sort: initialQuery.sort,
    });
    dispatch(resetFilters());
  }
  function handleApply(event: React.FormEvent) {
    event.preventDefault();
    dispatch(setFilters(filters));
  }
  return (
    <Stack spacing={4}>
      <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#EAF0E4", borderRadius: 3 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 34 } }}>
          Ближе к тому, что важно.
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Выберите рейс для следующего путешествия.
        </Typography>
      </Box>
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              disabled={loading}
              onClick={() => void dispatch(fetchFlights(query))}
            >
              Повторить
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "250px minmax(0, 1fr)",
          },
          gap: 3,
        }}
      >
        <Card
          sx={{
            p: 2.5,
            alignSelf: "start",
          }}
        >
          <Stack component="form" spacing={2.5} onSubmit={handleApply}>
            <Typography variant="h3">Параметры перелёта</Typography>
            {airlinesError && (
              <Button onClick={() => void dispatch(fetchAirlines())}>
                Повторить загрузку авиакомпаний
              </Button>
            )}
            <TextField
              label="Авиакомпания"
              select
              value={filters.airline}
              onChange={(event) =>
                setLocalFilters({ ...filters, airline: event.target.value })
              }
            >
              <MenuItem value="">Все авиакомпании</MenuItem>
              {airlines.map((airline) => (
                <MenuItem key={airline.id} value={airline.id}>
                  {airline.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Бюджет до, ₽"
              type="number"
              value={filters.budget}
              onChange={(event) =>
                setLocalFilters({ ...filters, budget: event.target.value })
              }
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
            />
            <TextField
              label="Сортировка"
              select
              value={filters.sort}
              onChange={(event) =>
                setLocalFilters({ ...filters, sort: event.target.value })
              }
            >
              <MenuItem value="price">Сначала дешевле</MenuItem>
              <MenuItem value="time">По времени вылета</MenuItem>
            </TextField>
            <Button type="submit" variant="contained">
              Применить
            </Button>
            <Button color="secondary" onClick={reset}>
              Сбросить фильтры
            </Button>
          </Stack>
        </Card>
        <Stack spacing={2}>
          <Typography fontWeight={600}>
            {loading ? "Поиск рейсов…" : `Найдено рейсов: ${total}`}
          </Typography>
          {loading
            ? [1, 2, 3].map((placeholder) => (
                <Skeleton key={placeholder} variant="rounded" height={200} />
              ))
            : items.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
          {pages > 1 && (
            <Pagination
              count={pages}
              page={query.page}
              onChange={(_, value) => dispatch(setPage(value))}
              disabled={loading}
              size="small"
              getItemAriaLabel={(type, value) =>
                type === "page"
                  ? `Страница ${value}`
                  : type === "next"
                    ? "Следующая страница"
                    : type === "previous"
                      ? "Предыдущая страница"
                      : "Страница"
              }
            />
          )}
          {!loading && !error && !items.length && (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h3" mb={1}>
                Рейсы не найдены
              </Typography>
              <Typography color="text.secondary">
                Попробуйте изменить авиакомпанию или бюджет.
              </Typography>
              <Button onClick={reset} color="secondary">
                Сбросить фильтры
              </Button>
            </Card>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
