import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Newsletter */}
        <div className="text-center mb-14 pb-14 border-b border-gray-700">
          <p className="font-cormorant text-3xl font-light text-white mb-2 italic">Join the World of Lumière</p>
          <p className="text-xs tracking-widest text-gray-400 mb-6 uppercase">Exclusive collections, events, and private previews</p>
          <div className="flex max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 bg-transparent border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold" />
            <button className="bg-gold text-black px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-yellow-500 transition-colors">Subscribe</button>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">Company</h4>
            {['About Us','Careers','Sustainability','News'].map(l => (
              <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gold mb-2 transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">Customer Service</h4>
            {['Contact Us','FAQs','Shipping','Returns'].map(l => (
              <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gold mb-2 transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">Collections</h4>
            {['High Jewelry','Engagement','Watches','Accessories'].map(l => (
              <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gold mb-2 transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">Follow Us</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Youtube size={18} /></a>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">@lumiereandco</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 Lumière & Co. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy','Terms & Conditions','Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-xs text-gray-500 hover:text-gold transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
