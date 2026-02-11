import React from 'react';
import { Check, Star, UserPlus, Shield, Heart } from 'lucide-react';
import { PageView } from '../types';

interface PageProps {
  onNavigate: (page: PageView) => void;
}

export const HowItWorks: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase">The Path to Love</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">
            How Virgins Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            A simple, dignified process designed to help you find your future spouse.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 hidden md:block"></div>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between gap-12">
            
            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                1
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><UserPlus className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Create Your Profile</h3>
                <p className="text-slate-500">
                  Share your values, faith, and what you are looking for. Our detailed onboarding ensures you present your authentic self.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                2
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><Shield className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Get Verified</h3>
                <p className="text-slate-500">
                  Safety is our priority. Every profile undergoes manual review to ensure the community remains authentic and safe.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                3
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><Heart className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Intentional Dating</h3>
                <p className="text-slate-500">
                  Browse matches who share your convictions. Start conversations that matter and lead to a lifelong covenant.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => onNavigate('home')} 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-transform hover:-translate-y-1"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const Pricing: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Membership</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">
            Invest in Your Future
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Transparent pricing for serious daters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-medium text-slate-900 font-serif">Guest</h3>
            <p className="mt-4 flex items-baseline text-slate-900">
              <span className="text-4xl font-extrabold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </p>
            <p className="mt-6 text-slate-500">Perfect for looking around and getting a feel for the community.</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Create Profile</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Browse Matches</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Basic AI Profile Help</span></li>
            </ul>
            <button onClick={() => onNavigate('home')} className="mt-8 block w-full bg-slate-100 border border-transparent rounded-full py-3 px-6 text-center font-medium text-slate-900 hover:bg-slate-200">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-500 p-8 transform scale-105 relative z-10">
            <div className="absolute top-0 right-0 -mr-1 -mt-1 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-medium text-slate-900 font-serif">Covenant</h3>
            <p className="mt-4 flex items-baseline text-slate-900">
              <span className="text-4xl font-extrabold tracking-tight">$29</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </p>
            <p className="mt-6 text-slate-500">For those ready to intentionally pursue marriage.</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-primary-500" /><span className="ml-3 text-slate-900">Everything in Guest</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-primary-500" /><span className="ml-3 text-slate-900">Unlimited Messaging</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-primary-500" /><span className="ml-3 text-slate-900">See Who Liked You</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-primary-500" /><span className="ml-3 text-slate-900">Advanced Filters (Faith, Values)</span></li>
            </ul>
            <button onClick={() => onNavigate('home')} className="mt-8 block w-full bg-primary-600 border border-transparent rounded-full py-3 px-6 text-center font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30">
              Join Covenant
            </button>
          </div>

          {/* Concierge Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-medium text-slate-900 font-serif">Concierge</h3>
            <p className="mt-4 flex items-baseline text-slate-900">
              <span className="text-4xl font-extrabold tracking-tight">$99</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </p>
            <p className="mt-6 text-slate-500">Personalized matchmaking assistance.</p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Everything in Covenant</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Profile Consultation</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">Priority Support</span></li>
              <li className="flex items-start"><Check className="flex-shrink-0 h-5 w-5 text-green-500" /><span className="ml-3 text-slate-500">1-on-1 Coaching Session</span></li>
            </ul>
            <button onClick={() => onNavigate('home')} className="mt-8 block w-full bg-slate-100 border border-transparent rounded-full py-3 px-6 text-center font-medium text-slate-900 hover:bg-slate-200">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};