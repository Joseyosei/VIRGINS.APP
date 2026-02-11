import React, { useState, useEffect } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState<string | null>(null);

  // Lock body scroll when a sub-page is open
  useEffect(() => {
    if (activePage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activePage]);

  const openPage = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const closePage = () => {
    setActivePage(null);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    closePage();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We'll be in touch.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a onClick={closePage} className="logo">
              <svg className="logo-icon" viewBox="0 0 512 512">
                <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E6D3"/><stop offset="50%" stopColor="#D4A574"/><stop offset="100%" stopColor="#B8860B"/></linearGradient></defs>
                <g transform="translate(256, 256)"><ellipse cx="-65" cy="0" rx="100" ry="100" fill="none" stroke="url(#g1)" strokeWidth="20"/><ellipse cx="65" cy="0" rx="100" ry="100" fill="none" stroke="url(#g1)" strokeWidth="20"/><g transform="translate(0, -100)"><polygon points="0,-30 26,0 0,30 -26,0" fill="url(#g1)"/></g></g>
              </svg>
              <span className="logo-text">VIRGINS</span>
            </a>
            <ul className="nav-links">
              <li><a onClick={(e) => scrollToSection(e, 'values')}>Our Values</a></li>
              <li><a onClick={(e) => scrollToSection(e, 'features')}>Features</a></li>
              <li><a onClick={(e) => scrollToSection(e, 'how')}>How It Works</a></li>
              <li><a onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a></li>
            </ul>
            <a onClick={(e) => scrollToSection(e, 'waitlist')} className="nav-cta">Join Waitlist</a>
            <button className="mobile-menu"><span></span><span></span><span></span></button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <svg className="hero-logo" viewBox="0 0 512 512">
            <defs>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E6D3"/><stop offset="50%" stopColor="#D4A574"/><stop offset="100%" stopColor="#B8860B"/></linearGradient>
              <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1A1A2E"/><stop offset="100%" stopColor="#16213E"/></linearGradient>
            </defs>
            <circle cx="256" cy="256" r="250" fill="url(#bg2)"/>
            <circle cx="256" cy="256" r="230" fill="none" stroke="url(#g2)" strokeWidth="1.5" opacity="0.3"/>
            <g transform="translate(256, 200)"><ellipse cx="-48" cy="0" rx="72" ry="72" fill="none" stroke="url(#g2)" strokeWidth="12"/><ellipse cx="48" cy="0" rx="72" ry="72" fill="none" stroke="url(#g2)" strokeWidth="12"/><g transform="translate(0, -72)"><polygon points="0,-20 18,0 0,20 -18,0" fill="url(#g2)"/></g></g>
            <text x="256" y="360" fontFamily="Georgia, serif" fontSize="44" fontWeight="bold" fill="url(#g2)" textAnchor="middle" letterSpacing="6">VIRGINS</text>
            <text x="256" y="395" fontFamily="Georgia, serif" fontSize="12" fill="url(#g2)" textAnchor="middle" letterSpacing="3" opacity="0.7">LOVE WORTH WAITING FOR</text>
          </svg>
          <h1 className="hero-tagline"><span className="gold-text">Love Worth Waiting For</span></h1>
          <p className="hero-subtitle">The dating app for people with traditional values. Find meaningful connections with those who share your commitment to waiting for the one.</p>
          <div className="hero-btns">
            <a onClick={(e) => scrollToSection(e, 'waitlist')} className="btn btn-primary">Join the Waitlist</a>
            <a onClick={(e) => scrollToSection(e, 'features')} className="btn btn-secondary">Explore Features</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Waitlist Signups</span></div>
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Verified Profiles</span></div>
            <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Meaningful Connections</span></div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section values" id="values">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Foundation</span>
            <h2 className="section-title"><span className="gold-text">Built on Traditional Values</span></h2>
          </div>
          <div className="values-grid">
            <div className="value-card"><div className="value-icon">💍</div><h3 className="value-title">Commitment First</h3><p className="value-desc">We believe in meaningful relationships built on commitment, respect, and shared values.</p></div>
            <div className="value-card"><div className="value-icon">🔒</div><h3 className="value-title">Verified Identity</h3><p className="value-desc">Every profile is verified through face recognition, ID verification, and voice authentication.</p></div>
            <div className="value-card"><div className="value-icon">💎</div><h3 className="value-title">Quality Over Quantity</h3><p className="value-desc">No endless swiping. We focus on meaningful matches based on shared values and goals.</p></div>
            <div className="value-card"><div className="value-icon">👁️</div><h3 className="value-title">Full Transparency</h3><p className="value-desc">See who likes you without paying. Both men and women deserve to know who's interested.</p></div>
            <div className="value-card"><div className="value-icon">🤝</div><h3 className="value-title">Respectful Community</h3><p className="value-desc">A safe space for those who share traditional values about dating and marriage.</p></div>
            <div className="value-card"><div className="value-icon">🎯</div><h3 className="value-title">Purpose-Driven Dating</h3><p className="value-desc">For those seeking marriage, not casual dating. Every feature supports this goal.</p></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title"><span className="gold-text">Features Designed for You</span></h2>
          </div>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">👤</span><h3 className="feature-title">Values-Based Profiles</h3></div><p className="feature-desc">Showcase your beliefs and what matters most. Find matches who truly align with your values.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">💬</span><h3 className="feature-title">Unlimited Messaging</h3></div><p className="feature-desc">Connect freely with your matches and people who like you. No artificial barriers.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">❤️</span><h3 className="feature-title">See Who Likes You</h3></div><p className="feature-desc">Both men and women can see who's interested - completely free. No paywall.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">📹</span><h3 className="feature-title">Video Calls</h3></div><p className="feature-desc">Get to know your match face-to-face before meeting in person.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">📍</span><h3 className="feature-title">Meet in Person</h3></div><p className="feature-desc">Plan real dates with in-app date planning features and safety check-ins.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">✅</span><h3 className="feature-title">Multi-Layer Verification</h3></div><p className="feature-desc">Face scan, ID verification, and voice recognition for authentic profiles.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">🚀</span><h3 className="feature-title">Profile Boosts</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">Get more visibility and stand out to potential matches with daily boosts.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">🤖</span><h3 className="feature-title">AI Date Planner</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">Smart suggestions for restaurants, venues, and date ideas personalized to you.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">💐</span><h3 className="feature-title">Send Flowers</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">Express your interest with real flower deliveries to make a lasting impression.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">🌍</span><h3 className="feature-title">Travel Mode</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">Find matches in your travel destination before you arrive.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">👻</span><h3 className="feature-title">Incognito Mode</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">Browse profiles privately. Only visible to people you like.</p></div>
            <div className="feature-card"><div className="feature-header"><span className="feature-icon">⭐</span><h3 className="feature-title">Super Swipes</h3><span className="feature-badge">ULTIMATE</span></div><p className="feature-desc">200 super swipes and 500 compliments monthly for meaningful first impressions.</p></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section" id="how">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Getting Started</span>
            <h2 className="section-title"><span className="gold-text">How It Works</span></h2>
          </div>
          <div className="steps">
            <div className="step"><div className="step-num">1</div><div className="step-content"><h3>Create Your Profile</h3><p>Sign up and build your profile showcasing your values and what you're looking for in a life partner.</p></div></div>
            <div className="step"><div className="step-num">2</div><div className="step-content"><h3>Get Verified</h3><p>Complete our verification with face scan, ID verification, and voice recognition for authentic connections.</p></div></div>
            <div className="step"><div className="step-num">3</div><div className="step-content"><h3>Discover Matches</h3><p>Browse profiles of people who share your values. See who likes you and start meaningful conversations.</p></div></div>
            <div className="step"><div className="step-num">4</div><div className="step-content"><h3>Connect & Meet</h3><p>Video call to get to know each other, then plan your first date. Good things are worth waiting for.</p></div></div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Simple Pricing</span>
            <h2 className="section-title"><span className="gold-text">Choose Your Plan</span></h2>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-name">Free</h3>
              <div className="pricing-price">$0<span>/month</span></div>
              <p className="pricing-desc">Everything you need to find love</p>
              <ul className="pricing-list">
                <li>Create verified profile</li>
                <li>See who likes you</li>
                <li>Unlimited messaging</li>
                <li>Video calls with matches</li>
                <li>Basic matching algorithm</li>
                <li>Plan dates in-app</li>
              </ul>
              <a onClick={(e) => scrollToSection(e, 'waitlist')} className="btn btn-secondary">Join Waitlist</a>
            </div>
            <div className="pricing-card featured">
              <h3 className="pricing-name">Ultimate</h3>
              <div className="pricing-price">$29<span>/month</span></div>
              <p className="pricing-desc">Premium features for serious daters</p>
              <ul className="pricing-list">
                <li>Everything in Free</li>
                <li>Daily profile boosts</li>
                <li>AI Date Planner chatbot</li>
                <li>Send real flowers</li>
                <li>Travel mode</li>
                <li>Incognito browsing</li>
                <li>200 super swipes/month</li>
                <li>500 compliments/month</li>
                <li>Expert dating insights</li>
                <li>Priority support</li>
              </ul>
              <a onClick={(e) => scrollToSection(e, 'waitlist')} className="btn btn-primary">Join Waitlist</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" id="waitlist">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title"><span className="gold-text">Be First to Find Your Forever Person</span></h2>
            <p className="cta-subtitle">Join our waitlist for early access. Founding members get 3 months of Ultimate free.</p>
            <form className="waitlist-form" onSubmit={handleFormSubmit}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Join Waitlist</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a onClick={closePage} className="logo">
                <svg className="logo-icon" viewBox="0 0 512 512" style={{width:'32px', height:'32px'}}>
                  <defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E6D3"/><stop offset="50%" stopColor="#D4A574"/><stop offset="100%" stopColor="#B8860B"/></linearGradient></defs>
                  <g transform="translate(256, 256)"><ellipse cx="-65" cy="0" rx="100" ry="100" fill="none" stroke="url(#g3)" strokeWidth="20"/><ellipse cx="65" cy="0" rx="100" ry="100" fill="none" stroke="url(#g3)" strokeWidth="20"/><g transform="translate(0, -100)"><polygon points="0,-30 26,0 0,30 -26,0" fill="url(#g3)"/></g></g>
                </svg>
                <span className="logo-text">VIRGINS</span>
              </a>
              <p>The dating app for people with traditional values who believe in waiting for the one.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <ul>
                <li><a onClick={() => openPage('features-page')}>Features</a></li>
                <li><a onClick={() => openPage('pricing-page')}>Pricing</a></li>
                <li><a onClick={() => openPage('how-page')}>How It Works</a></li>
                <li><a onClick={(e) => scrollToSection(e, 'waitlist')}>Join Waitlist</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a onClick={() => openPage('about-page')}>About Us</a></li>
                <li><a onClick={() => openPage('careers-page')}>Careers</a></li>
                <li><a onClick={() => openPage('press-page')}>Press</a></li>
                <li><a onClick={() => openPage('contact-page')}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a onClick={() => openPage('privacy-page')}>Privacy Policy</a></li>
                <li><a onClick={() => openPage('terms-page')}>Terms of Service</a></li>
                <li><a onClick={() => openPage('cookies-page')}>Cookie Policy</a></li>
                <li><a onClick={() => openPage('safety-page')}>Safety</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Virgins Dating App. All rights reserved. Love worth waiting for.</p>
          </div>
        </div>
      </footer>

      {/* OVERLAY PAGES */}

      {/* ABOUT PAGE */}
      <div className={`page-overlay ${activePage === 'about-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">About Us</span></h1>
            <p className="page-subtitle">We're on a mission to help people with traditional values find meaningful, lasting love.</p>
          </header>
          <section className="content-section">
            <h2>Our Story</h2>
            <p>Virgins was founded in 2024 with a simple belief: that people who share traditional values about relationships and marriage deserve a dedicated space to find their life partner.</p>
            <p>In a world of endless swiping and casual dating apps, we noticed a gap. Millions of people who believe in waiting for the right person, who value commitment over convenience, and who seek marriage over fleeting connections had no platform that truly understood them.</p>
            <p>That's why we built Virgins – a dating app designed from the ground up for people with traditional values. Every feature, every algorithm, every aspect of our platform is designed to facilitate meaningful connections that lead to lasting marriages.</p>
          </section>
          <section className="content-section">
            <h2>Our Mission</h2>
            <p>To create a safe, respectful community where people with traditional values can find their life partner. We believe that love is worth waiting for, and we're here to help you find it.</p>
          </section>
          <section className="content-section">
            <h2>Our Values</h2>
            <div className="card-grid">
              <div className="card"><h3>💍 Commitment</h3><p>We believe in relationships built on deep commitment and shared values.</p></div>
              <div className="card"><h3>🔒 Trust</h3><p>Every profile is verified. We maintain the highest standards of authenticity.</p></div>
              <div className="card"><h3>💎 Quality</h3><p>We prioritize meaningful matches over quantity. No endless swiping.</p></div>
              <div className="card"><h3>🤝 Respect</h3><p>Our community is built on mutual respect, dignity, and shared values.</p></div>
            </div>
          </section>
          <section className="content-section" style={{textAlign:'center'}}>
            <a onClick={(e) => {closePage(); scrollToSection(e, 'waitlist');}} className="btn btn-primary">Join the Waitlist</a>
          </section>
        </div>
      </div>

      {/* CAREERS PAGE */}
      <div className={`page-overlay ${activePage === 'careers-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Careers</span></h1>
            <p className="page-subtitle">Join our mission to help people find meaningful, lasting love.</p>
          </header>
          <section className="content-section">
            <h2>Why Work at Virgins?</h2>
            <div className="card-grid">
              <div className="card"><h3>🚀 Impact</h3><p>Help millions find lasting love and meaningful relationships.</p></div>
              <div className="card"><h3>🌍 Remote-First</h3><p>Work from anywhere in the world with flexible hours.</p></div>
              <div className="card"><h3>📈 Growth</h3><p>Join an early-stage startup with unlimited growth potential.</p></div>
              <div className="card"><h3>💰 Competitive</h3><p>Competitive salary, equity, and comprehensive benefits.</p></div>
            </div>
          </section>
          <section className="content-section">
            <h2>Open Positions</h2>
            <div className="job-listing"><h3 className="job-title">Senior iOS Developer</h3><p className="job-meta">Remote • Full-time • Engineering</p><p className="job-desc">Build and maintain our iOS app using Swift and SwiftUI. 5+ years experience required.</p><a href="mailto:careers@virgins.app" className="btn btn-secondary">Apply Now</a></div>
            <div className="job-listing"><h3 className="job-title">Senior Android Developer</h3><p className="job-meta">Remote • Full-time • Engineering</p><p className="job-desc">Build and maintain our Android app using Kotlin and Jetpack Compose.</p><a href="mailto:careers@virgins.app" className="btn btn-secondary">Apply Now</a></div>
            <div className="job-listing"><h3 className="job-title">Backend Engineer</h3><p className="job-meta">Remote • Full-time • Engineering</p><p className="job-desc">Design and implement scalable backend services with Node.js and PostgreSQL.</p><a href="mailto:careers@virgins.app" className="btn btn-secondary">Apply Now</a></div>
            <div className="job-listing"><h3 className="job-title">Product Designer</h3><p className="job-meta">Remote • Full-time • Design</p><p className="job-desc">Create beautiful, intuitive user experiences. Proficiency in Figma required.</p><a href="mailto:careers@virgins.app" className="btn btn-secondary">Apply Now</a></div>
          </section>
          <section className="content-section" style={{textAlign:'center'}}>
            <h2>Don't See Your Role?</h2>
            <p>We're always looking for talented people who share our values.</p><br />
            <a href="mailto:careers@virgins.app" className="btn btn-primary">Send Your Resume</a>
          </section>
        </div>
      </div>

      {/* PRESS PAGE */}
      <div className={`page-overlay ${activePage === 'press-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Press</span></h1>
            <p className="page-subtitle">Media resources and press information for Virgins Dating App.</p>
          </header>
          <section className="content-section">
            <h2>About Virgins</h2>
            <p>Virgins is a dating app designed for people with traditional values who believe in waiting for the right person. Founded in 2024, our mission is to help people find meaningful, lasting love through verified profiles and values-based matching.</p>
            <p><strong>Key Facts:</strong></p>
            <ul>
              <li>Founded: 2024</li>
              <li>Headquarters: Austin, Texas</li>
              <li>Mission: Helping people with traditional values find lasting love</li>
              <li>Waitlist: 50,000+ signups</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>Press Kit</h2>
            <div className="card-grid">
              <div className="card"><h3>📁 Brand Assets</h3><p>Logos, icons, and brand guidelines.</p><br /><a href="mailto:press@virgins.app" className="btn btn-secondary">Request Access</a></div>
              <div className="card"><h3>📱 Screenshots</h3><p>High-resolution app screenshots.</p><br /><a href="mailto:press@virgins.app" className="btn btn-secondary">Request Access</a></div>
            </div>
          </section>
          <section className="content-section">
            <h2>Media Contact</h2>
            <p><strong>Email:</strong> <a href="mailto:press@virgins.app">press@virgins.app</a></p>
            <p>We typically respond within 24 hours.</p>
          </section>
        </div>
      </div>

      {/* CONTACT PAGE */}
      <div className={`page-overlay ${activePage === 'contact-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Contact Us</span></h1>
            <p className="page-subtitle">We'd love to hear from you. Get in touch with our team.</p>
          </header>
          <section className="content-section">
            <div className="card-grid">
              <div className="card"><h3>📧 General</h3><p><a href="mailto:hello@virgins.app">hello@virgins.app</a></p></div>
              <div className="card"><h3>🎯 Support</h3><p><a href="mailto:support@virgins.app">support@virgins.app</a></p></div>
              <div className="card"><h3>📰 Press</h3><p><a href="mailto:press@virgins.app">press@virgins.app</a></p></div>
              <div className="card"><h3>💼 Careers</h3><p><a href="mailto:careers@virgins.app">careers@virgins.app</a></p></div>
            </div>
          </section>
          <section className="content-section">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-group"><label>Your Name</label><input type="text" required placeholder="Enter your name" /></div>
              <div className="form-group"><label>Email Address</label><input type="email" required placeholder="Enter your email" /></div>
              <div className="form-group"><label>Subject</label><select required><option value="">Select a topic</option><option>General Inquiry</option><option>Support Request</option><option>Partnership</option><option>Feedback</option></select></div>
              <div className="form-group"><label>Message</label><textarea required placeholder="How can we help you?"></textarea></div>
              <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Send Message</button>
            </form>
          </section>
        </div>
      </div>

      {/* PRIVACY PAGE */}
      <div className={`page-overlay ${activePage === 'privacy-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Privacy Policy</span></h1>
            <p className="page-subtitle">How we collect, use, and protect your information.</p>
            <p className="page-meta">Last updated: January 15, 2026</p>
          </header>
          <section className="content-section">
            <h2>1. Introduction</h2>
            <p>Virgins Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.</p>
          </section>
          <section className="content-section">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Date of birth and gender</li>
              <li>Profile photos and bio information</li>
              <li>Location data (with your permission)</li>
              <li>Identity verification documents</li>
              <li>Payment information (processed securely by third parties)</li>
            </ul>
            <h3>Usage Information</h3>
            <ul>
              <li>Device information (type, OS, unique identifiers)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Usage patterns and preferences</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>Create and manage your account</li>
              <li>Match you with compatible users</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Provide customer support</li>
              <li>Send you updates and promotional communications</li>
              <li>Improve and personalize the Service</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>4. Your Rights</h2>
            <p>You may have the right to access, correct, delete your data, object to processing, and data portability. Contact us at <a href="mailto:privacy@virgins.app">privacy@virgins.app</a>.</p>
          </section>
          <section className="content-section">
            <h2>5. Contact Us</h2>
            <p>Email: <a href="mailto:privacy@virgins.app">privacy@virgins.app</a><br />Address: Virgins Inc., Austin, Texas, United States</p>
          </section>
        </div>
      </div>

      {/* TERMS PAGE */}
      <div className={`page-overlay ${activePage === 'terms-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Terms of Service</span></h1>
            <p className="page-subtitle">Please read these terms carefully before using our service.</p>
            <p className="page-meta">Last updated: January 15, 2026</p>
          </header>
          <section className="content-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the Virgins mobile application and website, you agree to be bound by these Terms of Service.</p>
          </section>
          <section className="content-section">
            <h2>2. Eligibility</h2>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Be legally able to enter into a binding contract</li>
              <li>Not be prohibited from using the Service under applicable law</li>
              <li>Complete our identity verification process</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>3. Community Guidelines</h2>
            <p>Users must treat all users with respect, use the Service only for finding relationships, provide truthful information, and respect others' privacy.</p>
            <p>Users must NOT harass others, post inappropriate content, use the Service commercially, create fake profiles, or share others' information without consent.</p>
          </section>
          <section className="content-section">
            <h2>4. Contact</h2>
            <p>For questions: <a href="mailto:legal@virgins.app">legal@virgins.app</a></p>
          </section>
        </div>
      </div>

      {/* COOKIES PAGE */}
      <div className={`page-overlay ${activePage === 'cookies-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Cookie Policy</span></h1>
            <p className="page-subtitle">How we use cookies and similar technologies.</p>
            <p className="page-meta">Last updated: January 15, 2026</p>
          </header>
          <section className="content-section">
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us provide you with a better experience.</p>
          </section>
          <section className="content-section">
            <h2>Types of Cookies We Use</h2>
            <ul>
              <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
              <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization.</li>
              <li><strong>Marketing Cookies:</strong> May be set by advertising partners.</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>Managing Cookies</h2>
            <p>You can control cookies through browser settings. Disabling certain cookies may affect functionality.</p>
          </section>
          <section className="content-section">
            <h2>Contact Us</h2>
            <p>Questions? <a href="mailto:privacy@virgins.app">privacy@virgins.app</a></p>
          </section>
        </div>
      </div>

      {/* SAFETY PAGE */}
      <div className={`page-overlay ${activePage === 'safety-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Safety Center</span></h1>
            <p className="page-subtitle">Your safety is our top priority.</p>
          </header>
          <section className="content-section">
            <h2>How We Keep You Safe</h2>
            <div className="card-grid">
              <div className="card"><h3>🔐 Identity Verification</h3><p>Face scan, ID verification, and voice recognition.</p></div>
              <div className="card"><h3>🛡️ Profile Review</h3><p>Our team reviews profiles to ensure guidelines compliance.</p></div>
              <div className="card"><h3>🚨 Report System</h3><p>Easy-to-use reporting tools for inappropriate behavior.</p></div>
              <div className="card"><h3>🚫 Block Feature</h3><p>Block any user at any time.</p></div>
            </div>
          </section>
          <section className="content-section">
            <h2>Safety Tips</h2>
            <h3>Before You Meet</h3>
            <ul>
              <li>Get to know someone through in-app messaging first</li>
              <li>Use video call to verify the person</li>
              <li>Never send money to someone you haven't met</li>
            </ul>
            <h3>When You Meet</h3>
            <ul>
              <li>Meet in a public place</li>
              <li>Tell a friend where you're going</li>
              <li>Arrange your own transportation</li>
            </ul>
          </section>
          <section className="content-section">
            <h2>Emergency Resources</h2>
            <div className="card-grid">
              <div className="card"><h3>🆘 Emergency</h3><p>Call 911 for immediate danger</p></div>
              <div className="card"><h3>📞 Domestic Violence</h3><p>1-800-799-7233 (US)</p></div>
              <div className="card"><h3>💬 Crisis Text</h3><p>Text HOME to 741741</p></div>
            </div>
          </section>
          <section className="content-section" style={{textAlign:'center'}}>
            <a href="mailto:safety@virgins.app" className="btn btn-primary">Contact Safety Team</a>
          </section>
        </div>
      </div>

      {/* FEATURES PAGE */}
      <div className={`page-overlay ${activePage === 'features-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Features</span></h1>
            <p className="page-subtitle">Everything you need to find meaningful, lasting love.</p>
          </header>
          <section className="content-section">
            <h2>Free Features</h2>
            <div className="card-grid">
              <div className="card"><h3>👤 Values-Based Profiles</h3><p>Showcase your beliefs and find aligned matches.</p></div>
              <div className="card"><h3>❤️ See Who Likes You</h3><p>Free for both men and women - no paywall.</p></div>
              <div className="card"><h3>💬 Unlimited Messaging</h3><p>Connect freely with no limits.</p></div>
              <div className="card"><h3>📹 Video Calls</h3><p>Meet face-to-face before meeting in person.</p></div>
              <div className="card"><h3>✅ Verification</h3><p>Multi-layer identity verification.</p></div>
              <div className="card"><h3>📍 Date Planning</h3><p>Plan dates with safety check-ins.</p></div>
            </div>
          </section>
          <section className="content-section">
            <h2>Ultimate Features</h2>
            <div className="card-grid">
              <div className="card"><h3>🚀 Daily Boosts</h3><p>Get more visibility every day.</p></div>
              <div className="card"><h3>🤖 AI Date Planner</h3><p>Personalized date suggestions.</p></div>
              <div className="card"><h3>💐 Send Flowers</h3><p>Real flower deliveries.</p></div>
              <div className="card"><h3>🌍 Travel Mode</h3><p>Find matches at your destination.</p></div>
              <div className="card"><h3>👻 Incognito</h3><p>Browse privately.</p></div>
              <div className="card"><h3>⭐ Super Swipes</h3><p>200/month + 500 compliments.</p></div>
            </div>
          </section>
          <section className="content-section" style={{textAlign:'center'}}>
            <a onClick={(e) => {closePage(); scrollToSection(e, 'waitlist');}} className="btn btn-primary">Join the Waitlist</a>
          </section>
        </div>
      </div>

      {/* PRICING PAGE */}
      <div className={`page-overlay ${activePage === 'pricing-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">Pricing</span></h1>
            <p className="page-subtitle">Simple, transparent pricing.</p>
          </header>
          <div className="pricing-grid" style={{marginTop:'40px'}}>
            <div className="pricing-card">
              <h3 className="pricing-name">Free</h3>
              <div className="pricing-price">$0<span>/month</span></div>
              <p className="pricing-desc">Everything you need to find love</p>
              <ul className="pricing-list">
                <li>Create verified profile</li>
                <li>See who likes you</li>
                <li>Unlimited messaging</li>
                <li>Video calls with matches</li>
                <li>Basic matching algorithm</li>
                <li>Plan dates in-app</li>
              </ul>
              <a onClick={(e) => {closePage(); scrollToSection(e, 'waitlist');}} className="btn btn-secondary">Join Waitlist</a>
            </div>
            <div className="pricing-card featured">
              <h3 className="pricing-name">Ultimate</h3>
              <div className="pricing-price">$29<span>/month</span></div>
              <p className="pricing-desc">Premium features for serious daters</p>
              <ul className="pricing-list">
                <li>Everything in Free</li>
                <li>Daily boosts</li>
                <li>AI Date Planner</li>
                <li>Send flowers</li>
                <li>Travel mode</li>
                <li>Incognito</li>
                <li>200 super swipes</li>
                <li>Priority support</li>
              </ul>
              <a onClick={(e) => {closePage(); scrollToSection(e, 'waitlist');}} className="btn btn-primary">Join Waitlist</a>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS PAGE */}
      <div className={`page-overlay ${activePage === 'how-page' ? 'active' : ''}`}>
        <button className="back-btn" onClick={closePage}>← Back to Home</button>
        <div className="page-content">
          <header className="page-header">
            <h1 className="page-title"><span className="gold-text">How It Works</span></h1>
            <p className="page-subtitle">Finding meaningful love is simple with Virgins.</p>
          </header>
          <div className="steps" style={{marginTop:'40px'}}>
            <div className="step"><div className="step-num">1</div><div className="step-content"><h3>Download & Sign Up</h3><p>Create your account in less than 2 minutes.</p></div></div>
            <div className="step"><div className="step-num">2</div><div className="step-content"><h3>Build Your Profile</h3><p>Showcase your values, beliefs, interests, and goals.</p></div></div>
            <div className="step"><div className="step-num">3</div><div className="step-content"><h3>Get Verified</h3><p>Complete face scan, ID verification, and voice recognition.</p></div></div>
            <div className="step"><div className="step-num">4</div><div className="step-content"><h3>Discover Matches</h3><p>Browse compatible profiles and see who likes you for free.</p></div></div>
            <div className="step"><div className="step-num">5</div><div className="step-content"><h3>Start Conversations</h3><p>Unlimited messaging with your matches.</p></div></div>
            <div className="step"><div className="step-num">6</div><div className="step-content"><h3>Video Call</h3><p>See and hear your match before meeting.</p></div></div>
            <div className="step"><div className="step-num">7</div><div className="step-content"><h3>Meet in Person</h3><p>Plan your first date with safety features.</p></div></div>
            <div className="step"><div className="step-num">💍</div><div className="step-content"><h3>Find Your Forever Person</h3><p>Build a relationship the right way.</p></div></div>
          </div>
          <section className="content-section" style={{textAlign:'center', marginTop:'40px'}}>
            <a onClick={(e) => {closePage(); scrollToSection(e, 'waitlist');}} className="btn btn-primary">Join the Waitlist</a>
          </section>
        </div>
      </div>
    </div>
  );
}