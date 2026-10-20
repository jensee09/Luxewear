import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Heart, Menu, Moon, Minus, Plus, Search, ShoppingBag, Sparkles, Sun, Truck, UserRound, X } from 'lucide-react';
import { cartCount, findProduct, totalsFor, useStore } from '../store/use-store';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';

export const formatRupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''}`} aria-label="LuxeWear home">
    <span className="brand-flower" aria-hidden="true"><i /><i /><i /><i /><b /></span>
    <span className="brand-word">luxe<span>wear</span></span>
  </Link>;
}

export function Announcement() {
  return <div className="announcement" aria-label="Store announcement"><div className="marquee-track">
    {Array.from({ length: 4 }, (_, index) => <span key={index} className="marquee-item">A LITTLE MORE YOU <b>✳</b> COMPLIMENTARY SHIPPING OVER ₹999 <b>✳</b> CASH ON DELIVERY, ALWAYS <b>✳</b></span>)}
  </div></div>;
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const cart = useStore((state) => state.cart);
  const setQuantity = useStore((state) => state.setQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const promoApplied = useStore((state) => state.promoApplied);
  const totals = totalsFor(cart, promoApplied);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [onClose]);

  return <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-drawer-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .32, ease: [0.22, 1, 0.36, 1] }} onClick={(event) => event.stopPropagation()}>
      <div className="drawer-head"><div><span className="eyebrow">A GOOD PLACE TO PAUSE</span><h2 id="bag-drawer-title">Your bag <em>of good things.</em></h2></div><button className="drawer-close" onClick={onClose} aria-label="Close shopping bag"><X /></button></div>
      {cart.length ? <>
        <div className="drawer-lines">{cart.map((line) => {
          const product = findProduct(line.productId);
          if (!product) return null;
          return <article className="drawer-line" key={`${line.productId}-${line.size}`}>
            <Link to={`/product/${product.id}`} onClick={onClose} className="drawer-item-image"><img src={product.image} alt={product.title} /></Link>
            <div className="drawer-item-info"><Link to={`/product/${product.id}`} onClick={onClose}>{product.title}</Link><small>{product.category} · size {line.size}</small>
              <div className="quantity-stepper drawer-stepper"><button onClick={() => setQuantity(product.id, line.size, line.quantity - 1)} aria-label={`Decrease ${product.title} quantity`}><Minus /></button><span>{line.quantity}</span><button onClick={() => setQuantity(product.id, line.size, line.quantity + 1)} aria-label={`Increase ${product.title} quantity`}><Plus /></button></div>
            </div><strong>{formatRupees(product.price * line.quantity)}</strong>
          </article>;
        })}</div>
        <div className="drawer-summary"><span>Delivery</span><b>{totals.shipping ? formatRupees(totals.shipping) : 'FREE'}</b></div>
        <div className="drawer-summary drawer-summary--total"><span>Bag total</span><b>{formatRupees(totals.total)}</b></div>
        <p className="drawer-cod"><Truck /> Cash on delivery · ₹49 fee</p>
        <Link to="/cart" className="button button--primary drawer-cta" onClick={onClose}>See your bag <ArrowRight /></Link>
        <button className="drawer-continue" onClick={onClose}>I’ll keep looking around</button>
      </> : <div className="drawer-empty"><span className="empty-icon"><ShoppingBag /></span><h3>Nothing’s here <em>yet.</em></h3><p>Plenty of lovely things are waiting.</p><Link to="/shop" onClick={onClose} className="button button--primary">Browse the collection <ArrowRight /></Link></div>}
    </motion.aside>
  </motion.div>;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useStore((state) => cartCount(state.cart));
  const wishes = useStore((state) => state.wishlist.length);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'is-active' : ''}`;

  return <>
    <Announcement />
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <button className="icon-button mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      <BrandMark />
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink end to="/" className={linkClass}>Home</NavLink><NavLink to="/shop" className={linkClass}>Shop all</NavLink><NavLink to="/shop?category=Women" className="nav-link">For her</NavLink><NavLink to="/shop?category=Men" className="nav-link">For him</NavLink><NavLink to="/shop?category=Kids" className="nav-link">Little ones</NavLink>
      </nav>
      <div className="header-actions">
        <Link to="/shop" className="icon-button" aria-label="Search the collection"><Search /></Link>
        <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon /> : <Sun />}</button>
        <Link to="/account" className="icon-button account-action" aria-label="My account"><span className="user-dot"><UserRound /></span></Link>
        <Link to="/wishlist" className="icon-button with-badge" aria-label={`Wishlist, ${wishes} saved items`}><Heart />{wishes > 0 && <span className="nav-badge">{wishes}</span>}</Link>
        <button className="icon-button with-badge" onClick={() => setBagOpen(true)} aria-label={`Open shopping bag, ${count} items`}><ShoppingBag />{count > 0 && <span className="nav-badge">{count}</span>}</button>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home <ArrowRight /></NavLink><NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop all <ArrowRight /></NavLink><NavLink to="/shop?category=Women" onClick={() => setMenuOpen(false)}>For her <ArrowRight /></NavLink><NavLink to="/shop?category=Men" onClick={() => setMenuOpen(false)}>For him <ArrowRight /></NavLink><NavLink to="/shop?category=Kids" onClick={() => setMenuOpen(false)}>Little ones <ArrowRight /></NavLink><NavLink to="/account" onClick={() => setMenuOpen(false)}>My account <ArrowRight /></NavLink>
        <button className="mobile-theme-toggle" onClick={toggleTheme}>{theme === 'light' ? <Moon /> : <Sun />} Switch to {theme === 'light' ? 'dark' : 'light'} mode</button>
      </motion.nav>}</AnimatePresence>
    </header>
    <AnimatePresence>{bagOpen && <CartDrawer onClose={() => setBagOpen(false)} />}</AnimatePresence>
  </>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-glow footer-glow--one" /><div className="footer-glow footer-glow--two" />
    <div className="footer-top"><div className="footer-brand"><BrandMark /><p>For the way you are. And the way you’re becoming.</p><div className="social-row"><a href="https://www.instagram.com/" aria-label="Instagram">ig</a><a href="https://www.pinterest.com/" aria-label="Pinterest">p</a><a href="https://www.tiktok.com/" aria-label="TikTok">tk</a></div></div>
      <div className="footer-column"><h3>Explore</h3><Link to="/shop">Shop everything</Link><Link to="/shop?category=Women">For her</Link><Link to="/shop?category=Men">For him</Link><Link to="/shop?category=Kids">Little ones</Link></div>
      <div className="footer-column"><h3>The helpful bits</h3><Link to="/account">Your account</Link><Link to="/cart">Your bag</Link><Link to="/checkout">Delivery & payment</Link><a href="mailto:hello@luxewear.example">Say hello</a></div>
      <div className="footer-note"><span className="eyebrow eyebrow--light">THE GOOD TO KNOW</span><h3>Cash at the door.<br />No surprises.</h3><p>Free delivery on orders above ₹999. A real person is always just an email away.</p><Link to="/shop" className="footer-arrow-link">Find your next favourite <ArrowRight /></Link></div>
    </div>
    <div className="footer-bottom"><span>© 2026 LuxeWear Studio. All soft edges reserved.</span><span>Made for real life, with a little extra feeling.</span><Link to="/account">Profile & orders</Link></div>
  </footer>;
}

export function MobileDock() {
  const count = useStore((state) => cartCount(state.cart));
  const wishes = useStore((state) => state.wishlist.length);
  const location = useLocation();
  const items = [{ to: '/', label: 'Home', icon: <Sparkles /> }, { to: '/shop', label: 'Shop', icon: <Search /> }, { to: '/wishlist', label: 'Saved', icon: <Heart />, count: wishes }, { to: '/cart', label: 'Bag', icon: <ShoppingBag />, count }];
  return <nav className="mobile-dock" aria-label="Quick navigation">{items.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `dock-item ${isActive && (item.to !== '/' || location.pathname === '/') ? 'is-active' : ''}`}><span className="dock-icon">{item.icon}{item.count ? <span className="dock-badge">{item.count}</span> : null}</span><span>{item.label}</span></NavLink>)}</nav>;
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <motion.main className="page-frame" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -9 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.main>;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); }, [pathname, reduceMotion]);
  return null;
}
