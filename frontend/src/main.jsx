import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CuponProviderWrapper } from "./contexts/Cupon.context.jsx";
import { AuthProvider } from "./contexts/Auth.context.jsx";
import { CartProvider } from "./contexts/Cart.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <CuponProviderWrapper>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CuponProviderWrapper>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
