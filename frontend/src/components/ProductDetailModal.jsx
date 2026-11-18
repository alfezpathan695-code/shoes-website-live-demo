import React, { useEffect, useState } from 'react';
import Icon from './Icon';

function getOptions(product) {
  if (Array.isArray(product.variants) && product.variants.length) {
    return {
      label: `Choose ${product.variantLabel || 'size'}`,
      values: product.variants,
    };
  }

  if (product.category === 'Shoes' || /shoe|sneaker|slipper|sandal|loafer|boot/i.test(product.name)) {
    return { label: 'Choose shoe size', values: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] };
  }

  const clothingSizes = {
    Women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Men: ['S', 'M', 'L', 'XL', 'XXL'],
    Girls: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    Boys: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
  };

  if (clothingSizes[product.category]) {
    return { label: 'Choose size', values: clothingSizes[product.category] };
  }

  if (product.category === 'Kids' && /onesie|romper|clothing|co-ord|dress|socks|booties/i.test(product.name)) {
    return { label: 'Choose size', values: ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years'] };
  }

  return null;
}

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [selectedOption, setSelectedOption] = useState('');
  const options = getOptions(product);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  function addProduct() {
    if (options && !selectedOption) return;
    onAddToCart(product, selectedOption || 'Standard');
  }

  return (
    <div className="detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="detail-close" onClick={onClose} aria-label="Close product details"><Icon name="close" /></button>
        <div className="detail-image">
          <img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=85`} alt={product.name} />
          {product.badge && <span className="product-badge">{product.badge}</span>}
        </div>
        <div className="detail-content">
          <span className="product-category">{product.category} · Mela finds</span>
          <h2 id="detail-title">{product.name}</h2>
          <div className="detail-rating"><span>★</span> {product.rating} <small>({product.reviews.toLocaleString('en-IN')} reviews)</small></div>
          <div className="detail-price">
            <strong>₹{product.price.toLocaleString('en-IN')}</strong>
            <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>
            <span>{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
          </div>
          <p className="detail-description">A lovely {product.category.toLowerCase()} find, picked for everyday comfort and easy styling. Product colours may look slightly different on your screen.</p>

          {options ? (
            <fieldset className="option-picker">
              <legend>{options.label} <span>* Required</span></legend>
              <div className="option-list">
                {options.values.map((option) => (
                  <button
                    className={selectedOption === option ? 'option-chip selected' : 'option-chip'}
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    aria-pressed={selectedOption === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {!selectedOption && <small className="option-hint">Select an option before adding to your bag.</small>}
            </fieldset>
          ) : (
            <div className="standard-option"><span>✓</span> Standard option · Ready to add</div>
          )}

          <div className="detail-delivery"><Icon name="truck" size={19} /><span>Free delivery on orders above ₹499 · Easy returns</span></div>
          <button className="detail-add-button" onClick={addProduct} disabled={Boolean(options && !selectedOption)}>
            Add to bag · ₹{product.price.toLocaleString('en-IN')}
          </button>
          <small className="detail-demo-note">Checkout and payment are demo-only at the moment.</small>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailModal;
