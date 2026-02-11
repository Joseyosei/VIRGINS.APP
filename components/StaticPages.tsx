import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageView } from '../types';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => (
  <div className="pt-32 pb-24 bg-white min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">{title}</h1>
      <div className="prose prose-slate prose-lg max-w-none">
        {children}
      </div>
    </div>
  </div>
);

export const About: React.FC = () => (
  <PageLayout title="About Us">
    <p>
      Virgins was founded with a simple yet radical mission: to create a space where traditional values are celebrated, not compromised. 
      In a world of swipe culture and fleeting connections, we stand for something different.
    </p>
    <h3>Our Mission</h3>
    <p>
      To build families by connecting marriage-minded individuals who share a commitment to purity and biblical values.
    </p>
    <h3>Our Story</h3>
    <p>
      Started in 2024, Virgins began as a small community of friends who were tired of navigating modern dating apps that didn't respect their boundaries. 
      Today, we are a growing movement of thousands of men and women who believe that true love is worth waiting for.
    </p>
  </PageLayout>
);

export const Careers: React.FC = () => (
  <PageLayout title="Join Our Team">
    <p className="text-xl text-slate-600 mb-8">
      We are building the future of traditional dating. If you are passionate about faith, family, and technology, we want to hear from you.
    </p>
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Senior React Engineer</h3>
        <p className="text-slate-500">Remote • Full Time</p>
        <button className="mt-4 text-primary-600 font-medium hover:text-primary-700">View Details &rarr;</button>
      </div>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Community Safety Specialist</h3>
        <p className="text-slate-500">Austin, TX • Full Time</p>
        <button className="mt-4 text-primary-600 font-medium hover:text-primary-700">View Details &rarr;</button>
      </div>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Marketing Manager</h3>
        <p className="text-slate-500">Remote • Full Time</p>
        <button className="mt-4 text-primary-600 font-medium hover:text-primary-700">View Details &rarr;</button>
      </div>
    </div>
  </PageLayout>
);

export const Press: React.FC = () => (
  <PageLayout title="Press & Media">
    <p>
      For press inquiries, please contact <a href="mailto:press@virginsapp.com" className="text-primary-600">press@virginsapp.com</a>.
    </p>
    <h3 className="mt-8">Featured In</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6 opacity-50 grayscale">
       <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
       <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
       <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
       <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
    </div>
  </PageLayout>
);

export const Contact: React.FC = () => (
  <PageLayout title="Contact Us">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Get in Touch</h3>
        <p className="mb-6">Have questions? We're here to help you on your journey.</p>
        
        <div className="space-y-4">
          <div className="flex items-center text-slate-600">
            <Mail className="w-5 h-5 mr-3 text-primary-600" />
            <span>support@virginsapp.com</span>
          </div>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-5 h-5 mr-3 text-primary-600" />
            <span>123 Tradition Blvd, Austin, TX 78701</span>
          </div>
        </div>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Message</label>
          <textarea rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"></textarea>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Send Message</button>
      </form>
    </div>
  </PageLayout>
);

export const Privacy: React.FC = () => (
  <PageLayout title="Privacy Policy">
    <p>Last updated: June 1, 2024</p>
    <p>At Virgins, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from the App.</p>
    <h3>1. Personal Information We Collect</h3>
    <p>When you visit the App, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
    <h3>2. How We Use Your Personal Information</h3>
    <p>We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our App.</p>
    <p>For a full detailed policy, please contact legal.</p>
  </PageLayout>
);

export const Terms: React.FC = () => (
  <PageLayout title="Terms of Service">
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
    <h3>2. Code of Conduct</h3>
    <p>Users must adhere to the community guidelines. Any form of harassment, solicitation, or content that violates our traditional values standards will result in immediate termination.</p>
    <h3>3. Membership</h3>
    <p>Membership is intended for single individuals aged 18 and older who are legally free to marry.</p>
  </PageLayout>
);

export const Cookies: React.FC = () => (
  <PageLayout title="Cookie Policy">
    <p>We use cookies to improve your experience. By using our site, you agree to our use of cookies.</p>
    <h3>What are cookies?</h3>
    <p>Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
  </PageLayout>
);

export const Safety: React.FC = () => (
  <PageLayout title="Safety Center">
    <p className="text-xl">Your safety is our top priority. We employ strict vetting processes to ensure a safe environment.</p>
    <div className="mt-8 grid gap-8">
      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-red-800 font-bold mb-2">Reporting Suspicious Behavior</h3>
        <p className="text-red-700">If you encounter any behavior that violates our guidelines, please report it immediately via the in-app reporting tool or contact safety@virginsapp.com.</p>
      </div>
      <div>
        <h3>Safe Dating Tips</h3>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Keep conversations on the platform until you feel comfortable.</li>
          <li>Never send money to anyone you haven't met in person.</li>
          <li>Meet in public places for the first few dates.</li>
          <li>Tell a friend or family member where you are going.</li>
        </ul>
      </div>
    </div>
  </PageLayout>
);