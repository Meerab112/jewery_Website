/*import { useNavigate } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";

export default function AddToCartPopup({ product, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop }
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal }
      <div className="relative bg-white w-full max-w-md p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h2 className="text-center font-playfair text-2xl font-light mb-1">
          Added to Cart
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {product?.name} has been added to your cart successfully.
        </p>

        {product?.img_url && (
          <div className="flex gap-4 items-center bg-gray-50 p-3 mb-6">
            <img
              src={product.img_url}
              alt={product.name}
              className="w-16 h-16 object-cover"
            />
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm text-gold">${product.price}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-black text-black text-xs uppercase py-3 hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
            className="flex-1 bg-black text-white text-xs uppercase py-3 hover:bg-gray-800 transition"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}
*/
import { useNavigate } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";

export default function AddToCartPopup({ product, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h2 className="text-center font-playfair text-2xl font-light mb-1">
          Added to Cart
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {product?.name} has been added to your cart successfully.
        </p>

        {/* Product preview */}
        {product?.img_url && (
          <div className="flex gap-4 items-center bg-gray-50 p-3 mb-6">
            <img
              src={product.img_url}
              alt={product.name}
              className="w-16 h-16 object-cover"
            />
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm text-gold">${product.price}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-black text-black text-xs uppercase py-3 hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
            className="flex-1 bg-black text-white text-xs uppercase py-3 hover:bg-gray-800 transition"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}
