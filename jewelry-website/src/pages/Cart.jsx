import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, cartLoading, fetchCart, removeFromCart, updateQuantity } =
    useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // ✅ FIXED: read real userId from localStorage instead of hardcoded 1
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || null;
    if (userId) {
      fetchCart(userId).then(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const handleProceed = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const handleRemove = async (cartId) => {
    setRemovingId(cartId);
    setErrorMsg(null);
    const result = await removeFromCart(cartId);
    if (!result.success) {
      setErrorMsg("Failed to remove item. Please try again.");
      console.error("Remove failed:", result.error);
    }
    setRemovingId(null);
  };

  const handleQuantity = async (cartId, currentQty, delta) => {
    setUpdatingId(cartId);
    setErrorMsg(null);
    const result = await updateQuantity(cartId, currentQty + delta);
    if (!result.success) {
      setErrorMsg("Failed to update quantity. Please try again.");
      console.error("Update failed:", result.error);
    }
    setUpdatingId(null);
  };

  if (!initialized || cartLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h2 className="font-playfair text-2xl font-light mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Discover our collections and add something beautiful.
        </p>
        <Link
          to="/jewelry"
          className="bg-black text-white text-xs uppercase px-8 py-3 hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-playfair text-3xl font-light mb-10 text-center">
          Shopping Cart
          <span className="ml-3 text-sm text-gray-400 font-sans font-normal">
            ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </span>
        </h1>

        {errorMsg && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center rounded">
            {errorMsg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              // ✅ FIXED: support both cart_id and cartId from backend
              const id = item.cartId || item.cart_id;
              return (
                <div
                  key={id}
                  className={`flex gap-5 border-b border-gray-100 pb-6 transition-opacity duration-300 ${
                    removingId === id ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  {/* Image */}
                  <img
                    src={item.img_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover bg-gray-50 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                      {item.category}
                    </p>
                    <p className="font-light text-base mb-1">{item.name}</p>
                    <p className="text-gold text-sm mb-3">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantity(id, item.quantity, -1)}
                        disabled={updatingId === id || removingId === id}
                        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black transition disabled:opacity-40"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="w-8 text-center text-sm">
                        {updatingId === id ? (
                          <Loader2 size={14} className="animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <button
                        onClick={() => handleQuantity(id, item.quantity, 1)}
                        disabled={updatingId === id || removingId === id}
                        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black transition disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-light text-sm">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(id)}
                      disabled={removingId === id || updatingId === id}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition disabled:opacity-40 mt-4"
                    >
                      {removingId === id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="bg-gray-50 p-6 h-fit sticky top-32">
            <h2 className="font-playfair text-lg font-light mb-6 border-b pb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm mb-6">
              {cartItems.map((item) => {
                const id = item.cartId || item.cart_id;
                return (
                  <div key={id} className="flex justify-between text-gray-500">
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between border-t pt-3 mt-3">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-3 mt-3 text-base">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-black text-white text-xs uppercase py-3.5 hover:bg-gray-800 transition mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/jewelry")}
              className="w-full border border-black text-black text-xs uppercase py-3.5 hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
