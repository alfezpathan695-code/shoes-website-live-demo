import React from 'react';
import Icon from './Icon';

function HeroSection({ onExplore }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="sparkle">✦</span> GOOD FINDS. GREAT PRICES.</span>
        <h1>A little joy<br />in <span>every cart.</span></h1>
        <p>From your everyday essentials to those just-because treats — find more of what you love, for less.</p>
        <button className="primary-button" onClick={onExplore}>Explore the collection <Icon name="arrow" size={18} /></button>
        <div className="hero-trust"><span>♡</span> Loved by 2 lakh+ happy shoppers</div>
      </div>
      <div className="hero-art" aria-label="A curated collection of shopping finds">
        <div className="hero-image-main" />
        <div className="hero-image-small" />
        <div className="hero-sale"><strong>UP TO</strong><b>70%</b><span>OFF</span></div>
        <div className="hero-note">little things,<br /><em>big smiles</em> <span>♡</span></div>
        <div className="hero-flower">✿</div>
      </div>
      <div className="hero-pagination"><i className="selected" /><i /><i /></div>
    </section>
  );
}

export default HeroSection;
