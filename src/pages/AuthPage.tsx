import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { signIn } from "../store/authSlice";
import { emailValid } from "../utils/booking";
export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isRegister = mode === "register";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (
      !emailValid(email.trim()) ||
      password.length < 6 ||
      (isRegister && (!firstName.trim() || !lastName.trim()))
    ) {
      setError("Проверьте поля. Пароль должен содержать минимум 6 символов.");
      return;
    }
    dispatch(
      signIn({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
      }),
    );
    navigate(location.state?.from === "/checkout" ? "/checkout" : "/profile", {
      replace: true,
    });
  }
  if (user) return <Navigate to="/profile" replace />;
  return (
    <Card sx={{ maxWidth: 470, mx: "auto", p: { xs: 3, md: 4 }, my: 3 }}>
      <Typography variant="h2">Добро пожаловать</Typography>
      <Typography color="text.secondary" mt={1} mb={3}>
        Ваши путешествия — в одном месте.
      </Typography>
      <Tabs
        value={mode}
        onChange={(_, value) => setMode(value)}
        textColor="secondary"
        sx={{ mb: 3 }}
      >
        <Tab value="login" label="Вход" />
        <Tab value="register" label="Регистрация" />
      </Tabs>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <TextField
              required
              label="Имя"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              required
              label="Фамилия"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </>
        )}
        <TextField
          required
          type="email"
          label="Электронная почта"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
        <TextField
          required
          type="password"
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isRegister ? "new-password" : "current-password"}
          helperText="Не менее 6 символов"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained">
          {isRegister ? "Создать профиль" : "Войти"}
        </Button>
      </Stack>
    </Card>
  );
}
