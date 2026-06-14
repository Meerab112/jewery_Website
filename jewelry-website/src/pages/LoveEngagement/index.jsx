import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IMGS } from "../../data/products";

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between w-full text-left text-sm font-medium text-gray-800"
        onClick={() => setOpen(!open)}
      >
        {q}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

const diffCards = [
  {
    title: "Explore Diamond Cuts",
    desc: "Learn about the unique cuts that maximize brilliance and sparkle.",
    img: IMGS.ring[0],
  },
  {
    title: "Explore Diamond Provenance",
    desc: "Discover the journey of every responsibly sourced diamond.",
    img: IMGS.ring[1],
  },
  {
    title: "Explore a Lifetime of Service",
    desc: "Enjoy expert care and complimentary services throughout your ownership.",
    img: IMGS.ring[2],
  },
];

const faqItems = [
  {
    q: "What is Lumière Ring Studio?",
    a: "Designed by you. Crafted by Lumière. We invite you to create an engagement ring as extraordinary as your relationship.",
  },
  {
    q: "Can I customize my diamond?",
    a: "Yes. Our diamond experts will guide you through selection of cut, carat, color, clarity.",
  },
  { q: "How long does production take?", a: "Custom rings take 4–6 weeks." },
  {
    q: "Can I resize my ring?",
    a: "Complimentary lifetime resizing is included.",
  },
];

