import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import AddToCartPopup from "../components/cart/AddToCartPopup";

const BASE_URL = "http://localhost:5000";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm tracking-wider uppercase font-medium">
          {title}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="mt-3 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    setProduct(null);
    setRelated([]);
    setActiveImg(0);
    setWished(false);
    setCartError("");
    setShowPopup(false);
    setLoading(true);
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await res.json();
        const single = Array.isArray(data) ? data[0] : data;
        if (!single) {
          setLoading(false);
          return;
        }
        setProduct(single);

        if (single?.category) {
          const relRes = await fetch(
            `${BASE_URL}/api/products?category=${encodeURIComponent(single.category)}`,
          );
          const relData = await relRes.json();
          setRelated(
            Array.isArray(relData)
              ? relData.filter((p) => String(p.id) !== String(id)).slice(0, 4)
              : [],
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setCartError("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    const result = await addToCart(product.id, 1);
    setAddingToCart(false);
    if (result?.success) {
      setShowPopup(true);
    } else {
      setCartError(result?.error || "Failed to add to cart. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading...
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Product not found</p>
      </div>
    );

  // ✅ No BASE_URL — images live in frontend public folder
  const images = [
    product.img_url,
    product.model_img_url,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const descLines = product.description?.split("\n").filter(Boolean) || [];
  const specLines = product.specifications?.split("\n").filter(Boolean) || [];
  const speclLines = product.specialization?.split("\n").filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-white pt-28">
      {showPopup && (
        <AddToCartPopup product={product} onClose={() => setShowPopup(false)} />
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/jewelry" className="hover:text-gold">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT — Image Gallery */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square border-2 transition ${
                    activeImg === i
                      ? "border-gold"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="w-full lg:w-1/2">
            <p className="text-xs uppercase text-gray-400 tracking-widest mb-1">
              {product.category}
            </p>
            <h1 className="font-playfair text-3xl font-light mb-3">
              {product.name}
            </h1>

            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-gold fill-gold" />
              ))}
            </div>

            <p className="text-2xl text-gold mb-4">
              PKR {Number(product.price).toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Material:{" "}
              <span className="text-gray-700 font-medium">
                {product.material}
              </span>
            </p>

            {descLines.length > 0 && (
              <div className="mb-6 space-y-1">
                {descLines.map((line, i) => (
                  <p key={i} className="text-sm text-gray-500 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-black text-white py-3 flex justify-center items-center gap-2 hover:bg-gray-800 transition disabled:opacity-60"
              >
                <ShoppingBag size={16} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {cartError && (
                <p className="text-red-500 text-xs text-center">{cartError}</p>
              )}

              <button
                onClick={() => setWished(!wished)}
                className="w-full border py-3 flex justify-center items-center gap-2 hover:border-gray-400 transition"
              >
                <Heart
                  size={16}
                  className={wished ? "text-red-500 fill-red-500" : ""}
                />
                Wishlist
              </button>
            </div>

            <div>
              <Accordion title="Specifications">
                {specLines.length > 0 ? (
                  <div className="space-y-1">
                    {specLines.map((line, i) => {
                      const [label, ...rest] = line.split(":");
                      return rest.length > 0 ? (
                        <div key={i} className="flex gap-2">
                          <span className="text-gray-400 min-w-[140px]">
                            {label}:
                          </span>
                          <span className="text-gray-700">
                            {rest.join(":").trim()}
                          </span>
                        </div>
                      ) : (
                        <p key={i}>{line}</p>
                      );
                    })}
                  </div>
                ) : (
                  <p>
                    Material: {product.material}
                    <br />
                    Handmade luxury product
                  </p>
                )}
              </Accordion>

              {speclLines.length > 0 && (
                <Accordion title="Details">
                  <div className="space-y-1">
                    {speclLines.map((line, i) => {
                      const [label, ...rest] = line.split(":");
                      return rest.length > 0 ? (
                        <div key={i} className="flex gap-2">
                          <span className="text-gray-400 min-w-[100px]">
                            {label}:
                          </span>
                          <span className="text-gray-700">
                            {rest.join(":").trim()}
                          </span>
                        </div>
                      ) : (
                        <p key={i}>{line}</p>
                      );
                    })}
                  </div>
                </Accordion>
              )}

              <Accordion title="Shipping">
                {product.shipping || "Free shipping worldwide on all orders."}
              </Accordion>

              <Accordion title="Returns">
                {product.return_policy || "30-day return policy"}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 border-t">
          <h2 className="text-center text-xl mb-8 font-light tracking-wider uppercase">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/product/${p.id}`);
                }}
                className="cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={p.img_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="text-sm mt-2 font-light">{p.name}</p>
                <p className="text-gold text-sm">
                  PKR {Number(p.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/*import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import AddToCartPopup from "../components/cart/AddToCartPopup";

const BASE_URL = "http://localhost:5000";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm tracking-wider uppercase font-medium">
          {title}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="mt-3 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    setProduct(null);
    setRelated([]);
    setActiveImg(0);
    setWished(false);
    setCartError("");
    setShowPopup(false);
    setLoading(true);
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        const single = Array.isArray(data) ? data[0] : data;

        if (!single) {
          setLoading(false);
          return;
        }

        setProduct(single);

        if (single?.category) {
          const relRes = await fetch(
            `http://localhost:5000/api/products?category=${encodeURIComponent(single.category)}`,
          );
          const relData = await relRes.json();
          setRelated(
            Array.isArray(relData)
              ? relData.filter((p) => String(p.id) !== String(id)).slice(0, 4)
              : [],
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setCartError("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id, 1);
    setAddingToCart(false);

    if (result?.success) {
      setShowPopup(true);
    } else {
      setCartError(result?.error || "Failed to add to cart. Please try again.");
    }
  };

  const handleRelatedClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product/${productId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading...
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Product not found</p>
      </div>
    );

  // ✅ FIXED: prefix all image URLs with BASE_URL and use all 4 different images
  
  
  const images = [
    product.img_url,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  // ✅ FIXED: prefix related product images too
 
  const relatedWithImages = related.map((p) => ({ ...p }));
  return (
    <div className="min-h-screen bg-white pt-28">
      {showPopup && (
        <AddToCartPopup product={product} onClose={() => setShowPopup(false)} />
      )}

      // Breadcrumb 
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/jewelry" className="hover:text-gold">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      /TWO COLUMN LAYOUT 
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          //LEFT — Image Gallery 
          <div className="w-full lg:w-1/2 space-y-4">
            // Main Image 
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            // Thumbnails
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square border-2 ${
                    activeImg === i ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          //RIGHT — Product Details 
          <div className="w-full lg:w-1/2">
            <p className="text-xs uppercase text-gray-400 tracking-widest mb-1">
              {product.category}
            </p>
            <h1 className="font-playfair text-3xl font-light mb-3">
              {product.name}
            </h1>

            // Stars 
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-gold fill-gold" />
              ))}
            </div>

            // Price 
            <p className="text-2xl text-gold mb-4">${product.price}</p>

            // Material 
            <p className="text-sm text-gray-600 mb-4">
              Material: {product.material}
            </p>

            // Description 
            {product.description && (
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            //Buttons 
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-black text-white py-3 flex justify-center items-center gap-2 hover:bg-gray-800 transition disabled:opacity-60"
              >
                <ShoppingBag size={16} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {cartError && (
                <p className="text-red-500 text-xs text-center">{cartError}</p>
              )}

              <button
                onClick={() => setWished(!wished)}
                className="w-full border py-3 flex justify-center items-center gap-2 hover:border-gray-400 transition"
              >
                <Heart
                  size={16}
                  className={wished ? "text-red-500 fill-red-500" : ""}
                />
                Wishlist
              </button>
            </div>

            // Accordions 
            <div>
              <Accordion title="Specifications">
                Material: {product.material}
                <br />
                Handmade luxury product
              </Accordion>
              <Accordion title="Shipping">Free shipping worldwide</Accordion>
              <Accordion title="Returns">30-day return policy</Accordion>
            </div>
          </div>
        </div>
      </div>

      //Related Products 
      {relatedWithImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 border-t">
          <h2 className="text-center text-xl mb-8 font-light tracking-wider uppercase">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedWithImages.map((p) => (
              <div
                key={p.id}
                onClick={() => handleRelatedClick(p.id)}
                className="cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={p.img_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="text-sm mt-2 font-light">{p.name}</p>
                <p className="text-gold text-sm">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
*/
