import React from 'react';
import { Lock, Heart, Users, Star } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    id: 1,
    title: 'Shared Values',
    description: 'Connect with people who understand that waiting isn\'t just a rule, but a lifestyle of intentionality and respect.',
    icon: <Heart className="h-6 w-6" />,
  },
  {
    id: 2,
    title: 'Verified Community',
    description: 'We prioritize safety and authenticity. Our community is vetted to ensure genuine intentions.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 3,
    title: 'Marriage Minded',
    description: 'No endless swiping. Our algorithm focuses on long-term compatibility for those ready for commitment.',
    icon: <Lock className="h-6 w-6" />,
  },
  {
    id: 4,
    title: 'Quality Matches',
    description: 'Fewer matches, higher quality. We focus on depth over breadth to help you find your soulmate.',
    icon: <Star className="h-6 w-6" />,
  },
];

const Features: React.FC = () => {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">
            A sanctuary for traditional romance
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            We built this platform because we believe that shared values are the foundation of a lasting marriage.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.id} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-slate-900 font-serif">{feature.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-slate-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;