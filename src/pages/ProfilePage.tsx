import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { signOut } from "../store/authSlice";
import { registerBooking } from "../store/bookingsSlice";
import { date, time, money } from "../utils/format";
export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user)!;
  const bookingsState = useAppSelector((state) => state.bookings);
  const dispatch = useAppDispatch();
  const bookings = bookingsState.items.filter(
    (booking) => booking.input.owner === user.email,
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h2">Личный кабинет</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h3">Пассажир</Typography>
            <Typography sx={{ overflowWrap: "anywhere" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
              {user.email}
            </Typography>
            <Button
              color="secondary"
              disabled={bookingsState.sending || bookingsState.checking}
              onClick={() => dispatch(signOut())}
            >
              Выйти из профиля
            </Button>
          </Stack>
        </Card>
        <Stack spacing={3}>
          <Typography variant="h3">Мои билеты · {bookings.length}</Typography>
          {bookingsState.error && (
            <Alert severity="error">{bookingsState.error}</Alert>
          )}
          {!bookings.length && (
            <Card sx={{ p: 4 }}>
              <Typography variant="h3">Ваше путешествие ещё впереди</Typography>
              <Typography color="text.secondary" mt={1}>
                Здесь появятся оформленные билеты и регистрация на рейс.
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Выбрать рейс
              </Button>
            </Card>
          )}
          {[...bookings].reverse().map((booking) => {
            const flight = booking.input.item.flight;

            return (
              <Card key={booking.locator} sx={{ overflow: "hidden" }}>
                <Box sx={{ bgcolor: "#18181B", color: "white", p: 2.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FlightTakeoff sx={{ color: "primary.main" }} />
                      <Typography fontWeight={600}>ПОСАДОЧНЫЙ ТАЛОН</Typography>
                    </Stack>
                    <Typography variant="caption">{booking.locator}</Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Box>
                      <Typography variant="h2">{flight.from.code}</Typography>
                      <Typography variant="body2">
                        {flight.from.city}
                      </Typography>
                      <Typography>
                        {time(flight.departure, flight.from.timezone)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {date(flight.departure, flight.from.timezone)}
                      </Typography>
                    </Box>
                    <FlightTakeoff sx={{ color: "text.secondary" }} />
                    <Box textAlign="right">
                      <Typography variant="h2">{flight.to.code}</Typography>
                      <Typography variant="body2">{flight.to.city}</Typography>
                      <Typography>
                        {time(flight.arrival, flight.to.timezone)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {date(flight.arrival, flight.to.timezone)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    gap={2}
                    flexWrap="wrap"
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        ПАССАЖИР
                      </Typography>
                      <Typography fontWeight={600}>
                        {booking.input.passenger}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        РЕЙС / МЕСТО
                      </Typography>
                      <Typography fontWeight={600}>
                        {flight.number} / {booking.seat}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Divider sx={{ borderStyle: "dashed", borderWidth: 1 }} />
                <Box sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {money(booking.total)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Бронирование подтверждено
                      </Typography>
                    </Box>
                    {booking.checkedIn ? (
                      <Chip
                        color="success"
                        icon={<CheckCircleOutline />}
                        label="Регистрация пройдена"
                      />
                    ) : (
                      <Button
                        variant="contained"
                        disabled={
                          bookingsState.checking || bookingsState.sending
                        }
                        onClick={() =>
                          void dispatch(registerBooking(booking.id))
                        }
                      >
                        {bookingsState.checking
                          ? "Подождите…"
                          : "Зарегистрироваться"}
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
