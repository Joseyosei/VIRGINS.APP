import React from 'react';

const DownloadSection: React.FC = () => {
  return (
    <div id="download" className="bg-navy-900 py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Phone Mockups Area */}
          <div className="relative w-full lg:w-1/2 h-[400px] sm:h-[500px] flex items-center justify-center">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/20 rounded-full blur-[80px]" />
            
            {/* Phone 1 (Behind) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-[65%] -translate-y-[45%] w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl rotate-[-8deg] z-10 overflow-hidden opacity-90">
               <div className="w-full h-full bg-slate-100 relative overflow-hidden">
                  {/* Mock UI: List */}
                  <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4">
                     <div className="w-24 h-3 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-4 space-y-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                           <div className="w-10 h-10 rounded-full bg-primary-100 flex-shrink-0"></div>
                           <div className="ml-3 space-y-1 w-full">
                              <div className="w-20 h-2 bg-slate-200 rounded"></div>
                              <div className="w-32 h-2 bg-slate-100 rounded"></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Phone 2 (Front) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-[35%] -translate-y-[55%] w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] bg-slate-900 rounded-[40px] border-[6px] border-slate-800 shadow-2xl rotate-[8deg] z-20 overflow-hidden ring-1 ring-white/10">
               {/* Screen Content */}
               <div className="w-full h-full bg-navy-900 relative flex flex-col">
                  {/* Status Bar Mock */}
                  <div className="h-6 w-full flex justify-between px-4 items-center mt-1">
                     <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                     <div className="w-4 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  
                  {/* App Content */}
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                     <div className="w-20 h-20 rounded-full border-2 border-gold-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,165,116,0.3)]">
                        <span className="text-3xl font-serif text-gold-500 font-bold">V</span>
                     </div>
                     <h3 className="text-white font-serif text-2xl font-bold mb-2 tracking-wide">VIRGINS</h3>
                     <p className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-8 border-b border-gold-500/30 pb-4">Love Worth Waiting For</p>
                     
                     <div className="w-full space-y-3">
                        <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4 border border-white/10">
                           <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                           <div className="w-24 h-2 bg-white/30 rounded"></div>
                        </div>
                        <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4 border border-white/10">
                           <div className="w-4 h-4 rounded-full bg-primary-500 mr-3"></div>
                           <div className="w-32 h-2 bg-white/30 rounded"></div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Bottom Action */}
                  <div className="p-6 pt-0">
                     <div className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-navy-900 font-bold text-sm tracking-wide">GET STARTED</span>
                     </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mb-2"></div>
               </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6 leading-tight tracking-tight">
              Download <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Our App Now</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the difference of a community dedicated to traditional values. 
              Seamless matching, verified profiles, and intentional dating—all in your pocket.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              
              {/* Apple Store Button */}
              <a href="#" className="flex items-center bg-black border border-white/20 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all group min-w-[180px] justify-center sm:justify-start hover:border-white/40 shadow-lg">
                <svg className="w-8 h-8 mr-3 text-white fill-current" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                </svg>
                <div className="text-left flex flex-col justify-center">
                  <div className="text-[10px] text-white uppercase tracking-wider font-medium leading-none mb-1">Download on the</div>
                  <div className="text-lg font-bold text-white leading-none font-sans">App Store</div>
                </div>
              </a>
              
              {/* Google Play Button */}
              <a href="#" className="flex items-center bg-black border border-white/20 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all group min-w-[180px] justify-center sm:justify-start hover:border-white/40 shadow-lg">
                <div className="mr-3 w-8 h-8 relative flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#4285F4" d="M5.64 5.64L24 24L5.64 42.36C4.83 41.51 4.36 40.32 4.36 38.91V9.09C4.36 7.68 4.83 6.49 5.64 5.64Z"/>
                    <path fill="#EA4335" d="M24 24L32.74 15.26L9.83 4.66C8.83 4.34 7.74 4.5 6.89 5.09L24 24Z"/>
                    <path fill="#34A853" d="M24 24L32.74 32.74L9.83 43.34C8.83 43.66 7.74 43.5 6.89 42.91L24 24Z"/>
                    <path fill="#FBBC04" d="M40.92 28.08L32.74 32.74L24 24L32.74 15.26L40.92 19.92C42.14 20.62 42.78 21.96 42.78 24C42.78 26.04 42.14 27.38 40.92 28.08Z"/>
                  </svg>
                </div>
                <div className="text-left flex flex-col justify-center">
                  <div className="text-[10px] text-white uppercase tracking-wider font-medium leading-none mb-1">GET IT ON</div>
                  <div className="text-xl font-bold text-white leading-none font-sans">Google Play</div>
                </div>
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;