import React from 'react';
import Icon from './Icon';
import MelaLogo from './MelaLogo';

function StoreHeader({ query, wishlistCount, cartCount, onSearch, onAccount, onWishlist, onBag }) {
  return (
    <>
      <div className="announcement">
        <span>✨ Your happy place for everyday finds</span>
        <span className="announcement-right">Free delivery on orders over ₹499 <span className="announcement-dot">•</span> Easy returns</span>
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mela home">
          <MelaLogo />
        </a>
        <div className="search-wrap">
          <Icon name="search" size={19} />
          <input
            aria-label="Search products"
            placeholder="Search for kurtas, skincare, home & more..."
            value={query}
            onChange={(event) => onSearch(event.target.value)}
          />
          {query && (
            <button className="clear-search" onClick={() => onSearch('')} aria-label="Clear search">
              <Icon name="close" size={17} />
            </button>
          )}
        </div>
        <div className="header-actions">
          <button className="header-action account-action" onClick={onAccount}><Icon name="user" /><span>Account</span></button>
          <button className="header-action wishlist-action" onClick={onWishlist}>
            <Icon name="heart" /><span>Wishlist</span>
            {wishlistCount > 0 && <b className="count-badge">{wishlistCount}</b>}
          </button>
          <button className="header-action bag-action" onClick={onBag}>
            <Icon name="bag" /><span>Bag</span>
            {cartCount > 0 && <b className="count-badge">{cartCount}</b>}
          </button>
        </div>
      </header>
    </>
  );
}

export default StoreHeader;
