import React from 'react';
import Icon from './Icon';
import ProductCard from './ProductCard';

function ProductSection({
  products,
  category,
  query,
  sort,
  wishlistOnly,
  wishlist,
  onSort,
  onToggleFavorite,
  onOpenDetails,
  onReset,
}) {
  const heading = wishlistOnly
    ? 'Your wishlist'
    : query
      ? `Results for "${query}"`
      : category === 'All'
        ? 'Little things you’ll love'
        : `${category} finds`;

  return (
    <section className="products-section" id="shop">
      <div className="section-heading products-heading">
        <div>
          <span className="eyebrow">{wishlistOnly ? 'YOUR SAVED FINDS' : query ? 'YOUR SEARCH RESULTS' : 'HANDPICKED FOR YOU'}</span>
          <h2>{heading}</h2>
          <p className="result-count">{products.length} lovely finds to explore</p>
        </div>
        <label className="sort-control">
          Sort by
          <select value={sort} onChange={(event) => onSort(event.target.value)} aria-label="Sort products">
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={wishlist.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <span>⌕</span>
          <h3>No finds just yet</h3>
          <p>Try a different search or explore all our lovely categories.</p>
          <button className="primary-button" onClick={onReset}>See all products <Icon name="arrow" size={17} /></button>
        </div>
      )}
    </section>
  );
}

export default ProductSection;
