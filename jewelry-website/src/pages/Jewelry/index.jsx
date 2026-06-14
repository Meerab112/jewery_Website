import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import { IMGS } from "../../data/products";

const filters = {
  Category: ["Rings", "Necklaces", "Bracelets", "Earrings", "Brooches"],
  Price: [
    "Under Rs. 100,000",
    "Rs. 100,000–250,000",
    "Rs. 250,000–500,000",
    "Over Rs. 500,000",
  ],
  Material: [
    "18K Gold",
    "18K White Gold",
    "18K Rose Gold",
    "Platinum",
    "Sterling Silver",
  ],
  Collection: ["Classic", "Diamond", "Gemstone", "Pearl", "Wedding"],
};

function FilterGroup({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        className="flex justify-between w-full text-xs tracking-widest uppercase font-medium py-1"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-gold"
                checked={selected.includes(opt)}
                onChange={() => onChange(label, opt)}
              />
              <span className="text-sm text-gray-600">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Jewelry() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const category = selectedFilters.Category?.[0];
        let url = "http://localhost:5000/api/products";
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedFilters.Category]);

  const toggleFilter = (group, val) => {
    setSelectedFilters((prev) => {
      const cur = prev[group] || [];
      return {
        ...prev,
        [group]: cur.includes(val)
          ? cur.filter((v) => v !== val)
          : [...cur, val],
      };
    });
  };

  // price from DB is a number — use Number() not .replace()
  let sortedProducts = [...products];
  if (sortBy === "price-asc") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }
  if (sortBy === "price-desc") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={IMGS.necklace[0]}
          alt="Jewelry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase mb-2 opacity-70">
            Lumière & Co.
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-light">
            Jewelry
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/">Home</Link> / Jewelry
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-8">
        {/* Filter Sidebar */}
        <aside
          className={`w-56 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <h3 className="font-playfair text-lg mb-4">Filters</h3>
          {Object.entries(filters).map(([group, opts]) => (
            <FilterGroup
              key={group}
              label={group}
              options={opts}
              selected={selectedFilters[group] || []}
              onChange={toggleFilter}
            />
          ))}
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <button
              className="lg:hidden flex items-center gap-2 text-xs uppercase border px-3 py-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={14} /> Filters
            </button>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${sortedProducts.length} products`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2 text-xs uppercase"
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} /*import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { jewelryProducts, IMGS } from '../../data/products';

const filters = {
  Category: ['Rings','Necklaces','Bracelets','Earrings','Brooches'],
  Price: ['Under Rs. 100,000','Rs. 100,000–250,000','Rs. 250,000–500,000','Over Rs. 500,000'],
  Material: ['18K Gold','18K White Gold','18K Rose Gold','Platinum','Sterling Silver'],
  Collection: ['Classic','Diamond','Gemstone','Pearl','Wedding'],
};

function FilterGroup({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button className="flex justify-between w-full text-xs tracking-widest uppercase font-medium py-1" onClick={() => setOpen(!open)}>
        {label} <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => onChange(opt)} className="accent-gold" />
              <span className="text-sm text-gray-600">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Jewelry() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (group, val) => {
    setSelectedFilters(prev => {
      const cur = prev[group] || [];
      return { ...prev, [group]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  let products = [...jewelryProducts];
  if (sortBy === 'price-asc') products.sort((a,b) => parseInt(a.price.replace(/\D/g,'')) - parseInt(b.price.replace(/\D/g,'')));
  if (sortBy === 'price-desc') products.sort((a,b) => parseInt(b.price.replace(/\D/g,'')) - parseInt(a.price.replace(/\D/g,'')));

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Banner }
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={IMGS.necklace[0]} alt="Jewelry" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase mb-2 opacity-70">Lumière & Co.</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-light">Jewelry</h1>
        </div>
      </div>

      {/* Breadcrumb }
      <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">Home</Link> <span className="mx-2">/</span> <span className="text-gray-600">Jewelry</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-8">
        {/* Sidebar filters }
        <aside className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <h3 className="font-playfair text-lg mb-4">Filters</h3>
          {Object.entries(filters).map(([group, opts]) => (
            <FilterGroup key={group} label={group} options={opts} selected={selectedFilters[group] || []} onChange={val => toggleFilter(group, val)} />
          ))}
        </aside>

        {/* Products }
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="lg:hidden flex items-center gap-2 text-xs tracking-widest uppercase border border-gray-300 px-4 py-2 hover:border-gold transition-colors" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={14} /> Filters
              </button>
              <p className="text-sm text-gray-500">{products.length} products</p>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 text-xs tracking-wider uppercase px-3 py-2 focus:outline-none focus:border-gold">
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
  */
