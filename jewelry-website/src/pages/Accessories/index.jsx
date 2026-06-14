import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { IMGS } from "../../data/products";

// Only categories that actually exist in your DB
const categories = [
  "All",
  "Rings",
  "Necklaces",
  "Bracelets",
  "Earrings",
  "Watches",
];

export default function Accessories() {
  const [active, setActive] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        // Fetch all products — no "Accessories" category exists in DB
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Accessories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={IMGS.model[2]}
          alt="Accessories"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase mb-2 opacity-70">
            Lumière & Co.
          </p>
          <h1 className="font-playfair text-5xl font-light">Accessories</h1>
          <p className="text-sm opacity-70 mt-3 tracking-widest">
            Complete Your Look
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Accessories</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex gap-3 flex-wrap mb-10 border-b border-gray-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[10px] tracking-[0.15em] uppercase px-5 py-2 border transition ${
                active === cat
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-600 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-8">{filtered.length} items</p>

        {/* Products */}
        {loading ? (
          <p className="text-gray-500">Loading accessories...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No items found for this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gray-900 text-white p-12 md:p-16 flex flex-col justify-center">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">
              New Season
            </p>
            <h2 className="font-playfair text-3xl font-light mb-4">
              Complete Your <em>Style</em>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              From sunglasses to silk scarves, our accessories collection is
              designed to elevate every outfit with luxury.
            </p>
            <button className="self-start border border-gold text-gold text-xs uppercase px-8 py-3.5 hover:bg-gold hover:text-black transition">
              Shop All
            </button>
          </div>
          <div className="overflow-hidden aspect-[4/3] md:aspect-auto">
            <img
              src={IMGS.model[3]}
              alt="Accessories"
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
/*import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { IMGS } from "../../data/products";

const categories = [
  "All",
  "Eyewear",
  "Bracelets",
  "Rings",
  "Necklaces",
  "Earrings",
  "Hair",
  "Watches",
  "Brooches",
  "Belts",
];

export default function Accessories() {
  const [active, setActive] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);

        //let url = "http://localhost:5000/api/products?category=Accessories";
       // let url = `http://localhost:5000/api/products?category=${category}`;
       // const res = await fetch(url);
        const res = await fetch(
          `http://localhost:5000/api/products?category=Accessories`,
        );

        const data = await res.json();

        setProducts(data);
      } catch (err) {
        console.error("Accessories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // 🔥 FILTER (frontend filter, no need DB calls every time)
  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-white pt-24">
      // Banner 
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={IMGS.model[2]}
          alt="Accessories"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase mb-2 opacity-70">
            Lumière & Co.
          </p>
          <h1 className="font-playfair text-5xl font-light">Accessories</h1>
          <p className="text-sm opacity-70 mt-3 tracking-widest">
            Complete Your Look
          </p>
        </div>
      </div>

     // Breadcrumb 
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-gray-600">Accessories</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        //Filters 
        <div className="flex gap-3 flex-wrap mb-10 border-b border-gray-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[10px] tracking-[0.15em] uppercase px-5 py-2 border transition ${
                active === cat
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-600 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-8">{filtered.length} items</p>

        // Products 
        {loading ? (
          <p className="text-gray-500">Loading accessories...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        //Featured Section 
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gray-900 text-white p-12 md:p-16 flex flex-col justify-center">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">
              New Season
            </p>
            <h2 className="font-playfair text-3xl font-light mb-4">
              Complete Your <em>Style</em>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              From sunglasses to silk scarves, our accessories collection is
              designed to elevate every outfit with luxury.
            </p>
            <button className="self-start border border-gold text-gold text-xs uppercase px-8 py-3.5 hover:bg-gold hover:text-black transition">
              Shop All
            </button>
          </div>

          <div className="overflow-hidden aspect-[4/3] md:aspect-auto">
            <img
              src={IMGS.model[3]}
              alt="Accessories"
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
*/
