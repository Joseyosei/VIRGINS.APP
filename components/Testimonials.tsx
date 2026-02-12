
import React from 'react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rebecca & Thomas',
    role: 'Married 2 years',
    quote: "We were both tired of the modern dating scene. Finding Virgins was a breath of fresh air. Knowing we shared the same boundaries from day one made everything easier.",
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=300&h=300&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Emily & David',
    role: 'Engaged',
    quote: "I never thought I'd find someone who respected my choice to wait. This app didn't just find me a date; it found me my future husband.",
    image: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=300&h=300&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Michael',
    role: 'Member since 2023',
    quote: "The community here is different. It's respectful, serious, and intentional. Highly recommend for anyone serious about marriage.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop',
  },
];

const Testimonials: React.FC = () => {
  return (
    <div id="stories" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-xl text-slate-500">
            Real people finding real love, the traditional way.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-200 shadow-sm"
                    src={t.image}
                    alt={t.name}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">{t.name}</h3>
                  <p className="text-xs font-bold text-gold-600 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed flex-1">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
