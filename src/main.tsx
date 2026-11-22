import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter } from "react-router-dom";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/cyrillic-600.css";
import { store } from "./app/store";
import { theme } from "./app/theme";
import { App } from "./app/App";
// Provider даёт компонентам доступ к Redux, ThemeProvider — к общей теме MUI
// HashRouter хранит маршрут после #, поэтому прямые ссылки работают на GitHub Pages
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode в разработке повторно запускает эффекты, чтобы выявить ошибки их очистки
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
