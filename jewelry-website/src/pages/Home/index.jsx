import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import { IMGS } from "../../data/products";

const categories = [
  { label: "Necklaces & Pendants", img: IMGS.necklace[0], path: "/jewelry" },
  { label: "Bracelets", img: IMGS.bracelet[0], path: "/jewelry" },
  { label: "Earrings", img: IMGS.earring[0], path: "/jewelry" },
  { label: "Rings", img: IMGS.ring[0], path: "/jewelry" },
  { label: "Watches", img: IMGS.watch[0], path: "/watches" },
];

const experience = [
  {
    title: "Book an Appointment",
    desc: "Meet with our jewelry specialists virtually or in-store for personalized recommendations.",
    link: "Book a Virtual Appointment",
    img: IMGS.luxury[0],
  },
  {
    title: "Customer Care",
    desc: "Receive expert assistance regarding orders, products, repairs, and services.",
    link: "Learn More",
    img: IMGS.luxury[1],
  },
  {
    title: "The Iconic Blue Box",
    desc: "Every Lumière purchase arrives beautifully packaged in our signature blue box.",
    link: "Learn More",
    img: IMGS.luxury[2],
  },
];

export default function Home() {
  const sliderRef = useRef(null);

  const [jewelryProducts, setJewelryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (dir) => {
    sliderRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  // ✅ FETCH FROM BACKEND (MySQL via Express)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        setJewelryProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="pt-24">
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=80"
          alt="Hero"
          className="w-full h-full object-cover scale-105 animate-[slowZoom_8s_ease-out_forwards]"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-80">
            New Collection 2024
          </p>

          <h1 className="font-playfair text-5xl md:text-7xl font-light mb-6 leading-tight">
            Timeless <br />
            <em className="italic">Elegance</em>
          </h1>

          <p className="text-sm tracking-widest uppercase opacity-75 mb-10 max-w-md">
            Extraordinary jewelry crafted for life's most precious moments
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/jewelry"
              className="border border-white text-white text-xs uppercase px-8 py-3.5 hover:bg-white hover:text-black transition"
            >
              Shop Now
            </Link>

            <Link
              to="/high-jewelry"
              className="bg-gold text-black text-xs uppercase px-8 py-3.5 hover:bg-yellow-400 transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="section-title font-playfair">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link key={cat.label} to={cat.path} className="group block">
              <div className="overflow-hidden aspect-[3/4] bg-gray-100 mb-3">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <p className="text-center text-xs uppercase tracking-widest text-gray-700 group-hover:text-gold">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* SLIDER */}
      <section className="pb-20 bg-luxury-light py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title font-playfair">New Jewelry</h2>

          <div className="relative">
            <button
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2"
            >
              <ChevronLeft />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            >
              {loading ? (
                <p className="text-gray-500">Loading products...</p>
              ) : (
                jewelryProducts.map((p) => (
                  <div key={p.id} className="min-w-[260px] md:min-w-[280px]">
                    <ProductCard product={p} />
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="section-title font-playfair">Our Collections</h2>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {jewelryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* EXPERIENCE */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title font-playfair">
            The Lumière Experience
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {experience.map((card, i) => (
              <div key={i} className="text-center">
                <img
                  src={card.img}
                  className="aspect-square object-cover mb-6 w-full"
                  alt={card.title}
                />

                <h3 className="font-playfair text-xl mb-3">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.desc}</p>

                <a href="#" className="text-xs uppercase border-b">
                  {card.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
/*import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { jewelryProducts, IMGS } from '../../data/products';

const categories = [
  { label: 'Necklaces & Pendants', img: IMGS.necklace[0], path: '/jewelry' },
  { label: 'Bracelets',             img: IMGS.bracelet[0], path: '/jewelry' },
  { label: 'Earrings',              img: IMGS.earring[0],  path: '/jewelry' },
  { label: 'Rings',                 img: IMGS.ring[0],     path: '/jewelry' },
  { label: 'Watches',               img: IMGS.watch[0],    path: '/watches' },
];

const experience = [
  { title:'Book an Appointment', desc:'Meet with our jewelry specialists virtually or in-store for personalized recommendations.', link:'Book a Virtual Appointment', img: IMGS.luxury[0] },
  { title:'Customer Care',        desc:'Receive expert assistance regarding orders, products, repairs, and services.',               link:'Learn More',                  img: IMGS.luxury[1] },
  { title:'The Iconic Blue Box',  desc:'Every Lumière purchase arrives beautifully packaged in our signature blue box.',            link:'Learn More',                  img: IMGS.luxury[2] },
];

export default function Home() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scroll = dir => {
    sliderRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="pt-24">
      {/* Hero }
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=80" alt="Hero" className="w-full h-full object-cover scale-105 animate-[slowZoom_8s_ease-out_forwards]" />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-80">New Collection 2024</p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light mb-6 leading-tight">Timeless <br /><em className="italic">Elegance</em></h1>
          <p className="text-sm tracking-widest uppercase opacity-75 mb-10 max-w-md">Extraordinary jewelry crafted for life's most precious moments</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/jewelry" className="border border-white text-white text-xs tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white hover:text-black transition-all duration-300">Shop Now</Link>
            <Link to="/high-jewelry" className="bg-gold text-black text-xs tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-yellow-400 transition-colors">Explore Collection</Link>
          </div>
        </div>
      </section>

      {/* Shop by Category }
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="section-title font-playfair">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link key={cat.label} to={cat.path} className="group block">
              <div className="overflow-hidden aspect-[3/4] bg-gray-100 mb-3">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
              </div>
              <p className="text-center text-xs tracking-[0.15em] uppercase font-medium text-gray-700 group-hover:text-gold transition-colors">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Icons of Summer }
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {[
            { img: IMGS.model[0], heading:'Note by Lumière', desc:'Inspired by an archived book crafted in 1889. Note embodies meaningful connection and timeless elegance.', link:'/jewelry' },
            { img: IMGS.model[1], heading:'Hardware by Lumière', desc:'Drawing inspiration from a design created in 1962. Hardware is an expression of love, strength, and modern style.', link:'/jewelry' },
          ].map((card, i) => (
            <div key={i} className="relative group overflow-hidden">
              <img src={card.img} alt={card.heading} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="font-playfair text-2xl font-light mb-2">{card.heading}</h3>
                <p className="text-sm opacity-80 mb-4 leading-relaxed">{card.desc}</p>
                <Link to={card.link} className="text-xs tracking-widest uppercase border-b border-white/60 pb-0.5 hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-2">
                  Shop the Collection <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Jewelry Slider }
      <section className="pb-20 bg-luxury-light py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title font-playfair">New Jewelry</h2>
          <div className="relative">
            <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 hover:bg-gold hover:text-white transition-colors -translate-x-4">
              <ChevronLeft size={20} />
            </button>
            <div ref={sliderRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2" style={{ scrollbarWidth:'none' }}>
              {jewelryProducts.map(p => (
                <div key={p.id} className="min-w-[260px] md:min-w-[280px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 hover:bg-gold hover:text-white transition-colors translate-x-4">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-center mt-10">
            <Link to="/jewelry" className="text-xs tracking-[0.2em] uppercase border-b border-gray-400 pb-1 hover:border-gold hover:text-gold transition-colors">
              Show Most Popular Jewelry
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Video }
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          <div className="aspect-video md:aspect-[4/3] bg-gray-900 overflow-hidden relative">
            <img src={IMGS.model[2]} alt="Collection" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-10 md:p-16 flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Exclusive Film</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-light mb-6 leading-tight">The Art of <em>Luxury</em></h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">Discover extraordinary craftsmanship and timeless elegance through our latest jewelry collection — where every piece tells a story of dedication and artistry.</p>
            <Link to="/high-jewelry" className="inline-flex self-start border border-gray-900 text-xs tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-gray-900 hover:text-white transition-all duration-300">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Story }
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          <div className="bg-gray-900 text-white p-10 md:p-16 order-2 md:order-1">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Story</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-light mb-6 leading-tight">Crafted for Every <em>Occasion</em></h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">Each piece is designed to celebrate life's most meaningful moments through exceptional craftsmanship — from the first date to the golden anniversary.</p>
            <Link to="/high-jewelry" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold border-b border-gold pb-0.5 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
              Explore Collection <ArrowRight size={12} />
            </Link>
          </div>
          <div className="aspect-[4/3] overflow-hidden order-1 md:order-2">
            <img src={IMGS.model[3]} alt="Story" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* 20 Products Grid }
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="section-title font-playfair">Our Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {jewelryProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/jewelry" className="luxury-btn inline-block">View All Jewelry</Link>
        </div>
      </section>

      {/* Tiffany Experience }
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title font-playfair">The Lumière Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experience.map((card, i) => (
              <div key={i} className="text-center group">
                <div className="overflow-hidden aspect-square mb-6 bg-gray-200">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-playfair text-xl font-light mb-3">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.desc}</p>
                <a href="#" className="text-xs tracking-widest uppercase border-b border-gray-400 pb-0.5 hover:border-gold hover:text-gold transition-colors">{card.link}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
*/
