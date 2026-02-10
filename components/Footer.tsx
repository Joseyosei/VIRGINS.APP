import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
           <a href="#" className="text-slate-400 hover:text-primary-500">About</a>
           <a href="#" className="text-slate-400 hover:text-primary-500">Guidelines</a>
           <a href="#" className="text-slate-400 hover:text-primary-500">Safety</a>
           <a href="#" className="text-slate-400 hover:text-primary-500">Contact</a>
        </div>
        <div className="mt-8 flex justify-center items-center">
           <Heart className="h-5 w-5 text-primary-400 mr-2" />
           <p className="text-center text-base text-slate-400">
            &copy; {new Date().getFullYear()} Virgins Dating App. All rights reserved.
          </p>
        </div>
        <p className="text-center text-xs text-slate-300 mt-2">
          Promoting traditional values and sanctity in relationships.
        </p>
      </div>
    </footer>
  );
};

export default Footer;