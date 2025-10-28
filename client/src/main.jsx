import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import {store} from './redux/store.js'
import { Provider } from 'react-redux';
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <Provider store={store}>
    <Router>
    <CartProvider>
      <App />
    </CartProvider>
    </Router>
    </Provider>
  </StrictMode>
);
