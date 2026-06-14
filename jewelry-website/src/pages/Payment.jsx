import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Loader2,
  Lock,
} from "lucide-react";

export default function Payment() {
  const { cartItems, clearCart, fetchCart, cartLoading } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [pageReady, setPageReady] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Always reflects latest cartItems — never stale in closures
  const cartItemsRef = useRef([]);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    const stored = sessionStorage.getItem("shippingInfo");
    if (!stored) {
      navigate("/checkout");
      return;
    }
    setShippingInfo(JSON.parse(stored));

    // Get user from localStorage
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {}

    console.log("[Payment] user from localStorage:", user);
    console.log("[Payment] user.id:", user?.id);

    if (!user?.id) {
      navigate("/login");
      return;
    }

    // Fetch cart and log what comes back
    fetch(`http://localhost:5000/api/cart/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        console.log("[Payment] raw cart API response:", data);
        // Also trigger context update
        return fetchCart(user.id);
      })
      .then(() => {
        console.log("[Payment] cartItems after fetch:", cartItemsRef.current);
        setPageReady(true);
      })
      .catch((err) => {
        console.error("[Payment] cart fetch error:", err);
        setFetchError(
          "Could not load your cart. Please go back to cart and try again.",
        );
        setPageReady(true);
      });
  }, []); // eslint-disable-line

  // Totals from live cartItems
  const subtotal = cartItemsRef.current.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0,
  );
  const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 15) : 0;
  const tax = subtotal * 0.08;
  const grand = subtotal + shipping + tax;

  // Also keep display totals from sessionStorage as fallback for the UI
  const displaySubtotal =
    cartItems.length > 0 ? subtotal : Number(shippingInfo?.subtotal ?? 0);
  const displayShipping =
    cartItems.length > 0 ? shipping : Number(shippingInfo?.shipping ?? 0);
  const displayTax =
    cartItems.length > 0 ? tax : Number(shippingInfo?.tax ?? 0);
  const displayGrand =
    cartItems.length > 0 ? grand : Number(shippingInfo?.grand ?? 0);

  // Card formatting
  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setCardDetails((p) => ({ ...p, [name]: value }));
    if (cardErrors[name]) setCardErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const validateCard = () => {
    const e = {};
    const raw = cardDetails.cardNumber.replace(/\s/g, "");
    if (!raw || raw.length < 13) e.cardNumber = "Enter a valid card number.";
    if (!cardDetails.cardHolder.trim())
      e.cardHolder = "Cardholder name is required.";
    if (!cardDetails.expiry || cardDetails.expiry.length < 5)
      e.expiry = "Enter a valid expiry (MM/YY).";
    if (!cardDetails.cvv || cardDetails.cvv.length < 3)
      e.cvv = "Enter a valid CVV.";
    return e;
  };

  // ── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setApiError("");

    if (cartLoading) {
      setApiError("Please wait, your cart is still loading…");
      return;
    }

    if (paymentMethod === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length > 0) {
        setCardErrors(errs);
        return;
      }
    }

    // Read from ref for latest value
    const liveCart = cartItemsRef.current;
    console.log("[handlePlaceOrder] liveCart:", liveCart);

    if (!liveCart || liveCart.length === 0) {
      // Last-resort: re-fetch before giving up
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.id) {
        try {
          const r = await fetch(`http://localhost:5000/api/cart/${user.id}`);
          const freshCart = await r.json();
          console.log("[handlePlaceOrder] emergency re-fetch:", freshCart);
          if (Array.isArray(freshCart) && freshCart.length > 0) {
            // Use freshCart directly for this order
            await submitOrder(freshCart);
            return;
          }
        } catch {}
      }
      setApiError("Your cart is empty. Please go back to cart and add items.");
      return;
    }

    await submitOrder(liveCart);
  };

  const submitOrder = async (items) => {
    if (!shippingInfo) {
      setApiError("Shipping information missing. Please go back to checkout.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        cartItems: items.map((item) => ({
          productId: item.productId ?? item.product_id ?? item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          img_url: item.img_url || "",
        })),
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          country: shippingInfo.country,
          city: shippingInfo.city,
          address: shippingInfo.address,
          postalCode: shippingInfo.postalCode,
        },
        paymentMethod,
        paymentDetails:
          paymentMethod === "card"
            ? {
                cardNumber: cardDetails.cardNumber,
                cardHolder: cardDetails.cardHolder,
                expiry: cardDetails.expiry,
                cvv: cardDetails.cvv,
              }
            : {},
      };

      console.log("[submitOrder] payload:", payload);

      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("[submitOrder] response:", data);

      if (!res.ok || !data.success) {
        setApiError(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      sessionStorage.removeItem("shippingInfo");

      navigate(`/order-confirmation/${data.orderNumber}`, {
        state: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          grandTotal: data.grandTotal,
          paymentStatus: data.paymentStatus,
          paymentMethod,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Order error:", err);
      setApiError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  // Loading screen
  if (!pageReady || !shippingInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-gray-400" />
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading your order…
        </p>
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
          <span
            onClick={() => navigate("/checkout")}
            className="cursor-pointer hover:text-black transition"
          >
            Checkout
          </span>
          <ChevronRight size={12} />
          <span className="text-black">Payment</span>
        </div>

        <h1 className="font-playfair text-3xl font-light mb-10 text-center">
          Payment
        </h1>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* ── LEFT ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping summary */}
            <div className="border border-gray-200 px-5 py-4 flex items-start gap-4 bg-gray-50">
              <Truck size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-black">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </span>{" "}
                · {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.country} {shippingInfo.postalCode}
                <button
                  onClick={() => navigate("/checkout")}
                  className="ml-3 text-xs underline text-gray-400 hover:text-black transition"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <h2 className="font-playfair text-xl font-light mb-5 pb-3 border-b border-gray-200">
                Select Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 border px-5 py-4 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-black bg-black/[0.03]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-black"
                  />
                  <Truck size={18} className="text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Pay in cash when your order arrives.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 border px-5 py-4 cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-black bg-black/[0.03]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-black"
                  />
                  <CreditCard
                    size={18}
                    className="text-gray-600 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Card form */}
            {paymentMethod === "card" && (
              <div className="border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    Secure Card Entry
                  </span>
                </div>
                <CardField
                  label="Card Number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  error={cardErrors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                <CardField
                  label="Cardholder Name"
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleCardChange}
                  error={cardErrors.cardHolder}
                  placeholder="Jane Doe"
                />
                <div className="grid grid-cols-2 gap-4">
                  <CardField
                    label="Expiry Date"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    error={cardErrors.expiry}
                    placeholder="MM/YY"
                    inputMode="numeric"
                  />
                  <CardField
                    label="CVV"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    error={cardErrors.cvv}
                    placeholder="123"
                    inputMode="numeric"
                    type="password"
                  />
                </div>
              </div>
            )}

            {fetchError && (
              <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                {fetchError}
              </div>
            )}

            {apiError && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              All transactions are encrypted and secure.
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-7 sticky top-32">
              <h2 className="font-playfair text-xl font-light mb-6 pb-3 border-b border-gray-200">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_id || item.cartId || item.id}
                    className="flex gap-3 items-start"
                  >
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

                {/* Show count if items not yet rendered */}
                {cartItems.length === 0 && !cartLoading && (
                  <p className="text-xs text-gray-400 italic">
                    Items will appear once cart loads.
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${displaySubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {displayShipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${displayShipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span>
                  <span>${displayTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-1">
                  <span>Grand Total</span>
                  <span>${displayGrand.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting || cartLoading}
                className="w-full mt-7 bg-black text-white text-xs uppercase py-4 hover:bg-gray-800 transition disabled:opacity-50 tracking-widest cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Placing Order…
                  </span>
                ) : cartLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Loading Cart…
                  </span>
                ) : (
                  `Place Order · $${displayGrand.toFixed(2)}`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By placing your order you agree to our Terms &amp; Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[1.5px] text-gray-500 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        className={`w-full px-4 py-3 text-sm border ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        } focus:outline-none focus:border-black transition`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Loader2,
  Lock,
} from "lucide-react";

export default function Payment() {
  const { cartItems, clearCart, fetchCart, cartLoading } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Step 1: Load shipping info
    const stored = sessionStorage.getItem("shippingInfo");
    if (!stored) {
      navigate("/checkout");
      return;
    }
    setShippingInfo(JSON.parse(stored));

    // Step 2: Always re-fetch cart on mount (handles refresh)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      fetchCart(user.id).finally(() => setPageReady(true));
    } else {
      // Not logged in
      navigate("/login");
    }
  }, [navigate]);

  // ── Totals ──────────────────────────────────────────────────────────────────
  const subtotal = shippingInfo?.subtotal ?? 0;
  const shipping = shippingInfo?.shipping ?? 0;
  const tax = shippingInfo?.tax ?? 0;
  const grand = shippingInfo?.grand ?? 0;

  // ── Card formatting ─────────────────────────────────────────────────────────
  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    setCardDetails((prev) => ({ ...prev, [name]: value }));
    if (cardErrors[name]) setCardErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // ── Card validation ─────────────────────────────────────────────────────────
  const validateCard = () => {
    const e = {};
    const raw = cardDetails.cardNumber.replace(/\s/g, "");
    if (!raw || raw.length < 13) e.cardNumber = "Enter a valid card number.";
    if (!cardDetails.cardHolder.trim())
      e.cardHolder = "Cardholder name is required.";
    if (!cardDetails.expiry || cardDetails.expiry.length < 5)
      e.expiry = "Enter a valid expiry date (MM/YY).";
    if (!cardDetails.cvv || cardDetails.cvv.length < 3)
      e.cvv = "Enter a valid CVV.";
    return e;
  };

  // ── Place Order ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setApiError("");

    if (paymentMethod === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length > 0) {
        setCardErrors(errs);
        return;
      }
    }

    if (!cartItems || cartItems.length === 0) {
      setApiError(
        "Your cart is empty. Please add items before placing an order.",
      );
      return;
    }

    if (!shippingInfo) {
      setApiError(
        "Shipping information is missing. Please go back to checkout.",
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        cartItems: cartItems.map((item) => ({
          productId: item.product_id ?? item.productId ?? item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          img_url: item.img_url || "",
        })),
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          country: shippingInfo.country,
          city: shippingInfo.city,
          address: shippingInfo.address,
          postalCode: shippingInfo.postalCode,
        },
        paymentMethod,
        paymentDetails:
          paymentMethod === "card"
            ? {
                cardNumber: cardDetails.cardNumber,
                cardHolder: cardDetails.cardHolder,
                expiry: cardDetails.expiry,
                cvv: cardDetails.cvv,
              }
            : {},
      };

      console.log("Placing order:", payload);

      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Order response:", data);

      if (!res.ok || !data.success) {
        setApiError(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // SUCCESS
      clearCart();
      sessionStorage.removeItem("shippingInfo");

      navigate(`/order-confirmation/${data.orderNumber}`, {
        state: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          grandTotal: data.grandTotal,
          paymentStatus: data.paymentStatus,
          paymentMethod,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Order error:", err);
      setApiError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  // ── Loading screen (shown on refresh while cart refetches) ──────────────────
  if (!pageReady || cartLoading || !shippingInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-gray-400" />
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading your order…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        // Breadcrumb 
        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-10">
          <span
            onClick={() => navigate("/cart")}
            className="cursor-pointer hover:text-black transition"
          >
            Cart
          </span>
          <ChevronRight size={12} />
          <span
            onClick={() => navigate("/checkout")}
            className="cursor-pointer hover:text-black transition"
          >
            Checkout
          </span>
          <ChevronRight size={12} />
          <span className="text-black">Payment</span>
        </div>

        <h1 className="font-playfair text-3xl font-light mb-10 text-center">
          Payment
        </h1>

        <div className="grid lg:grid-cols-5 gap-12">
          //LEFT 
          <div className="lg:col-span-3 space-y-6">
           //Shipping summary 
            <div className="border border-gray-200 px-5 py-4 flex items-start gap-4 bg-gray-50">
              <Truck size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-black">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </span>{" "}
                · {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.country} {shippingInfo.postalCode}
                <button
                  onClick={() => navigate("/checkout")}
                  className="ml-3 text-xs underline text-gray-400 hover:text-black transition"
                >
                  Edit
                </button>
              </div>
            </div>

            /// Payment method selector 
            <div>
              <h2 className="font-playfair text-xl font-light mb-5 pb-3 border-b border-gray-200">
                Select Payment Method
              </h2>
              <div className="space-y-3">
                // COD 
                <label
                  className={`flex items-center gap-4 border px-5 py-4 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-black bg-black/[0.03]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-black"
                  />
                  <Truck size={18} className="text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Pay in cash when your order arrives.
                    </p>
                  </div>
                </label>

                //Card 
                <label
                  className={`flex items-center gap-4 border px-5 py-4 cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-black bg-black/[0.03]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-black"
                  />
                  <CreditCard
                    size={18}
                    className="text-gray-600 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </label>
              </div>
            </div>

           //Card form 
            {paymentMethod === "card" && (
              <div className="border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    Secure Card Entry
                  </span>
                </div>
                <CardField
                  label="Card Number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  error={cardErrors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                <CardField
                  label="Cardholder Name"
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleCardChange}
                  error={cardErrors.cardHolder}
                  placeholder="Jane Doe"
                />
                <div className="grid grid-cols-2 gap-4">
                  <CardField
                    label="Expiry Date"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    error={cardErrors.expiry}
                    placeholder="MM/YY"
                    inputMode="numeric"
                  />
                  <CardField
                    label="CVV"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    error={cardErrors.cvv}
                    placeholder="123"
                    inputMode="numeric"
                    type="password"
                  />
                </div>
              </div>
            )}

            // API Error 
            {apiError && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              All transactions are encrypted and secure.
            </div>
          </div>

          //RIGHT: Order Summary 
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-7 sticky top-32">
              <h2 className="font-playfair text-xl font-light mb-6 pb-3 border-b border-gray-200">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_id || item.cartId || item.id}
                    className="flex gap-3 items-start"
                  >
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

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${Number(shipping).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span>
                  <span>${Number(tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-1">
                  <span>Grand Total</span>
                  <span>${Number(grand).toFixed(2)}</span>
                </div>
              </div>

              // Place Order Button 
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-7 bg-black text-white text-xs uppercase py-4 hover:bg-gray-800 transition disabled:opacity-50 tracking-widest cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  `Place Order · $${Number(grand).toFixed(2)}`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By placing your order you agree to our Terms &amp; Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[1.5px] text-gray-500 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        className={`w-full px-4 py-3 text-sm border ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        } focus:outline-none focus:border-black transition`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
*/
