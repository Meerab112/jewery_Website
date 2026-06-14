import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, theme = "light" }) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => navigate(`/product/${product.id}`);

  const bg =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const mainImg = product.img_url || product.img || "";
  const hoverImg = product.model_img_url || mainImg;

  return (
    <div
      className={`product-card ${bg} group cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={mainImg}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
        <img
          src={hoverImg}
          alt={`${product.name} model`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button className="bg-white text-gray-900 text-[10px] tracking-widest uppercase px-5 py-2.5 font-medium hover:bg-gold hover:text-white transition-colors flex items-center gap-2">
            <Eye size={12} /> Quick View
          </button>
        </div>
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white z-10"
          onClick={(e) => {
            e.stopPropagation();
            setWished(!wished);
          }}
        >
          <Heart
            size={14}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </button>
      </div>

      <div className="p-4">
        {product.category && (
          <p
            className={`text-[10px] tracking-[0.15em] uppercase ${subText} mb-1`}
          >
            {product.category}
          </p>
        )}
        <h3 className="font-playfair text-base font-light leading-snug mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className={`text-xs ${subText} mb-2 line-clamp-2`}>
            {product.description}
          </p>
        )}
        <p className="text-sm font-medium tracking-wide text-gold">
          PKR {Number(product.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
