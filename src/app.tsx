import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer, Header, MobileDock, PageFrame, ScrollToTop } from './components/layout';
import { Button } from './components/ui';
import { useStore } from './store/use-store';

const HomePage = lazy(() => import('./pages/home').then((module) => ({ default: module.HomePage })));
const ShopPage = lazy(() => import('./pages/shop').then((module) => ({ default: module.ShopPage })));
const ProductPage = lazy(() => import('./pages/product-detail').then((module) => ({ default: module.ProductPage })));
const WishlistPage = lazy(() => import('./pages/cart').then((module) => ({ default: module.WishlistPage })));
const CartPage = lazy(() => import('./pages/cart').then((module) => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import('./pages/checkout').then((module) => ({ default: module.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/order-success').then((module) => ({ default: module.OrderSuccessPage })));
const AccountPage = lazy(() => import('./pages/account').then((module) => ({ default: module.AccountPage })));

function NotFound() {
  return <div className="empty-state not-found page-gutter">
    <span className="eyebrow">THIS PAGE TOOK A DIFFERENT TURN</span>
    <h1>Lost the <em>thread?</em></h1>
    <p>Let’s find your way back to the good stuff.</p>
    <Button to="/shop">Explore the collection <ArrowRight /></Button>
  </div>;
}

function RouteFallback() {
  return <div className="route-loading" aria-live="polite"><span className="route-loader">✳</span><span>Finding the good stuff…</span></div>;
}

export function App() {
  const location = useLocation();
  const theme = useStore((state) => state.theme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return <MotionConfig reducedMotion="user">
    <>
      <ScrollToTop />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname + location.search}>
          <Route path="/" element={<PageFrame><Suspense fallback={<RouteFallback />}><HomePage /></Suspense></PageFrame>} />
          <Route path="/shop" element={<PageFrame><Suspense fallback={<RouteFallback />}><ShopPage /></Suspense></PageFrame>} />
          <Route path="/product/:id" element={<PageFrame><Suspense fallback={<RouteFallback />}><ProductPage /></Suspense></PageFrame>} />
          <Route path="/wishlist" element={<PageFrame><Suspense fallback={<RouteFallback />}><WishlistPage /></Suspense></PageFrame>} />
          <Route path="/cart" element={<PageFrame><Suspense fallback={<RouteFallback />}><CartPage /></Suspense></PageFrame>} />
          <Route path="/checkout" element={<PageFrame><Suspense fallback={<RouteFallback />}><CheckoutPage /></Suspense></PageFrame>} />
          <Route path="/order-success/:id" element={<PageFrame><Suspense fallback={<RouteFallback />}><OrderSuccessPage /></Suspense></PageFrame>} />
          <Route path="/account" element={<PageFrame><Suspense fallback={<RouteFallback />}><AccountPage /></Suspense></PageFrame>} />
          <Route path="*" element={<PageFrame><NotFound /></PageFrame>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <MobileDock />
    </>
  </MotionConfig>;
}
