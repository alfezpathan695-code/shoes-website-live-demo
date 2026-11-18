import React from 'react';
import Icon from './Icon';

function BenefitsStrip() {
  return (
    <section className="benefits" aria-label="Shopping benefits">
      <div className="benefit-item"><span className="benefit-icon lavender">↗</span><div><strong>Prices you'll love</strong><small>Little prices, big smiles</small></div></div>
      <div className="benefit-item"><span className="benefit-icon peach"><Icon name="truck" size={20} /></span><div><strong>Easy, free delivery</strong><small>On orders above ₹499</small></div></div>
      <div className="benefit-item"><span className="benefit-icon yellow">↺</span><div><strong>Hassle-free returns</strong><small>We make it easy</small></div></div>
      <div className="benefit-item"><span className="benefit-icon mint">♡</span><div><strong>Made for you</strong><small>Find your new favourites</small></div></div>
    </section>
  );
}

export default BenefitsStrip;
