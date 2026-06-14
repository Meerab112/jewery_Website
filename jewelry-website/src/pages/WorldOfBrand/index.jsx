import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IMGS } from "../../data/products";

export default function WorldOfBrand() {
  const [stories, setStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [values, setValues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/brand-content");

        if (!res.ok) throw new Error("Failed to fetch brand content");

        const data = await res.json();

        setStories(data.stories || []);
        setEvents(data.events || []);
        setValues(data.values || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={IMGS.model[3]}
          alt="World of Lumière"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="font-playfair text-5xl md:text-7xl font-light">
            World of <em>Lumière</em>
          </h1>
        </div>
      </section>

      {/* LOADING / ERROR */}
      <div className="text-center py-6">
        {loading && <p className="text-gray-500">Loading brand content...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* BRAND STORY STATIC (you can also move this to backend later) */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="font-playfair text-4xl font-light mb-8">
          A Legacy of <em>Excellence</em>
        </h2>
        <p className="text-gray-600 leading-relaxed">
          For over a century, Lumière & Co. has been synonymous with
          extraordinary beauty and craftsmanship.
        </p>
      </section>

      {/* STORIES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-light mb-12">Our Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((s, i) => (
              <div key={i} className="group">
                <div className="overflow-hidden aspect-video mb-5">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>

                <h3 className="text-xl font-light mb-2">{s.title}</h3>

                <p className="text-sm text-gray-600 mb-3">{s.desc}</p>

                <Link to={s.link || "/"} className="text-xs uppercase border-b">
                  Read More <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-light mb-12">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <div key={i} className="border group">
              <div className="overflow-hidden aspect-[4/3]">
                <img
                  src={e.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>

              <div className="p-6">
                <p className="text-xs text-gold">{e.date}</p>
                <h3 className="text-lg font-light">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-light mb-14">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {values.map((v, i) => (
              <div key={i}>
                <h3 className="text-xl font-light mb-4">{v.title}</h3>
                <p className="text-sm text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FALLBACK */}
      {!loading && stories.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No brand content found
        </p>
      )}

      {/* FOOTER */}
      <div className="text-center py-8 text-xs text-gray-400">
        <Link to="/">Home</Link> / World of Lumière
      </div>
    </div>
  );
}
/*import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IMGS } from '../../data/products';

const stories = [
  { title:'The Art of Craftsmanship', desc:'Step inside our ateliers and witness master jewelers at work, where centuries-old techniques meet modern innovation.', img: IMGS.ring[0] },
  { title:'Our Heritage', desc:'Founded in the heart of luxury, Lumière & Co. has been creating extraordinary jewelry since 1886.', img: IMGS.necklace[0] },
  { title:'Responsible Sourcing', desc:'We are committed to the highest standards of ethical mining and responsible gem sourcing.', img: IMGS.earring[0] },
  { title:'The Blue Box Story', desc:'Our signature packaging has become one of the most recognized luxury symbols in the world.', img: IMGS.bracelet[0] },
];

const events = [
  { title:'Private Salon Preview', date:'December 12, 2024', location:'Karachi Boutique', img: IMGS.model[0] },
  { title:'Diamond Masterclass', date:'December 18, 2024', location:'Lahore Gallery', img: IMGS.model[1] },
  { title:'Holiday Collection Launch', date:'January 5, 2025', location:'Islamabad Store', img: IMGS.model[2] },
];

export default function WorldOfBrand() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero }
      <section className="relative h-screen overflow-hidden">
        <img src={IMGS.model[3]} alt="World of Lumière" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-xs tracking-[0.5em] uppercase mb-4 opacity-70">Lumière & Co.</p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light mb-6 leading-tight">World of <em>Lumière</em></h1>
          <p className="max-w-xl text-sm leading-relaxed opacity-80">Discover the stories, heritage, and artistry that make Lumière & Co. the world's most beloved luxury jewelry house.</p>
        </div>
      </section>

      {/* Brand Story }
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Est. 1886</p>
        <h2 className="font-playfair text-4xl font-light mb-8 leading-tight">A Legacy of <em>Excellence</em></h2>
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          For over a century, Lumière & Co. has been synonymous with extraordinary beauty, unparalleled craftsmanship, and the finest gemstones the world has to offer. Our journey began with a single vision: to create pieces so exceptional they transcend time itself.
        </p>
        <p className="text-base text-gray-600 leading-relaxed">
          From our flagship boutiques to our private ateliers, every aspect of the Lumière experience reflects our unwavering commitment to excellence. We believe that true luxury is not just about beauty — it is about meaning, story, and the human connections that jewelry celebrates.
        </p>
      </section>

      {/* Stories grid }
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-light text-center mb-12">Our Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((s, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden aspect-video mb-5">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="font-playfair text-xl font-light mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.desc}</p>
                <Link to="/" className="text-xs tracking-widest uppercase border-b border-gray-400 pb-0.5 hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-2">
                  Read More <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events }
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="font-playfair text-3xl font-light text-center mb-12">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <div key={i} className="border border-gray-100 group cursor-pointer hover:border-gold transition-colors duration-300">
              <div className="overflow-hidden aspect-[4/3]">
                <img src={e.img} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <p className="text-xs tracking-widest uppercase text-gold mb-2">{e.date}</p>
                <h3 className="font-playfair text-lg font-light mb-1">{e.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{e.location}</p>
                <button className="text-xs tracking-widest uppercase border-b border-gray-400 pb-0.5 hover:border-gold hover:text-gold transition-colors">RSVP Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values }
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-light text-center mb-14">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title:'Exceptional Craft', desc:'Every piece passes through the hands of our master artisans, who dedicate hundreds of hours to perfecting each creation.' },
              { title:'Responsible Luxury', desc:'We source all materials ethically, working only with certified suppliers who share our commitment to environmental and social responsibility.' },
              { title:'Timeless Design', desc:'We design with eternity in mind — pieces that will be passed down through generations, growing more meaningful with time.' },
            ].map((v, i) => (
              <div key={i} className="px-6">
                <div className="w-12 h-0.5 bg-gold mx-auto mb-6"></div>
                <h3 className="font-playfair text-xl font-light mb-4">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumb }
      <div className="text-center py-8 text-xs text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-gold">Home</Link> <span className="mx-2">/</span> <span>World of Lumière</span>
      </div>
    </div>
  );
}
*/
