import React from 'react';
import { Mail, MapPin, Briefcase, Shield, Heart, Users, Award, ChevronRight, Lock, Eye, ArrowRight } from 'lucide-react';

function PageLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-black text-navy-900 mb-4 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xl text-slate-500 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export const About = () => (
  <PageLayout title="About Virgins" subtitle="The platform that believes love is worth waiting for.">
    <div className="prose prose-lg max-w-none text-slate-600">
      <p className="text-xl leading-relaxed mb-8">Virgins was founded with a radical idea: that there's a massive community of people who want to date with the intention of marriage, who value purity, and who are tired of a culture that pressures them to compromise.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        {[{ icon: <Heart className="w-8 h-8 text-gold-600" />, stat: '50,000+', label: 'Active Members' }, { icon: <Award className="w-8 h-8 text-gold-600" />, stat: '2,500+', label: 'Marriages' }, { icon: <Shield className="w-8 h-8 text-gold-600" />, stat: '99.9%', label: 'Verified Profiles' }].map((s, i) => (
          <div key={i} className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="flex justify-center mb-3">{s.icon}</div>
            <div className="text-3xl font-black text-navy-900">{s.stat}</div>
            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </PageLayout>
);

export const Careers = () => (
  <PageLayout title="Join Our Mission" subtitle="Help us build the future of intentional dating.">
    <div className="space-y-6">
      {[
        { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote' },
        { title: 'AI/ML Engineer', dept: 'Engineering', location: 'Austin, TX' },
        { title: 'Community Manager', dept: 'Operations', location: 'Remote' },
        { title: 'Product Designer', dept: 'Design', location: 'Remote' },
      ].map((job, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-gold-300 transition-all cursor-pointer flex items-center justify-between group">
          <div>
            <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-gold-600 transition-colors" />
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Press = () => (
  <PageLayout title="Press & Media" subtitle="Virgins in the news.">
    <div className="space-y-8">
      {[
        { source: 'The Christian Post', title: 'New Dating App Champions Purity in Modern Age', date: 'Dec 2024' },
        { source: 'TechCrunch', title: 'Virgins Raises $5M Series A for Faith-Based Dating', date: 'Nov 2024' },
        { source: 'Forbes', title: 'The Counter-Cultural Movement in Online Dating', date: 'Oct 2024' },
      ].map((article, i) => (
        <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">{article.source}</div>
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">{article.title}</h3>
          <p className="text-sm text-slate-500">{article.date}</p>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Contact = () => (
  <PageLayout title="Contact Us" subtitle="We'd love to hear from you.">
    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Name</label><input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none" placeholder="Your name" /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Email</label><input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none" placeholder="you@email.com" /></div>
      </div>
      <div className="mb-8"><label className="block text-sm font-bold text-slate-700 mb-2">Message</label><textarea rows={5} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none resize-none" placeholder="How can we help?" /></div>
      <button className="px-8 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all">Send Message</button>
    </div>
  </PageLayout>
);

const LegalPage = ({ title, content }) => (
  <PageLayout title={title}>
    <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
      {content.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">{section.heading}</h2>
          <p>{section.text}</p>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Privacy = () => <LegalPage title="Privacy Policy" content={[
  { heading: 'Information We Collect', text: 'We collect information you provide during registration, profile creation, and use of our services. This includes personal details, faith preferences, and communication data.' },
  { heading: 'How We Use Your Data', text: 'Your data is used to provide matching services, improve our algorithm, and maintain community safety. We never sell your personal information to third parties.' },
  { heading: 'Data Security', text: 'We employ industry-standard encryption and security measures to protect your data. All communications are encrypted end-to-end.' },
]} />;

export const Terms = () => <LegalPage title="Terms of Service" content={[
  { heading: 'Eligibility', text: 'You must be at least 18 years old to use Virgins. By creating an account, you confirm that you are of legal age and agree to abide by our community guidelines.' },
  { heading: 'Community Standards', text: 'All members must respect our core values of purity, intentional dating, and traditional courtship. Harassment, explicit content, or deceptive behavior will result in immediate account termination.' },
  { heading: 'Account Responsibility', text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
]} />;

export const Cookies = () => <LegalPage title="Cookie Policy" content={[
  { heading: 'What Are Cookies', text: 'Cookies are small text files stored on your device that help us provide and improve our services.' },
  { heading: 'How We Use Cookies', text: 'We use essential cookies for authentication and security, and optional cookies for analytics and personalization.' },
]} />;

export const Safety = () => <LegalPage title="Safety Center" content={[
  { heading: 'Our Commitment', text: 'Your safety is our top priority. Every profile undergoes review, and we provide tools to report concerning behavior.' },
  { heading: 'Safety Tips', text: 'Always meet in public places for first dates. Tell a trusted friend or family member about your plans. Trust your instincts.' },
  { heading: 'Reporting', text: 'If you experience harassment or feel unsafe, use the in-app report feature or contact our safety team directly at safety@virgins.com.' },
]} />;
