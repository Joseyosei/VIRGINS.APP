import React from 'react';
import { Lock, Heart, Users, Sparkles, BrainCircuit } from 'lucide-react';

const features = [
  { id: 1, title: 'The Covenant Algorithm', description: 'Our proprietary matching engine goes beyond hobbies. We align profiles based on theological stance, family goals, and purity commitments.', icon: <BrainCircuit className="h-6 w-6" /> },
  { id: 2, title: 'Verified Community', description: 'We prioritize safety. Every user undergoes multi-factor verification (Face, ID, Voice) to ensure a bot-free, authentic environment.', icon: <Users className="h-6 w-6" /> },
  { id: 3, title: 'Values-First Design', description: 'We removed the "hookup" mechanics. No infinite swiping. We encourage intentionality with limits that foster deeper conversation.', icon: <Lock className="h-6 w-6" /> },
  { id: 4, title: 'Matchmaker Assist', description: 'Our AI coach helps you articulate your high standards respectfully, ensuring you attract the right kind of attention.', icon: <Sparkles className="h-6 w-6" /> },
];

export default function Features() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Technology Meets Tradition</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">Built for the <span className="text-primary-600">Forever</span> Mindset</p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">We combined modern technology with timeless values to solve the modern dating crisis.</p>
        </div>
        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
            {features.map((f) => (
              <div key={f.id} className="relative group">
                <dt>
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <p className="ml-20 text-xl leading-6 font-bold text-slate-900 font-serif">{f.title}</p>
                </dt>
                <dd className="mt-2 ml-20 text-base text-slate-500 leading-relaxed">{f.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
