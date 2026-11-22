import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFlight } from "../api/flights";
import { errorMessage } from "../api/client";
import { useAppDispatch, useAppSelector } from "../app/store";
import { upsertItem } from "../store/cartSlice";
import { FlightCard } from "../components/FlightCard";
import type { Flight } from "../types";
import { money } from "../utils/format";
export function FlightPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sending = useAppSelector((state) => state.bookings.sending);
  const [flight, setFlight] = useState<Flight>();
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let active = true;
    setFlight(undefined);
    setError("");
    if (id)
      void getFlight(id)
        .then((loadedFlight) => {
          if (active) setFlight(loadedFlight);
        })
        .catch((error) => {
          if (active) setError(errorMessage(error));
        });
    return () => {
      active = false;
    };
  }, [id, retryCount]);
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button onClick={() => setRetryCount(retryCount + 1)}>
            Повторить
          </Button>
        }
      >
        {error}
      </Alert>
    );
  if (!flight) return <CircularProgress />;
  return (
    <Stack spacing={3}>
      <Button
        component={Link}
        to="/"
        color="secondary"
        startIcon={<ArrowBack />}
        sx={{ alignSelf: "start" }}
      >
        К поиску рейсов
      </Button>
      <Typography variant="h2">Ваш следующий перелёт</Typography>
      <FlightCard flight={flight} showAction={false} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0,1fr)", md: "1fr 320px" },
          gap: 3,
        }}
      >
        <Card sx={{ p: 3 }}>
          <Typography variant="h3" mb={2}>
            Условия перелёта
          </Typography>
          <Stack spacing={2}>
            <Typography>Самолёт: {flight.aircraft}</Typography>
            <Typography>Доступно мест: {flight.available}</Typography>
            <Typography color="text.secondary">
              Свободное место назначается при оформлении бронирования. Его номер
              появится в вашем билете.
            </Typography>
          </Stack>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography color="text.secondary">Стоимость билета</Typography>
          <Typography variant="h2" my={2}>
            {money(flight.price)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            disabled={sending || flight.available < 1}
            onClick={() => {
              dispatch(upsertItem({ key: flight.id, flight }));
              navigate("/cart");
            }}
          >
            Добавить в корзину
          </Button>
        </Card>
      </Box>
    </Stack>
  );
}
