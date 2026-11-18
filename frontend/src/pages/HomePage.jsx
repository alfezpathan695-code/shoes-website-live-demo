import React, { useEffect, useMemo, useState } from 'react';
import { fetchProducts, submitOrder } from '../api/storeApi';
import AuthModal from '../components/AuthModal';
import BenefitsStrip from '../components/BenefitsStrip';
import CartDrawer from '../components/CartDrawer';
import CategoryNav from '../components/CategoryNav';
import CategorySection from '../components/CategorySection';
import CheckoutModal from '../components/CheckoutModal';
import HeroSection from '../components/HeroSection';
import ProductDetailModal from '../components/ProductDetailModal';
import ProductSection from '../components/ProductSection';
import SiteFooter from '../components/SiteFooter';
import StoreHeader from '../components/StoreHeader';
import Toast from '../components/Toast';
import WishlistBanner from '../components/WishlistBanner';
import { categories, products as sampleProducts } from '../data/storeData';

function readCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('mela-cart') || '[]');
    if (!Array.isArray(savedCart)) return [];
    return savedCart.map((item) => {
      const currentProduct = sampleProducts.find((product) => product.id === item.id);
      return currentProduct
        ? { ...currentProduct, quantity: item.quantity, variant: item.variant || 'Standard' }
        : item;
    });
  } catch {
    return [];
  }
}

function readSession() {
  const token = sessionStorage.getItem('mela-token');
  const savedUser = sessionStorage.getItem('mela-user');
  if (!token || !savedUser) return null;

  try {
    return { token, user: JSON.parse(savedUser) };
  } catch {
    sessionStorage.removeItem('mela-token');
    sessionStorage.removeItem('mela-user');
    return null;
  }
}

function HomePage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recommended');
  const [catalogProducts, setCatalogProducts] = useState(sampleProducts);
  const [cart, setCart] = useState(readCart);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auth, setAuth] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutAfterAuth, setCheckoutAfterAuth] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((apiProducts) => {
        if (active) setCatalogProducts(apiProducts);
      })
      .catch((error) => {
        console.error('Catalog API request failed:', error);
        if (active) setToast('Live catalog unavailable. Showing the sample collection.');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('mela-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredProducts = catalogProducts.filter((product) => (
      (category === 'All' || product.category === category)
      && (!wishlistOnly || wishlist.includes(product.id))
      && (!normalizedQuery || `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery))
    ));

    if (sort === 'price-low') return [...filteredProducts].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return [...filteredProducts].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...filteredProducts].sort((a, b) => b.rating - a.rating);
    return filteredProducts;
  }, [catalogProducts, category, query, sort, wishlist, wishlistOnly]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function chooseCategory(name) {
    setCategory(name);
    setQuery('');
    setWishlistOnly(false);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  function searchProducts(value) {
    setQuery(value);
    setCategory('All');
    setWishlistOnly(false);
  }

  function openWishlist() {
    setCategory('All');
    setQuery('');
    setWishlistOnly(true);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  function addToCart(product, variant = 'Standard') {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => (
        item.id === product.id && (item.variant || 'Standard') === variant
      ));
      if (existingItem) {
        return currentCart.map((item) => (
          item.id === product.id && (item.variant || 'Standard') === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
      return [...currentCart, { ...product, variant, quantity: 1 }];
    });
    setSelectedProduct(null);
    setToast('Added to your bag');
  }

  function changeQuantity(id, variant, amount) {
    setCart((currentCart) => currentCart
      .map((item) => (
        item.id === id && (item.variant || 'Standard') === (variant || 'Standard')
          ? { ...item, quantity: item.quantity + amount }
          : item
      ))
      .filter((item) => item.quantity > 0));
  }

  function toggleWishlist(id) {
    setWishlist((currentWishlist) => (
      currentWishlist.includes(id)
        ? currentWishlist.filter((item) => item !== id)
        : [...currentWishlist, id]
    ));
  }

  function resetFilters() {
    setQuery('');
    setCategory('All');
    setWishlistOnly(false);
  }

  function checkout() {
    setCartOpen(false);
    if (!auth) {
      setCheckoutAfterAuth(true);
      setAuthOpen(true);
      setToast('Sign in to continue to checkout.');
      return;
    }
    setCheckoutOpen(true);
  }

  function closeAuth() {
    setAuthOpen(false);
    setCheckoutAfterAuth(false);
  }

  function authenticate(session) {
    sessionStorage.setItem('mela-token', session.token);
    sessionStorage.setItem('mela-user', JSON.stringify(session.user));
    setAuth(session);
    setAuthOpen(false);
    setCheckoutOpen(checkoutAfterAuth);
    setCheckoutAfterAuth(false);
    setToast(checkoutAfterAuth ? 'Signed in. Add your delivery details to place the order.' : 'You are signed in.');
  }

  function signOut() {
    sessionStorage.removeItem('mela-token');
    sessionStorage.removeItem('mela-user');
    setAuth(null);
    setAuthOpen(false);
    setToast('You have signed out.');
  }

  async function placeOrder(shippingAddress) {
    const result = await submitOrder({
      items: cart.map((item) => ({
        productId: item.id,
        variant: item.variant || 'Standard',
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      shippingAddress,
    }, auth.token);

    setCart([]);
    setCheckoutOpen(false);
    setToast(`Order placed. Payment is pending${result.order?._id ? ` · #${result.order._id.slice(-6)}` : ''}.`);
  }

  return (
    <div className="storefront">
      <StoreHeader
        query={query}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onSearch={searchProducts}
        onAccount={() => setAuthOpen(true)}
        onWishlist={openWishlist}
        onBag={() => setCartOpen(true)}
      />
      <CategoryNav categories={categories} activeCategory={category} query={query} onSelect={chooseCategory} />

      <main id="top">
        <HeroSection onExplore={() => chooseCategory('All')} />
        <BenefitsStrip />
        <CategorySection categories={categories} onSelect={chooseCategory} />
        <ProductSection
          products={visibleProducts}
          category={category}
          query={query}
          sort={sort}
          wishlistOnly={wishlistOnly}
          wishlist={wishlist}
          onSort={setSort}
          onToggleFavorite={toggleWishlist}
          onOpenDetails={setSelectedProduct}
          onReset={resetFilters}
        />
        <WishlistBanner onOpenWishlist={openWishlist} />
      </main>

      <SiteFooter onSelectCategory={chooseCategory} />
      <Toast message={toast} />
      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onCheckout={checkout}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
      {authOpen && (
        <AuthModal
          user={auth?.user}
          onClose={closeAuth}
          onAuthenticated={authenticate}
          onSignOut={signOut}
        />
      )}
      {checkoutOpen && (
        <CheckoutModal
          cartTotal={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onPlaceOrder={placeOrder}
        />
      )}
    </div>
  );
}

export default HomePage;
