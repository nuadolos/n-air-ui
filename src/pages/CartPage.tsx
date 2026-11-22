import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { removeItem } from "../store/cartSlice";
import { FlightCard } from "../components/FlightCard";
import { money } from "../utils/format";
export function CartPage() {
  const items = useAppSelector((state) => state.cart);
  const { sending } = useAppSelector((state) => state.bookings);
  const dispatch = useAppDispatch();
  const total = items.reduce((sum, item) => sum + item.flight.price, 0);
  return (
    <Stack spacing={3}>
      <Typography variant="h2">Корзина</Typography>
      {!items.length ? (
        <Card sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h3">Здесь появятся выбранные рейсы</Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
            Найти перелёт
          </Button>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0,1fr)", md: "1fr 300px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Stack spacing={3}>
            {items.map((item) => (
              <Box key={item.key}>
                <FlightCard flight={item.flight} showAction={false} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 2, py: 1 }}
                >
                  <Typography>{money(item.flight.price)}</Typography>
                  <Button
                    color="error"
                    disabled={sending}
                    onClick={() => dispatch(removeItem(item.key))}
                  >
                    Удалить
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Card sx={{ p: 3 }}>
            <Typography variant="h3">Итого за билеты</Typography>
            <Typography variant="h2" my={3}>
              {money(total)}
            </Typography>
            <Button
              component={Link}
              to="/checkout"
              fullWidth
              variant="contained"
              disabled={sending}
            >
              К оформлению
            </Button>
          </Card>
        </Box>
      )}
    </Stack>
  );
}
