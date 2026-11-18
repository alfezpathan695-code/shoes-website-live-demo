import React from 'react';
import Icon from './Icon';

function CartDrawer({ cart, cartCount, cartTotal, onClose, onChangeQuantity, onCheckout }) {
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-header">
          <div><span className="eyebrow">YOUR GOOD FINDS</span><h2>Your bag <span>({cartCount})</span></h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close bag"><Icon name="close" /></button>
        </div>
        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={`${item.id}-${item.variant || 'Standard'}`}>
                  <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=180&q=75`} alt="" />
                  <div className="cart-item-info">
                    <span className="product-category">{item.category}</span>
                    <strong>{item.name}</strong>
                    {item.variant && item.variant !== 'Standard' && <small className="cart-variant">Size: {item.variant}</small>}
                    <b>₹{item.price.toLocaleString('en-IN')}</b>
                    <div className="quantity-control">
                      <button onClick={() => onChangeQuantity(item.id, item.variant, -1)} aria-label={`Decrease ${item.name} quantity`}><Icon name="minus" size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onChangeQuantity(item.id, item.variant, 1)} aria-label={`Increase ${item.name} quantity`}><Icon name="plus" size={14} /></button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => onChangeQuantity(item.id, item.variant, -item.quantity)} aria-label={`Remove ${item.name}`}><Icon name="close" size={16} /></button>
                </div>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="delivery-note">
                <Icon name="truck" size={19} />
                <span>{cartTotal >= 499 ? 'Yay! You’ve unlocked free delivery.' : `Add ₹${(499 - cartTotal).toLocaleString('en-IN')} more for free delivery.`}</span>
              </div>
              <div className="subtotal"><span>Subtotal</span><strong>₹{cartTotal.toLocaleString('en-IN')}</strong></div>
              <small className="tax-note">Inclusive of all taxes · Delivery calculated at checkout</small>
              <button className="checkout-button" onClick={onCheckout}>Continue to checkout <Icon name="arrow" size={18} /></button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <span className="empty-bag">♡</span>
            <h3>Your bag is taking a little nap</h3>
            <p>Find something lovely to wake it up.</p>
            <button className="primary-button" onClick={onClose}>Explore the collection <Icon name="arrow" size={17} /></button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
