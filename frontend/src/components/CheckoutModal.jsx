import React, { useEffect, useState } from 'react';
import Icon from './Icon';

const initialAddress = {
  fullName: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
};

function CheckoutModal({ cartTotal, onClose, onPlaceOrder }) {
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  function updateAddress(event) {
    setAddress((currentAddress) => ({ ...currentAddress, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onPlaceOrder(address);
    } catch (requestError) {
      const message = requestError.response?.data?.message;
      setError(message || 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="detail-close" onClick={onClose} aria-label="Close checkout"><Icon name="close" /></button>
        <span className="eyebrow">ALMOST YOURS</span>
        <h2 id="checkout-title">Delivery details</h2>
        <p className="account-intro">Your order total is <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>. Payment is not collected in this preview.</p>
        <form className="account-form checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-full-width">
            Full name
            <input name="fullName" value={address.fullName} onChange={updateAddress} minLength="2" maxLength="100" autoComplete="name" required />
          </label>
          <label>
            Mobile number
            <input name="phone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number" value={address.phone} onChange={updateAddress} autoComplete="tel" required />
          </label>
          <label>
            PIN code
            <input name="pincode" inputMode="numeric" pattern="[0-9]{6}" title="Enter a 6-digit PIN code" value={address.pincode} onChange={updateAddress} autoComplete="postal-code" required />
          </label>
          <label className="checkout-full-width">
            Address
            <textarea name="addressLine" value={address.addressLine} onChange={updateAddress} minLength="8" maxLength="240" autoComplete="street-address" required />
          </label>
          <label>
            City
            <input name="city" value={address.city} onChange={updateAddress} minLength="2" maxLength="80" autoComplete="address-level2" required />
          </label>
          <label>
            State
            <input name="state" value={address.state} onChange={updateAddress} minLength="2" maxLength="80" autoComplete="address-level1" required />
          </label>
          {error && <p className="form-error checkout-full-width" role="alert">{error}</p>}
          <button className="detail-add-button checkout-full-width" type="submit" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order · ₹' + cartTotal.toLocaleString('en-IN')}
          </button>
        </form>
        <small className="detail-demo-note">Your order will be saved with payment marked as pending.</small>
      </section>
    </div>
  );
}

export default CheckoutModal;
