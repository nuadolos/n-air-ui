import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  palette: {
    primary: { main: "#A3E635", dark: "#84CC16", contrastText: "#18181B" },
    secondary: { main: "#18181B" },
    success: { main: "#047857" },
    background: { default: "#F4F4F5", paper: "#FFFFFF" },
    text: { primary: "#18181B", secondary: "#71717A" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
      fontWeight: 600,
      letterSpacing: "-0.06em",
      lineHeight: 1.08,
    },
    h2: { fontSize: "2rem", fontWeight: 600, letterSpacing: "-0.04em" },
    h3: { fontSize: "1.4rem", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { padding: "11px 22px" } },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderColor: "#E4E4E7" } },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontVariantNumeric: "tabular-nums" },
        a: { color: "inherit" },
        "*:focus-visible": { outline: "2px solid #047857", outlineOffset: 3 },
      },
    },
  },
});
