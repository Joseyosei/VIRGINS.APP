import React from 'react';
import { Mail, MapPin, Shield, Heart, Gem, Users, Anchor, BookOpen } from 'lucide-react';
import { PageView } from '../types';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children }) => (
  <div className="pt-32 pb-24 bg-white min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-slate-500 font-light italic">{subtitle}</p>}
        <div className="w-24 h-1 bg-gold-500 mx-auto mt-8"></div>
      </div>
      <div className="prose prose-slate prose-lg max-w-none">
        {children}
      </div>
    </div>
  </div>
);

export const About: React.FC = () => (
  <PageLayout 
    title="Our Covenant" 
    subtitle="From Casual Connections to Lifetime Commitments"
  >
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">The Crisis of Connection</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            In an era of infinite swiping and disposable dating, the sacred art of courtship has been lost. 
            Modern apps reward the superficial, encourage the fleeting, and penalize those who hold their standards high.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We believe that purity isn't just a choice—it's a path to a deeper, more profound intimacy that only 
            marriage can protect. <strong>Virgins</strong> was born from a desire to end the isolation felt by those
            who choose to wait.
          </p>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80" 
            className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" 
            alt="Traditional values"
          />
          <div className="absolute -bottom-6 -left-6 bg-gold-500 p-6 rounded-2xl shadow-xl hidden md:block">
            <Gem className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 -mx-4 px-4 sm:-mx-8 sm:px-8 py-20 mb-20 rounded-[3rem]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-navy-900 mb-12">The Three Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Authenticity</h3>
            <p className="text-sm text-slate-500">Rigorous verification ensures every member is real and committed.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold-600">
              <Anchor size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Stability</h3>
            <p className="text-sm text-slate-500">We match based on theological alignment and family vision.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-pink-600">
              <Heart size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Legacy</h3>
            <p className="text-sm text-slate-500">Built for marriages that last generations, not just dates that last a night.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-20">
      <h2 className="text-3xl font-serif font-bold text-navy-900 mb-8 text-center">A Note from Our Founders</h2>
      <div className="bg-navy-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <p className="text-xl italic font-light leading-relaxed mb-8 relative z-10">
          "We built Virgins because we were tired of being told our values were 'old fashioned.' We believe that 
          the old ways of courtship—intentional, respectful, and faith-centered—are actually the most innovative 
          solutions for the loneliness of the modern world. Every marriage started on this app is a victory 
          against the culture of the temporary."
        </p>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
          </div>
          <div>
            <p className="font-bold">Joseph & Mary K.</p>
            <p className="text-xs text-gold-400 uppercase tracking-widest font-bold">Founding Team</p>
          </div>
        </div>
      </div>
    </section>

    <section className="text-center py-12 border-t border-slate-100">
      <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Join the Movement</h2>
      <p className="text-slate-500 mb-8">Ready to build a life on the foundation of shared values?</p>
      <div className="flex justify-center gap-4">
        <button className="px-8 py-3 bg-navy-900 text-white rounded-full font-bold shadow-lg hover:bg-navy-800 transition-all">
          Register Today
        </button>
        <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-all">
          Read Our Pledge
        </button>
      </div>
    </section>
  </PageLayout>
);

export const Careers: React.FC = () => (
  <PageLayout title="Join Our Mission">
    <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
      We are building technology that honors God and strengthens families. If you believe code can be a ministry, join us.
    </p>
    <div className="grid gap-6">
      {[
        { title: 'Theological AI Engineer', loc: 'Remote', type: 'Full Time' },
        { title: 'Community Purity Advocate', loc: 'Austin, TX', type: 'Full Time' },
        { title: 'Tradition-First Designer', loc: 'Remote', type: 'Contract' },
      ].map((job, i) => (
        <div key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-gold-400 hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-gold-600 transition-colors">{job.title}</h3>
            <p className="text-slate-500 text-sm">{job.loc} • {job.type}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-navy-900 group-hover:text-white transition-all">
            <BookOpen size={18} />
          </button>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Press: React.FC = () => (
  <PageLayout title="In the News">
    <p className="text-center text-slate-500 mb-12">Changing the narrative on what it means to be 'modern'.</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 opacity-40 grayscale hover:grayscale-0 transition-all">
       <div className="h-20 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">FAITH TODAY</div>
       <div className="h-20 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">VOGUE</div>
       <div className="h-20 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">WSJ</div>
       <div className="h-20 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">CBN NEWS</div>
    </div>
  </PageLayout>
);

export const Contact: React.FC = () => (
  <PageLayout title="Say Hello">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Dedicated Support</h3>
          <p className="text-slate-500 leading-relaxed">Our team is available to help you navigate the app or discuss your account settings with the respect you deserve.</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600"><Mail size={20} /></div>
            <span className="font-medium">grace@virginsapp.com</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600"><MapPin size={20} /></div>
            <span className="font-medium">Legacy Square, Austin, TX</span>
          </div>
        </div>
      </div>
      
      <form className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-4">
        <input type="text" placeholder="Name" className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:ring-2 focus:ring-navy-900 outline-none" />
        <input type="email" placeholder="Email" className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:ring-2 focus:ring-navy-900 outline-none" />
        <textarea rows={4} placeholder="How can we help your journey?" className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:ring-2 focus:ring-navy-900 outline-none resize-none"></textarea>
        <button className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl shadow-lg hover:bg-navy-800 transition-all">Send Message</button>
      </form>
    </div>
  </PageLayout>
);

export const Privacy: React.FC = () => (
  <PageLayout title="Privacy Statement">
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-4">1. Data Stewardship</h3>
        <p className="text-slate-600">We do not sell your data. We treat your personal journey with the utmost sanctity. Your GPS coordinates are never stored exactly—we always apply a fuzzy logic offset for your protection.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-4">2. Verification Integrity</h3>
        <p className="text-slate-600">The face and ID data you provide during verification is encrypted and used only to ensure community safety. It is never visible to other members.</p>
      </section>
    </div>
  </PageLayout>
);

export const Terms: React.FC = () => (
  <PageLayout title="Code of Honor">
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Standard of Conduct</h3>
        <p className="text-slate-600">By joining Virgins, you pledge to respect the boundaries of other members. Harassment, pressure for intimacy, or dishonesty about marital status result in immediate and permanent account removal.</p>
      </section>
    </div>
  </PageLayout>
);

export const Cookies: React.FC = () => (
  <PageLayout title="Cookie Policy">
    <p className="text-slate-600">We use essential cookies to keep your session secure and to remember your preference for traditional values.</p>
  </PageLayout>
);

export const Safety: React.FC = () => (
  <PageLayout title="Safe Courtship Center">
    <div className="grid gap-8">
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
        <h3 className="text-red-900 font-bold text-xl mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" /> Zero Tolerance
        </h3>
        <p className="text-red-800">We employ a team of human moderators who monitor for "predatory" behavior. If anyone makes you feel uncomfortable, our 'Shield' feature notifies your trusted contacts immediately.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2">Public Meetings</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Always use our 'Date Planner' for first meetings at pre-verified public venues.</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2">Purity Support</h4>
            <p className="text-sm text-slate-500 leading-relaxed">If a match is pressuring you to cross boundaries, report them. We are here to support your commitment.</p>
         </div>
      </div>
    </div>
  </PageLayout>
);