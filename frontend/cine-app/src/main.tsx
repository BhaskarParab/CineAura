import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Globals.css";
import App from "./App.tsx";
import store from "./Redux/Store.tsx";
import { Provider } from "react-redux";
import ThemeProvider from "./Redux/DarkThemeSlice/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
