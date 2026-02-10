import React from 'react';
import { Apple, Smartphone, Monitor } from 'lucide-react';

const DownloadSection: React.FC = () => {
  return (
    <div id="download" className="bg-primary-700">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block font-serif">Ready to find your match?</span>
            <span className="block text-primary-200 text-2xl mt-2 font-normal">Start your journey to marriage today.</span>
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Available across all your favorite devices. Join thousands of others who are waiting for the right one.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
          <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors shadow-sm">
            <Apple className="w-5 h-5 mr-2 -ml-1 fill-current" />
            App Store
          </button>
          <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors shadow-sm">
            <Smartphone className="w-5 h-5 mr-2 -ml-1" />
            Google Play
          </button>
           <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-900 transition-colors shadow-sm border-primary-600">
            <Monitor className="w-5 h-5 mr-2 -ml-1" />
            Linux / Web
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;