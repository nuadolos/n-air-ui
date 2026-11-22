import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { purchaseTickets } from "../store/bookingsSlice";
import { signIn } from "../store/authSlice";
import { validateCard } from "../utils/booking";
import { money } from "../utils/format";
import { CardFields, emptyCard } from "../components/CardFields";
export function CheckoutPage() {
  const user = useAppSelector((state) => state.auth.user)!;
  const cart = useAppSelector((state) => state.cart);
  const {
    sending,
    checking,
    error: serverError,
  } = useAppSelector((state) => state.bookings);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [card, setCard] = useState(emptyCard);
  const [error, setError] = useState("");
  const total = cart.reduce((sum, item) => sum + item.flight.price, 0);
  async function handleSubmit(event: React.FormEvent) {
    // Отменяем стандартную отправку формы, чтобы обработать её без перезагрузки страницы
    event.preventDefault();
    setError("");
    const passengerFirstName = firstName.trim();
    const passengerLastName = lastName.trim();
    if (!passengerFirstName || !passengerLastName) {
      setError("Укажите имя и фамилию");
      return;
    }
    const cardError = validateCard(
      card.number,
      `${card.month}/${card.year.slice(-2)}`,
      card.cvc,
    );
    if (cardError) {
      setError(cardError);
      return;
    }
    dispatch(
      signIn({
        ...user,
        firstName: passengerFirstName,
        lastName: passengerLastName,
      }),
    );
    const result = await dispatch(
      purchaseTickets(
        cart.map((item) => ({
          item,
          owner: user.email,
          passenger: `${passengerFirstName} ${passengerLastName}`,
          firstName: passengerFirstName,
          lastName: passengerLastName,
        })),
      ),
    );
    setCard(emptyCard);
    if (purchaseTickets.fulfilled.match(result)) navigate("/profile");
  }
  if (!cart.length)
    return (
      <Alert severity="info">
        В корзине пока нет рейсов. <Link to="/">Перейти к поиску</Link>
      </Alert>
    );
  return (
    <Stack spacing={3}>
      <Typography variant="h2">Оформление перелёта</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0,1fr)", md: "1fr 320px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h3">01 / Пассажир</Typography>
              <TextField
                required
                label="Имя"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                disabled={sending}
              />
              <TextField
                required
                label="Фамилия"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                disabled={sending}
              />
            </Stack>
          </Card>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h3">02 / Оплата картой</Typography>
              <CardFields value={card} onChange={setCard} disabled={sending} />
            </Stack>
          </Card>
        </Stack>
        <Card sx={{ p: 3, position: { md: "sticky" }, top: 24 }}>
          <Typography variant="h3" mb={3}>
            Ваш заказ
          </Typography>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Box key={item.key}>
                <Typography fontWeight={500}>
                  {item.flight.from.code} → {item.flight.to.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.flight.number}
                </Typography>
                <Typography>{money(item.flight.price)}</Typography>
              </Box>
            ))}
          </Stack>
          <Typography
            variant="h2"
            sx={{ mt: 3, pt: 3, borderTop: "1px solid #ddd" }}
          >
            {money(total)}
          </Typography>
          {(error || serverError) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error || serverError}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={sending || checking}
            sx={{ mt: 3 }}
          >
            {sending ? "Оформляем…" : "Оплатить"}
          </Button>
        </Card>
      </Box>
    </Stack>
  );
}
