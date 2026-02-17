import React from 'react';
import { Heart, MapPin, Mail, Shield, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const links = {
    'Product': [{ label: 'How It Works', page: 'how-it-works' }, { label: 'Pricing', page: 'pricing' }, { label: 'Testimonials', page: 'home' }],
    'Company': [{ label: 'About', page: 'about' }, { label: 'Careers', page: 'careers' }, { label: 'Press', page: 'press' }, { label: 'Contact', page: 'contact' }],
    'Legal': [{ label: 'Privacy', page: 'privacy' }, { label: 'Terms', page: 'terms' }, { label: 'Cookies', page: 'cookies' }, { label: 'Safety', page: 'safety' }],
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <span className="text-xl font-serif font-bold text-gold-500">VIRGINS</span>
            <p className="text-xs text-slate-400 mt-2 mb-4 max-w-[200px]">The premium faith-based dating platform for marriage-minded individuals.</p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h3>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.page}>
                    <button onClick={() => onNavigate(item.page)} className="text-sm text-slate-300 hover:text-gold-500 transition-colors">{item.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">&copy; 2024 Virgins Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="p-2 text-slate-500 hover:text-gold-500 transition-colors"><Twitter size={16} /></button>
            <button className="p-2 text-slate-500 hover:text-gold-500 transition-colors"><Instagram size={16} /></button>
            <button className="p-2 text-slate-500 hover:text-gold-500 transition-colors"><Mail size={16} /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
