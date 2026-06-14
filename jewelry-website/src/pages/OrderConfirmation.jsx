import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Loader2 } from "lucide-react";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // FIXED: use by-number route
    fetch(`http://localhost:5000/api/orders/by-number/${orderNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          setItems(data.items || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-gray-400" />
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading your order…
        </p>
      </div>
    );
  }

  const displayOrder = order || {};
  const displayItems = items.length > 0 ? items : state?.cartItems || [];

  // FIXED: use shipping_first_name from DB, fall back to navigation state
  const customerName =
    state?.customerName ||
    `${displayOrder.shipping_first_name || ""} ${displayOrder.shipping_last_name || ""}`.trim();

  const email = state?.email || displayOrder.shipping_email || "";

  const grandTotal = state?.grandTotal || displayOrder.grand_total || "0.00";

  const paymentMethod =
    state?.paymentMethod || displayOrder.payment_method || "cod";

  const paymentStatus =
    state?.paymentStatus || displayOrder.payment_status || "pending";

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-6" />
        <h1 className="font-playfair text-3xl font-light mb-2">
          Order Confirmed
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you,{" "}
          <span className="font-medium text-black">{customerName}</span>! Your
          order has been placed successfully.
        </p>

        {/* Order details */}
        <div className="border border-gray-200 p-7 text-left mb-8 bg-gray-50">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
            <Package size={18} className="text-gray-400" />
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Order Details
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="capitalize">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Credit / Debit Card"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>
              <span
                className={`capitalize font-medium ${
                  paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                }`}
              >
                {paymentStatus === "paid" ? "Paid" : "Pay on Delivery"}
              </span>
            </div>
            <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-1">
              <span>Grand Total</span>
              <span>${Number(grandTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        {displayItems.length > 0 && (
          <div className="border border-gray-200 p-7 text-left mb-8">
            <h2 className="font-playfair text-lg font-light mb-4 pb-3 border-b border-gray-200">
              Items Ordered
            </h2>
            <div className="space-y-4">
              {displayItems.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-3 items-center">
                  {/* FIXED: support both DB column names and state names */}
                  {(item.product_img || item.img_url) && (
                    <img
                      src={item.product_img || item.img_url}
                      alt={item.product_name || item.name}
                      className="w-12 h-12 object-cover bg-gray-100 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light truncate">
                      {item.product_name || item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm">
                    $
                    {(
                      Number(item.unit_price || item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
