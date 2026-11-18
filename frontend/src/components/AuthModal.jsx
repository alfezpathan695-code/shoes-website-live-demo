import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { createAccount, signIn } from '../api/storeApi';

function AuthModal({ user, onClose, onAuthenticated, onSignOut }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const session = mode === 'login'
        ? await signIn({ email, password })
        : await createAccount({ name, email, password });
      onAuthenticated(session);
    } catch (requestError) {
      const message = requestError.response?.data?.message || requestError.message;
      setError(message || 'Could not connect to the account service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="detail-close" onClick={onClose} aria-label="Close account dialog"><Icon name="close" /></button>
        {user ? (
          <div className="account-session">
            <span className="account-icon">m</span>
            <span className="eyebrow">YOUR MELA ACCOUNT</span>
            <h2 id="account-title">Hi, {user.name}</h2>
            <p>{user.email}</p>
            <button className="detail-add-button" onClick={onSignOut}>Sign out</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">WELCOME TO MELA</span>
            <h2 id="account-title">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
            <p className="account-intro">Keep your orders and lovely finds together.</p>
            <div className="account-tabs" role="tablist" aria-label="Account options">
              <button
                className={mode === 'login' ? 'active' : ''}
                onClick={() => { setMode('login'); setError(''); }}
                role="tab"
                aria-selected={mode === 'login'}
              >
                Sign in
              </button>
              <button
                className={mode === 'register' ? 'active' : ''}
                onClick={() => { setMode('register'); setError(''); }}
                role="tab"
                aria-selected={mode === 'register'}
              >
                Create account
              </button>
            </div>
            <form className="account-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>
                  Full name
                  <input value={name} onChange={(event) => setName(event.target.value)} minLength="2" maxLength="80" autoComplete="name" required />
                </label>
              )}
              <label>
                Email address
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" maxLength="72" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="detail-add-button" type="submit" disabled={submitting}>
                {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default AuthModal;