// ── NEW: hover image swap component ──────────────────────────────────────────
function RingCard({ ring, onClick }) {
  const [hovered, setHovered] = useState(false);

  // Collect all images, filter nulls
  const allImgs = [
    ring.img_url,
    ring.model_img_url,
    ring.image2,
    ring.image3,
    ring.image4,
    ring.image5,
  ].filter(Boolean);

  const displayImg = hovered && allImgs[1] ? allImgs[1] : allImgs[0];

  return (
    <div
      className="group cursor-pointer bg-white"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={displayImg}
          alt={ring.name}
          className="w-full h-full object-cover transition duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/jewelry/r1.webp";
          }}
        />

        {/* Material badge */}
        <span
          className="absolute top-2 left-2 bg-white/90 text-gray-700
                         text-[10px] px-2 py-0.5 rounded-full border border-gray-200"
        >
          {ring.material}
        </span>

        {/* Thumbnail strip — shows on hover if extra images exist */}
        {allImgs.length > 2 && (
          <div
            className="absolute bottom-2 left-0 right-0 flex justify-center
                          gap-1 opacity-0 group-hover:opacity-100 transition"
          >
            {allImgs.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`view ${i + 1}`}
                className="w-7 h-7 object-cover rounded border-2 border-white"
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 text-center">
        <p className="font-playfair text-sm text-gray-800">{ring.name}</p>

        {/* Stone from specialization e.g. "Stone: Zircon" */}
        {ring.specialization && (
          <p className="text-[11px] text-gray-400 mt-0.5">
            {ring.specialization
              .split("\n")
              .find((l) => l.startsWith("Stone"))
              ?.replace("Stone: ", "") ?? ""}
          </p>
        )}

        <p className="text-xs text-gold mt-1">
          Rs. {ring.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function LoveEngagement() {
  const navigate = useNavigate();
  const [engagementRings, setEngagementRings] = useState([]);
  const [weddingBands, setWeddingBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [res1, res2] = await Promise.all([
          fetch("http://localhost:5000/api/products?category=Rings"),
          fetch("http://localhost:5000/api/products?category=Bracelets"),
        ]);
        setEngagementRings(await res1.json());
        setWeddingBands(await res2.json());
      } catch (err) {
        console.error("Error fetching engagement page products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* ── Hero ── */}
      <section className="relative h-screen overflow-hidden">
        <video
          className="w-full h-full object-cover scale-105"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/tifny2.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-black/50 flex flex-col
                        items-center justify-center text-white text-center px-6"
        >
          <p className="text-xs tracking-[0.5em] uppercase mb-4 opacity-70">
            Est. 1886
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light mb-6">
            Love & <em>Engagement</em>
          </h1>
        </div>
      </section>

      {/* ── Engagement Rings ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-2 font-light">
            Engagement Rings
          </h2>
          <p className="text-center text-sm text-gray-400 mb-12">
            Hover a card to preview · Click to explore
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 aspect-square rounded"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {engagementRings.map((ring) => (
                <RingCard
                  key={ring.id}
                  ring={ring}
                  onClick={() => navigate(`/product/${ring.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Wedding Bands (unchanged) ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-12 font-light">
            Wedding Bands
          </h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {weddingBands.map((band) => (
                <div
                  key={band.id}
                  className="group cursor-pointer bg-white"
                  onClick={() => navigate(`/product/${band.id}`)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={band.img_url}
                      alt={band.name}
                      className="w-full h-full object-cover
                                 group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-playfair text-base">{band.name}</p>
                    <p className="text-sm text-gold">
                      Rs. {band.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Difference Section (unchanged) ── */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-10">The Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {diffCards.map((card, i) => (
              <div key={i} className="text-center">
                <img
                  src={card.img}
                  alt={card.title}
                  className="mb-4 w-full aspect-square object-cover"
                />
                <h3 className="text-lg">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (unchanged) ── */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl mb-8 text-center">FAQ</h2>
        {faqItems.map((item, i) => (
          <Accordion key={i} q={item.q} a={item.a} />
        ))}
      </section>

      {/* ── Breadcrumb (unchanged) ── */}
      <div className="text-center py-8 text-xs text-gray-400">
        <Link to="/">Home</Link> / Love & Engagement
      </div>
    </div>
  );
}
/*import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IMGS } from "../../data/products";

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between w-full text-left text-sm font-medium text-gray-800"
        onClick={() => setOpen(!open)}
      >
        {q}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

const diffCards = [
  {
    title: "Explore Diamond Cuts",
    desc: "Learn about the unique cuts that maximize brilliance and sparkle.",
    img: IMGS.ring[0],
  },
  {
    title: "Explore Diamond Provenance",
    desc: "Discover the journey of every responsibly sourced diamond.",
    img: IMGS.ring[1],
  },
  {
    title: "Explore a Lifetime of Service",
    desc: "Enjoy expert care and complimentary services throughout your ownership.",
    img: IMGS.ring[2],
  },
];

const faqItems = [
  {
    q: "What is Lumière Ring Studio?",
    a: "Designed by you. Crafted by Lumière. We invite you to create an engagement ring as extraordinary as your relationship.",
  },
  {
    q: "Can I customize my diamond?",
    a: "Yes. Our diamond experts will guide you through selection of cut, carat, color, clarity.",
  },
  { q: "How long does production take?", a: "Custom rings take 4–6 weeks." },
  {
    q: "Can I resize my ring?",
    a: "Complimentary lifetime resizing is included.",
  },
];

export default function LoveEngagement() {
  const navigate = useNavigate();
  const [engagementRings, setEngagementRings] = useState([]);
  const [weddingBands, setWeddingBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res1 = await fetch(
          "http://localhost:5000/api/products?category=Rings",
        );
        const ringsData = await res1.json();

        const res2 = await fetch(
          "http://localhost:5000/api/products?category=Bracelets",
        );
        const bandsData = await res2.json();

        setEngagementRings(ringsData);
        setWeddingBands(bandsData);
      } catch (err) {
        console.error("Error fetching engagement page products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24">
     //Hero 
      <section className="relative h-screen overflow-hidden">
        <video
          className="w-full h-full object-cover scale-105"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/tifny2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-xs tracking-[0.5em] uppercase mb-4 opacity-70">
            Est. 1886
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-light mb-6">
            Love & <em>Engagement</em>
          </h1>
        </div>
      </section>

      //Engagement Rings 
      <section className="py-20 bg-[#81D8D0]/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-12 font-light">
            Engagement Rings
          </h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {engagementRings.map((ring) => (
                <div
                  key={ring.id}
                  className="group cursor-pointer bg-white"
                  onClick={() => navigate(`/product/${ring.id}`)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={ring.img_url}
                      alt={ring.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                    {ring.model_img_url && (
                      <img
                        src={ring.model_img_url}
                        alt={ring.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition"
                      />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-playfair text-sm">{ring.name}</p>
                    <p className="text-xs text-gold">${ring.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

     //Wedding Bands
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-12 font-light">
            Wedding Bands
          </h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {weddingBands.map((band) => (
                <div
                  key={band.id}
                  className="group cursor-pointer bg-white"
                  onClick={() => navigate(`/product/${band.id}`)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={band.img_url}
                      alt={band.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-playfair text-base">{band.name}</p>
                    <p className="text-sm text-gold">${band.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      //Difference Section 
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl mb-10">The Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {diffCards.map((card, i) => (
              <div key={i} className="text-center">
                <img
                  src={card.img}
                  alt={card.title}
                  className="mb-4 w-full aspect-square object-cover"
                />
                <h3 className="text-lg">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      // FAQ 
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl mb-8 text-center">FAQ</h2>
        {faqItems.map((item, i) => (
          <Accordion key={i} q={item.q} a={item.a} />
        ))}
      </section>

      //Breadcrumb 
      <div className="text-center py-8 text-xs text-gray-400">
        <Link to="/">Home</Link> / Love & Engagement
      </div>
    </div>
  );
}
*/
