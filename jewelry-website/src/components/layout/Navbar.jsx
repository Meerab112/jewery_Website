import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { label: "High Jewelry", path: "/high-jewelry" },
  { label: "Jewelry", path: "/jewelry" },
  { label: "Love & Engagement", path: "/love-engagement" },
  { label: "Watches", path: "/watches" },
  { label: "Home", path: "/" },
  { label: "Accessories", path: "/accessories" },
  { label: "Gifts", path: "/gifts" },
  { label: "World of Lumière", path: "/world-of-brand" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-md py-3"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="text-center pb-3 border-b border-gray-100">
        <Link
          to="/"
          className="font-playfair text-2xl md:text-3xl font-light tracking-[0.25em] text-gray-900 hover:text-gray-600 transition-colors"
        >
          LUMIÈRE <span className="text-gold">&</span> CO.
        </Link>
      </div>

      <div className="relative flex items-center justify-between px-6 pt-3">
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 w-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] tracking-[0.15em] uppercase font-medium transition-colors duration-200 whitespace-nowrap
              ${
                location.pathname === link.path
                  ? "text-gold border-b border-gold pb-0.5"
                  : "text-gray-700 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 absolute right-6 top-0">
          <button className="text-gray-700 hover:text-gold transition-colors">
            <Search size={18} />
          </button>

          <button className="text-gray-700 hover:text-gold transition-colors">
            <Heart size={18} />
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="text-gray-700 hover:text-gold transition-colors relative"
          >
            <ShoppingBag size={18} />

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:block text-xs">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 text-gray-700 hover:text-gold transition-colors"
            >
              <User size={18} />
              <span className="hidden md:block text-xs">Login</span>
            </button>
          )}

          <button
            className="lg:hidden text-gray-700 hover:text-gold transition-colors ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-medium text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-3 text-red-600 font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full text-left px-6 py-3 text-gray-700 font-medium"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
} /*import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { label: "High Jewelry", path: "/high-jewelry" },
  { label: "Jewelry", path: "/jewelry" },
  { label: "Love & Engagement", path: "/love-engagement" },
  { label: "Watches", path: "/watches" },
  { label: "Home", path: "/" },
  { label: "Accessories", path: "/accessories" },
  { label: "Gifts", path: "/gifts" },
  { label: "World of Lumière", path: "/world-of-brand" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white shadow-md py-3" : "bg-white/95 backdrop-blur-sm py-4"}`}
    >
      <div className="text-center pb-3 border-b border-gray-100">
        <Link
          to="/"
          className="font-playfair text-2xl md:text-3xl font-light tracking-[0.25em] text-gray-900 hover:text-gray-600 transition-colors"
        >
          LUMIÈRE <span className="text-gold">&</span> CO.
        </Link>
      </div>

      <div className="relative flex items-center justify-between px-6 pt-3">
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 w-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] tracking-[0.15em] uppercase font-medium transition-colors duration-200 whitespace-nowrap
                ${location.pathname === link.path ? "text-gold border-b border-gold pb-0.5" : "text-gray-700 hover:text-gold"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 absolute right-6 top-0">
          <button className="text-gray-700 hover:text-gold transition-colors">
            <Search size={18} />
          </button>
          <button className="text-gray-700 hover:text-gold transition-colors">
            <Heart size={18} />
          </button>

         // {✅ Cart button with live count + navigation }
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-700 hover:text-gold transition-colors relative"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden text-gray-700 hover:text-gold transition-colors ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-medium text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
*/
