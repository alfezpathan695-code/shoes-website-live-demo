import React from 'react';
import MelaLogo from './MelaLogo';

const shopLinks = ['Women', 'Men', 'Girls', 'Boys', 'Kids', 'Home', 'Beauty', 'Accessories', 'Electronics', 'Kitchen', 'Shoes'];

function SiteFooter({ onSelectCategory }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <a className="brand footer-brand" href="#top">
            <MelaLogo />
          </a>
          <p>Everyday finds, little prices, and a lot more reasons to smile. Discover something lovely for everyone at home.</p>
          <span className="footer-made">Made with <span>♡</span> in India</span>
        </div>
        <nav className="footer-column" aria-label="Shop categories">
          <h2>Shop by category</h2>
          <div className="footer-category-links">
            {shopLinks.map((category) => (
              <button key={category} onClick={() => onSelectCategory(category)}>{category}</button>
            ))}
          </div>
        </nav>
        <div className="footer-column footer-promise">
          <h2>The Mela promise</h2>
          <p>Free delivery on orders above ₹499</p>
          <p>Easy returns on eligible items</p>
          <p>Secure checkout integration coming soon</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Mela Marketplace. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default SiteFooter;
