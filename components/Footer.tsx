import React from 'react';
import { Heart } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('about')} className="text-base text-slate-500 hover:text-primary-600">About Us</button></li>
              <li><button onClick={() => onNavigate('careers')} className="text-base text-slate-500 hover:text-primary-600">Careers</button></li>
              <li><button onClick={() => onNavigate('press')} className="text-base text-slate-500 hover:text-primary-600">Press</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-base text-slate-500 hover:text-primary-600">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('how-it-works')} className="text-base text-slate-500 hover:text-primary-600">How It Works</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-base text-slate-500 hover:text-primary-600">Pricing</button></li>
              <li><button onClick={() => onNavigate('safety')} className="text-base text-slate-500 hover:text-primary-600">Safety Center</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('privacy')} className="text-base text-slate-500 hover:text-primary-600">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="text-base text-slate-500 hover:text-primary-600">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('cookies')} className="text-base text-slate-500 hover:text-primary-600">Cookie Policy</button></li>
            </ul>
          </div>
          <div>
             <div className="flex items-center gap-2 mb-4">
               <Heart className="h-6 w-6 text-primary-500 fill-current" />
               <span className="text-xl font-serif font-bold text-slate-900">Virgins</span>
             </div>
             <p className="text-sm text-slate-500 mb-4">
               The premier dating app for those committed to traditional values and saving intimacy for marriage.
             </p>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Virgins Dating App. All rights reserved.
          </p>
          <p className="text-sm text-slate-300 mt-2 md:mt-0">
            Promoting sanctity in relationships.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;