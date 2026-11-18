import React from 'react';
import Icon from './Icon';

function WishlistBanner({ onOpenWishlist }) {
  return (
    <section className="favorites-banner" id="favorites">
      <span className="favorites-heart">♡</span>
      <div>
        <span className="eyebrow">YOUR LITTLE LOVE LIST</span>
        <h2>Keep the good ones close.</h2>
        <p>Tap the heart on anything you love and it’ll be right here for you.</p>
      </div>
      <button className="outline-button" onClick={onOpenWishlist}>My wishlist <Icon name="arrow" size={17} /></button>
    </section>
  );
}

export default WishlistBanner;
