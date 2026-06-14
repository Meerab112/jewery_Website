import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 py-4">
      <button
        className="flex justify-between w-full text-left text-sm tracking-wider text-gray-300"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? (
          <ChevronUp size={16} className="text-gold" />
        ) : (
          <ChevronDown size={16} className="text-gold" />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">{content}</p>
      )}
    </div>
  );
}

const faqItems = [
  {
    title: "Complimentary Shipping & Returns",
    content:
      "All watch orders include complimentary shipping in our signature packaging. Returns accepted within 30 days.",
  },
  {
    title: "Ask a Client Advisor",
    content: "Our watch specialists are available to guide your selection.",
  },
];

export default function Watches() {
  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/products?category=Watches",
        );
        if (!res.ok) throw new Error("Failed to fetch watches");
        const data = await res.json();
        setWatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatches();
  }, []);

  // First 3 watches = featured, next 9 = grid
  const featuredWatches = watches.slice(0, 3);
  const bannerWatch = watches[3] || null;
  //const gridWatches = watches.slice(0, 9);
  const gridWatches = watches;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-2 text-xs text-gray-500 tracking-wider">
        <Link to="/" className="hover:text-gold transition">
          Home
        </Link>
        <span className="mx-2 text-gray-700">/</span>
        <span className="text-gray-400">Watches</span>
      </div>
      {/* HERO SECTION */}
      <section className="w-full py-10">
        <div className="flex flex-col lg:flex-row bg-white">
          {/* LEFT SIDE VIDEO */}
          <div className="w-full h-[220px] sm:h-[300px] lg:flex-1 lg:h-[450px]">
            <video
              src="/videos/watches.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="w-full lg:w-[38%] flex items-center justify-center bg-white px-6 sm:px-8 lg:px-12 py-8 lg:py-10">
            <div className="max-w-md">
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-light mb-6">
                Tiffany Watches
              </h1>

              <p className="text-base text-gray-700 leading-relaxed">
                Discover exceptional Swiss-made timepieces exemplifying the
                House's legacy of extraordinary savoir faire and inventive
                artistry.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════
          FEATURED PRODUCTS — 3 cards, single row
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            Curated Selection
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl font-light">
            Featured Timepieces
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWatches.map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/product/${w.id}`)}
                className="group cursor-pointer bg-white border border-gray-200 hover:border-gold transition duration-300 shadow-sm"
              >
                {/* Model/product image */}
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={w.model_img_url || w.img_url}
                    alt={w.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300">
                    <button className="w-full border border-gold text-gold text-xs uppercase py-2 hover:bg-gold hover:text-black transition">
                      View Details
                    </button>
                  </div>
                </div>
                {/* Card info */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-light mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                    {w.description || "Swiss-crafted luxury timepiece"}
                  </p>
                  <p className="text-gold text-sm tracking-wider">${w.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SPLIT BANNER — image left, product right
      ══════════════════════════════════════════ */}
      {bannerWatch && (
        <section className="w-full py-10">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 px-4 sm:px-6 lg:px-8">
            {/* Large promo image — left */}
            <div
              className="w-full lg:w-[58%] overflow-hidden rounded-sm"
              style={{ minHeight: "480px" }}
            >
              <video
                src="/videos/tifny3.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            {/* Product card — right */}
            <div
              className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-14 cursor-pointer group"
              onClick={() => navigate(`/product/${bannerWatch.id}`)}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">
                Featured Piece
              </p>
              <div className="overflow-hidden mb-6 aspect-square w-full max-w-[220px] mx-auto lg:mx-0">
                <img
                  src={bannerWatch.img_url}
                  alt={bannerWatch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-playfair text-2xl font-light mb-3">
                {bannerWatch.name}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {bannerWatch.description ||
                  "A masterpiece of Swiss precision and Tiffany design heritage."}
              </p>
              <p className="text-gold text-xl mb-6">${bannerWatch.price}</p>
              <button className="self-start border border-gold text-gold text-xs uppercase px-8 py-3 hover:bg-gold hover:text-black transition tracking-widest">
                Shop Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PRODUCT GRID — 3 columns × 3 rows = 9
      ══════════════════════════════════════════ */}
      {/*<section className="max-w-7xl mx-auto px-6 py-16">*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            The Collection
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl font-light">
            Watches Collection
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading watches...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridWatches.map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/product/${w.id}`)}
                className="group cursor-pointer bg-white border border-gray-200 hover:border-gold transition duration-300 shadow-sm"
              >
                {/* Image */}
                <div className="overflow-hidden aspect-square">
                  <img
                    src={w.img_url}
                    alt={w.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                {/* Info */}
                <div className="p-5 border-t border-gray-100">
                  <h3 className="font-playfair text-base font-light mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                    {w.description || "Swiss-crafted luxury timepiece"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gold text-sm">${w.price}</p>
                    <span className="text-xs text-gray-400 uppercase tracking-widest group-hover:text-gold transition">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && watches.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No watches found</p>
        )}
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-2xl font-light text-center mb-10">
            Client Services
          </h2>
          {faqItems.map((f, i) => (
            <Accordion key={i} title={f.title} content={f.content} />
          ))}
        </div>
      </section>
    </div>
  );
}
/*import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { watchProducts, IMGS } from "../../data/products";

function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 py-4">
      <button
        className="flex justify-between w-full text-left text-sm tracking-wider text-gray-300"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? (
          <ChevronUp size={16} className="text-gold" />
        ) : (
          <ChevronDown size={16} className="text-gold" />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">{content}</p>
      )}
    </div>
  );
}

const faqItems = [
  {
    title: "Complimentary Shipping & Returns",
    content:
      "All watch orders include complimentary shipping in our signature packaging. Returns accepted within 30 days.",
  },
  {
    title: "Ask a Client Advisor",
    content: "Our watch specialists are available to guide your selection.",
  },
];

export default function Watches() {
  const navigate = useNavigate();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/products?category=Watches",
        );
        if (!res.ok) throw new Error("Failed to fetch watches");
        const data = await res.json();
        setWatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatches();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
     // Breadcrumb 
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-500 tracking-wider">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2 text-gray-700">/</span>
        <span className="text-gray-400">Watches</span>
      </div>

      // Hero 
      <section className="relative h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200"
          alt="Watches"
          className="w-full h-full object-cover opacity-80 scale-105"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="font-playfair text-6xl md:text-8xl font-light">
            Timeless <em>Elegance</em>
          </h1>
        </div>
      </section>

      // Status 
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading && <p className="text-gray-400">Loading watches...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </section>

      //Products 
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl mb-6">Watches Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watches.map((w) => (
            <div
              key={w.id}
              className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-gold transition"
              onClick={() => navigate(`/product/${w.id}`)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={w.img_url}
                  alt={w.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>
              <div className="p-5">
                <h3 className="font-playfair text-lg">{w.name}</h3>
                <p className="text-sm text-gray-400">${w.price}</p>
              </div>
            </div>
          ))}
        </div>
        {!loading && watches.length === 0 && (
          <p className="text-gray-500 mt-6">No watches found</p>
        )}
      </section>

      //FAQ 
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          {faqItems.map((f, i) => (
            <Accordion key={i} title={f.title} content={f.content} />
          ))}
        </div>
      </section>
    </div>
  );
}
*/
