import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { IMGS } from "../../data/products";

const highJewelryNames = [
  "Diamond Solitaire Ring",
  "Diamond Choker",
  "Tennis Bracelet Diamond",
  "Diamond Drop Earrings",
  "Emerald Cocktail Ring",
  "Sapphire Tennis Bracelet",
];

export default function HighJewelry() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighJewelry = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const filtered = data.filter((p) => highJewelryNames.includes(p.name));
        setProducts(filtered);
      } catch (err) {
        console.error("High Jewelry fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighJewelry();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <Link to="/shop">
          <img
            src={IMGS.luxury[0]}
            className="w-full h-full object-cover cursor-pointer"
            alt="High Jewelry"
          />
        </Link>
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end text-white pb-24 text-center px-6 pointer-events-none">
          <h1 className="text-5xl font-light">
            High <em>Jewelry</em>
          </h1>
        </div>
      </section>

      {/* SECTION 1: Newest Collection */}
      <section className="grid md:grid-cols-2 min-h-[85vh]">
        {/* Left: text block */}
        <div className="flex items-center justify-center px-8 md:px-16 py-16 bg-white order-1">
          <div className="max-w-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
              Blue Book 2026
            </p>
            <h2 className="text-4xl font-light leading-snug mb-6">
              Introducing Our Newest <em>High Jewelry</em> Collection
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Hidden Garden captures nature's hidden treasures in extraordinary
              creations inspired by light, movement and transformation.
              Reinterpreting iconic flora and fauna motifs, the collection
              captures the poetry of an imagined garden where blossoms unfurl,
              wings take flight and gemstones radiate with colour and
              brilliance.
            </p>
            <Link
              to="/shop"
              className="text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:opacity-60 transition"
            >
              Explore Blue Book 2026: Hidden Garden
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <Link to="/shop" className="h-[60vh] md:h-auto order-2 block">
          <img
            src={IMGS.luxury[1]}
            alt="Blue Book 2026 – Hidden Garden necklace"
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>
      </section>

      {/* SECTION 2: Inventive Artistry (3-column) */}
      <section className="grid md:grid-cols-[1fr_1fr_1fr] min-h-[80vh]">
        {/* Column 1: Model image */}
        <Link to="/shop" className="h-[50vh] md:h-auto overflow-hidden block">
          <img
            src={IMGS.luxury[2] ?? IMGS.luxury[0]}
            alt="High jewelry model"
            className="w-full h-full object-cover object-top cursor-pointer"
          />
        </Link>

        {/* Column 2: Jewel close-up */}
        <Link to="/shop" className="h-[50vh] md:h-auto overflow-hidden block">
          <img
            src={IMGS.luxury[3] ?? IMGS.luxury[1]}
            alt="Bird on a Rock brooch detail"
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>

        {/* Column 3: Text */}
        <div className="flex items-center justify-center px-8 md:px-12 py-16 bg-white">
          <div className="max-w-xs">
            <h2 className="text-3xl font-light mb-5">Inventive Artistry</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Jean Schlumberger ushered in an unprecedented era of jewelry
              design when he began his legendary collaboration with our House.
              With his unique ability to balance jubilant opulence with tasteful
              restraint, he created transcendent jewels and wearable art,
              including the House's most emblematic creation: the Bird on a
              Rock.
            </p>
            <Link
              to="/shop"
              className="text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:opacity-60 transition"
            >
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Diamonds & Coloured Gemstones (2-up grid) */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tile 1 – Diamonds */}
          <Link to="/shop" className="group overflow-hidden block">
            <div className="overflow-hidden h-[55vh]">
              <img
                src={IMGS.rings?.[0] ?? IMGS.luxury[0]}
                alt="Tiffany Diamonds"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
            </div>
            <p className="mt-3 text-sm text-center tracking-widest uppercase text-gray-700">
              Tiffany Diamonds
            </p>
          </Link>

          {/* Tile 2 – Coloured Gemstones */}
          <Link to="/shop" className="group overflow-hidden block">
            <div className="overflow-hidden h-[55vh]">
              <img
                src={IMGS.rings?.[1] ?? IMGS.luxury[1]}
                alt="Tiffany Colored Gemstones"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
            </div>
            <p className="mt-3 text-sm text-center tracking-widest uppercase text-gray-700">
              Tiffany Colored Gemstones
            </p>
          </Link>
        </div>
      </section>

      {/* SECTION 4: Legendary Acquisitions */}
      <section className="grid md:grid-cols-2 min-h-[85vh] bg-[#f5f5f3]">
        {/* Left: text */}
        <div className="flex items-center justify-center px-8 md:px-16 py-16 order-1">
          <div className="max-w-sm">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
              Gemological Wonders
            </p>
            <h2 className="text-4xl font-light leading-snug mb-6">
              Legendary <em>Acquisitions</em>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Discover our latest gemological acquisition: an extraordinary
              7,500-carat kunzite — one of the largest and most vivid examples
              of this rare pink gem ever unearthed. Nature's most breathtaking
              treasures, brought to light.
            </p>
            <Link
              to="/shop"
              className="text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:opacity-60 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: gem image */}
        <Link
          to="/shop"
          className="h-[60vh] md:h-auto order-2 overflow-hidden block"
        >
          <img
            src={IMGS.luxury[4] ?? IMGS.luxury[2]}
            alt="Extraordinary 7,500-carat kunzite gemstone"
            className="w-full h-full object-cover object-center cursor-pointer"
          />
        </Link>
      </section>

      {/* INTRO */}
      <section className="max-w-3xl mx-auto text-center py-16 px-6">
        <h2 className="text-3xl font-light">Masterpieces Born from Passion</h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
          Every piece in our High Jewelry collection is a singular work of art,
          crafted by hand using the world's most extraordinary gemstones.
        </p>
      </section>

      {/* FEATURED STORY */}
      <section className="grid md:grid-cols-2 min-h-screen">
        <div className="flex items-center justify-center px-8 md:px-16 py-16 bg-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-light mb-6">Inventive Artistry</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Inspired by the world's most extraordinary gemstones, our High
              Jewelry creations celebrate exceptional craftsmanship and timeless
              elegance. Each masterpiece is meticulously handcrafted to
              transform rare stones into wearable works of art.
            </p>
            <Link
              to="/shop"
              className="text-xs tracking-[0.2em] uppercase border-b border-black pb-1 hover:opacity-70 transition"
            >
              Discover More
            </Link>
          </div>
        </div>
        <Link to="/shop" className="h-[60vh] md:h-screen block">
          <img
            src={IMGS.luxury[1]}
            alt="High Jewelry Artistry"
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-light text-center mb-10 tracking-wide">
          The Collection
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">
            No high jewelry items found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* STORY BANNER */}
      <section className="bg-gray-900 text-white py-24 text-center px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
          Our Promise
        </p>
        <h2 className="text-3xl font-light">Where Artistry Meets Excellence</h2>
      </section>

      {/* BREADCRUMB */}
      <div className="text-center py-6 text-xs text-gray-400">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" className="hover:underline">
          All Products
        </Link>{" "}
        / High Jewelry
      </div>
    </div>
  );
}
