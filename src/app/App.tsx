import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import {
  Link,
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAppSelector } from "./store";
import { FlightsPage } from "../pages/FlightsPage";
import { FlightPage } from "../pages/FlightPage";
import { CartPage } from "../pages/CartPage";
import { AuthPage } from "../pages/AuthPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ProfilePage } from "../pages/ProfilePage";
// Без профиля перенаправляем на вход и запоминаем исходный маршрут для возврата
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location.pathname }} replace />
  );
}
export function App() {
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box component="header" sx={{ bgcolor: "#18181B", color: "white" }}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ minHeight: 84, gap: 2 }}
          >
            <Stack
              component={Link}
              to="/"
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ textDecoration: "none" }}
            >
              <FlightTakeoff sx={{ color: "primary.main", fontSize: 30 }} />
              <Typography
                sx={{ fontSize: 27, fontWeight: 600, letterSpacing: "-.06em" }}
              >
                N AIR<span style={{ color: "#A3E635" }}>.</span>
              </Typography>
            </Stack>
            <Button
              component={NavLink}
              to="/"
              sx={{
                color: "white",
                display: { xs: "none", sm: "inline-flex" },
                "&.active": { color: "primary.main" },
              }}
            >
              Поиск рейсов
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to="/cart"
                sx={{ color: "white", minWidth: 40, px: { xs: 1, sm: 2 } }}
                aria-label="Корзина"
              >
                <Badge badgeContent={cart.length} color="primary">
                  <ShoppingBagOutlined />
                </Badge>
                <Box
                  component="span"
                  sx={{ ml: 1, display: { xs: "none", sm: "inline" } }}
                >
                  Корзина
                </Box>
              </Button>
              <Button
                component={Link}
                to={user ? "/profile" : "/auth"}
                sx={{ color: "white", minWidth: 40, px: { xs: 1, sm: 2 } }}
                aria-label="Личный кабинет"
              >
                <PersonOutline />
                <Box
                  component="span"
                  sx={{ ml: 1, display: { xs: "none", sm: "inline" } }}
                >
                  {user ? "Кабинет" : "Войти"}
                </Box>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 5 }, flex: 1 }}
      >
        <Routes>
          <Route path="/" element={<FlightsPage />} />
          <Route path="/flights/:id" element={<FlightPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <Stack spacing={3}>
                <Typography variant="h2">Страница не найдена</Typography>
                <Button component={Link} to="/">
                  Вернуться к рейсам
                </Button>
              </Stack>
            }
          />
        </Routes>
      </Container>
      <Container component="footer" maxWidth="lg">
        <Box sx={{ py: 3, borderTop: "1px solid #ddd" }}>
          <Typography variant="caption" color="text.secondary">
            N Air · Все ваши перелёты
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
