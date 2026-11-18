import React from 'react';
import Icon from './Icon';

function ProductCard({ product, isFavorite, onToggleFavorite, onOpenDetails }) {
  return (
    <article className="product-card">
      <div className="product-image" style={{ backgroundColor: product.color }}>
        <button className="product-image-trigger" onClick={() => onOpenDetails(product)} aria-label={`View ${product.name} details`}>
          <img
            src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=640&q=80`}
            alt=""
            loading="lazy"
          />
        </button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(product.id);
          }}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3><button className="product-title" onClick={() => onOpenDetails(product)}>{product.name}</button></h3>
        <div className="rating"><span>★</span> {product.rating} <small>({product.reviews.toLocaleString('en-IN')})</small></div>
        <div className="price-row">
          <strong>₹{product.price.toLocaleString('en-IN')}</strong>
          <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>
          <span className="discount">{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
        </div>
        <button className="add-button" onClick={() => onOpenDetails(product)}><Icon name="plus" size={17} /> Choose options</button>
      </div>
    </article>
  );
}

export default ProductCard;
