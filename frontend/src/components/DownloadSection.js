import React from 'react';

export default function DownloadSection() {
  return (
    <div className="bg-navy-900 py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="relative w-full lg:w-1/2 h-[400px] sm:h-[500px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/20 rounded-full blur-[80px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-[35%] -translate-y-[55%] w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] bg-slate-900 rounded-[40px] border-[6px] border-slate-800 shadow-2xl rotate-[8deg] z-20 overflow-hidden ring-1 ring-white/10">
              <div className="w-full h-full bg-navy-900 relative flex flex-col">
                <div className="h-6 w-full flex justify-between px-4 items-center mt-1"><div className="w-8 h-2 bg-white/20 rounded-full" /><div className="w-4 h-2 bg-white/20 rounded-full" /></div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-gold-500 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,165,116,0.3)]">
                    <span className="text-3xl font-serif text-gold-500 font-bold">V</span>
                  </div>
                  <h3 className="text-white font-serif text-2xl font-bold mb-2 tracking-wide">VIRGINS</h3>
                  <p className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-8 border-b border-gold-500/30 pb-4">Love Worth Waiting For</p>
                  <div className="w-full space-y-3">
                    <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4 border border-white/10"><div className="w-4 h-4 rounded-full bg-green-500 mr-3" /><div className="w-24 h-2 bg-white/30 rounded" /></div>
                    <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4 border border-white/10"><div className="w-4 h-4 rounded-full bg-primary-500 mr-3" /><div className="w-32 h-2 bg-white/30 rounded" /></div>
                  </div>
                </div>
                <div className="p-6 pt-0"><div className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-navy-900 font-bold text-sm tracking-wide">GET STARTED</span></div></div>
                <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mb-2" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6 leading-tight tracking-tight">
              Download <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Our App Now</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">Experience the difference of a community dedicated to traditional values.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#" className="flex items-center bg-black border border-white/20 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all min-w-[180px] justify-center hover:border-white/40 shadow-lg">
                <div className="text-left"><div className="text-[10px] text-white uppercase tracking-wider font-medium leading-none mb-1">Download on the</div><div className="text-lg font-bold text-white leading-none">App Store</div></div>
              </a>
              <a href="#" className="flex items-center bg-black border border-white/20 rounded-xl px-5 py-3 hover:bg-slate-900 transition-all min-w-[180px] justify-center hover:border-white/40 shadow-lg">
                <div className="text-left"><div className="text-[10px] text-white uppercase tracking-wider font-medium leading-none mb-1">GET IT ON</div><div className="text-xl font-bold text-white leading-none">Google Play</div></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
