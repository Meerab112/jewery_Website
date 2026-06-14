import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ChevronRight, ShieldCheck, Loader2 } from "lucide-react";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;
const TAX_RATE = 0.08;

export default function Checkout() {
  const { cartItems, cartLoading, fetchCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          firstName: user.first_name || user.name?.split(" ")[0] || "",
          lastName: user.last_name || user.name?.split(" ")[1] || "",
        }));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) fetchCart(user.id);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const grand = subtotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s\-().]{7,15}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number.";
    }
    if (!form.country.trim()) e.country = "Country is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleContinue = () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const firstKey = Object.keys(validation)[0];
      document
        .getElementById(firstKey)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    sessionStorage.setItem(
      "shippingInfo",
      JSON.stringify({ ...form, subtotal, shipping, tax, grand }),
    );
    navigate("/payment");
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-10">
          <span
            onClick={() => navigate("/cart")}
            className="cursor-pointer hover:text-black transition"
          >
            Cart
          </span>
          <ChevronRight size={12} />
          <span className="text-black">Checkout</span>
          <ChevronRight size={12} />
          <span>Payment</span>
        </div>

        <h1 className="font-playfair text-3xl font-light mb-10 text-center">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* ── LEFT: Forms ── */}
          <div className="lg:col-span-3 space-y-10">
            {/* Customer Information */}
            <section>
              <h2 className="font-playfair text-xl font-light mb-6 pb-3 border-b border-gray-200">
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="Jane"
                />
                <Field
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Doe"
                />
                <div className="col-span-2">
                  <Field
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="col-span-2">
                  <Field
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Information */}
            <section>
              <h2 className="font-playfair text-xl font-light mb-6 pb-3 border-b border-gray-200">
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  id="country"
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  error={errors.country}
                  placeholder="United States"
                />
                <Field
                  id="city"
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="New York"
                />
                <div className="col-span-2">
                  <Field
                    id="address"
                    label="Complete Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="123 Fifth Avenue, Apt 4B"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Field
                    id="postalCode"
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                    placeholder="10001"
                  />
                </div>
              </div>
            </section>

            {/* Secure badge */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              Your information is encrypted and secure.
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-7 sticky top-32">
              <h2 className="font-playfair text-xl font-light mb-6 pb-3 border-b border-gray-200">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-3 items-start">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="w-14 h-14 object-cover bg-white"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-sm font-light flex-shrink-0">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-1">
                  <span>Grand Total</span>
                  <span>${grand.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for
                  free shipping.
                </p>
              )}

              {/* Continue to Payment button */}
              <button
                onClick={handleContinue}
                disabled={submitting || cartItems.length === 0}
                className="w-full mt-7 bg-black text-white text-xs uppercase py-4 hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Processing…
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By continuing you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Field component ──────────────────────────────────────────────────
function Field({
  id,
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div id={id}>
      <label className="block text-xs uppercase tracking-[1.5px] text-gray-500 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm border ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        } focus:outline-none focus:border-black transition`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
