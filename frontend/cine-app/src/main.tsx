import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Globals.css";
import App from "./App.tsx";
import store from "./Redux/Store.tsx";
import { Provider } from "react-redux";
import ThemeProvider from "./Redux/DarkThemeSlice/ThemeProvider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}`}>
            <App />
          </GoogleOAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
