/*
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Register from "./pages/Register";
import Home from "./pages/Home";
import HighJewelry from "./pages/HighJewelry";
import Jewelry from "./pages/Jewelry";
import LoveEngagement from "./pages/LoveEngagement";
import Watches from "./pages/Watches";
import Accessories from "./pages/Accessories";
import Gifts from "./pages/Gifts";
import WorldOfBrand from "./pages/WorldOfBrand";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Checkout from "./pages/Checkout";

import { CartProvider } from "./context/CartContext";

export default function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        {!hideLayout && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/" element={<Home />} />
            <Route path="/high-jewelry" element={<HighJewelry />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/love-engagement" element={<LoveEngagement />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/world-of-brand" element={<WorldOfBrand />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </CartProvider>
  );
}*/
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Register from "./pages/Register";
import Home from "./pages/Home";
import HighJewelry from "./pages/HighJewelry";
import Jewelry from "./pages/Jewelry";
import LoveEngagement from "./pages/LoveEngagement";
import Watches from "./pages/Watches";
import Accessories from "./pages/Accessories";
import Gifts from "./pages/Gifts";
import WorldOfBrand from "./pages/WorldOfBrand";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment"; // ← NEW
import OrderConfirmation from "./pages/OrderConfirmation"; // ← NEW

import { CartProvider } from "./context/CartContext";

export default function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        {!hideLayout && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/" element={<Home />} />
            <Route path="/high-jewelry" element={<HighJewelry />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/love-engagement" element={<LoveEngagement />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/world-of-brand" element={<WorldOfBrand />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} /> {/* ← NEW */}
            <Route
              path="/order-confirmation/:orderNumber"
              element={<OrderConfirmation />}
            />
            {/* ← NEW */}
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </CartProvider>
  );
}
