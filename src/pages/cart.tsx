import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { findProduct, totalsFor, useStore } from '../store/use-store';
import { Button } from '../components/ui';
import { formatRupees } from '../components/layout';
import type * as React from 'react';

export function CartPage() {
  const cart = useStore((state) => state.cart);
  const promoApplied = useStore((state) => state.promoApplied);
  const setPromo = useStore((state) => state.setPromo);
  const setQuantity = useStore((state) => state.setQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const moveToWishlist = useStore((state) => state.moveToWishlist);
  const [promoCode, setPromoCode] = useState(promoApplied ? 'DEMO10' : '');
  const [promoMessage, setPromoMessage] = useState('');
  const totals = totalsFor(cart, promoApplied);

  const applyPromo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DEMO10') {
      setPromo(true);
      setPromoCode('DEMO10');
      setPromoMessage('Lovely — 10% off is on your bag.');
    } else {
      setPromo(false);
      setPromoMessage('That code didn’t quite fit. Try DEMO10.');
    }
  };

  if (!cart.length) return <div className="empty-state bag-empty page-gutter">
    <span className="empty-icon"><ShoppingBag /></span>
    <span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span>
    <h1>Your bag’s <em>taking a breather.</em></h1>
    <p>That’s okay. There’s plenty of good things waiting for their moment.</p>
    <Button to="/shop">Find something good <ArrowRight /></Button>
    <Link to="/wishlist" className="quiet-link">Have a saved piece? <ArrowUpRight /></Link>
  </div>;

  return <div className="cart-page page-gutter">
    <div className="page-title-block">
      <span className="eyebrow">THE NEXT GOOD THING</span>
      <h1>Your bag <em>of good things.</em></h1>
      <p>{cart.reduce((sum, item) => sum + item.quantity, 0)} pieces, getting ready for a new home.</p>
    </div>
    <div className="cart-layout">
      <section className="cart-lines" aria-label="Items in your shopping bag">
        {cart.map((line) => {
          const product = findProduct(line.productId);
          if (!product) return null;
          return <article className="cart-line" key={`${line.productId}-${line.size}`}>
            <Link to={`/product/${product.id}`} className="cart-line-image"><img src={product.image} alt={product.title} /></Link>
            <div className="cart-line-info">
              <Link to={`/product/${product.id}`} className="cart-line-title">{product.title}</Link>
              <span>{product.category} · Size {line.size}</span>
              <span className="cart-colour"><i style={{ backgroundColor: line.color }} /> Just your colour</span>
              <div className="cart-line-actions">
                <div className="quantity-stepper">
                  <button onClick={() => setQuantity(product.id, line.size, line.quantity - 1)} aria-label={`Decrease ${product.title} quantity`}><Minus /></button>
                  <span>{line.quantity}</span>
                  <button onClick={() => setQuantity(product.id, line.size, line.quantity + 1)} aria-label={`Increase ${product.title} quantity`}><Plus /></button>
                </div>
                <button className="line-text-action" onClick={() => moveToWishlist(product.id, line.size)}><Heart /> Save for later</button>
                <button className="line-remove" onClick={() => removeFromCart(product.id, line.size)} aria-label={`Remove ${product.title}`}><Trash2 /></button>
              </div>
            </div>
            <strong className="cart-line-price">{formatRupees(product.price * line.quantity)}</strong>
          </article>;
        })}
        <Link to="/shop" className="continue-shopping"><ArrowUpRight /> Keep looking around</Link>
      </section>

      <aside className="order-summary">
        <div className="summary-header"><span className="eyebrow">A CLEAR LITTLE BREAKDOWN</span><h2>Order <em>summary.</em></h2></div>
        <div className={`promo-box ${promoApplied ? 'is-applied' : ''}`}>
          <span className="promo-tag">{promoApplied ? '✓' : '10%'}</span>
          <form className="promo-form" onSubmit={applyPromo}>
            <label htmlFor="promo-code">{promoApplied ? 'DEMO10 is on your bag' : 'A little something off'}</label>
            <div><input id="promo-code" value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoMessage(''); }} placeholder="Enter DEMO10" aria-label="Promo code" disabled={promoApplied} /><button type={promoApplied ? 'button' : 'submit'} onClick={promoApplied ? () => { setPromo(false); setPromoCode(''); setPromoMessage(''); } : undefined}>{promoApplied ? 'Remove' : 'Apply'}</button></div>
            {promoMessage && <small role="status">{promoMessage}</small>}
            {!promoMessage && <small>{promoApplied ? 'Your 10% welcome saving is included.' : 'Use the welcome code for 10% off.'}</small>}
          </form>
        </div>
        <div className="summary-row"><span>Subtotal</span><b>{formatRupees(totals.subtotal)}</b></div>
        <div className="summary-row"><span>Good little saving {promoApplied && <i>(DEMO10)</i>}</span><b className={promoApplied ? 'saving-value' : ''}>{promoApplied ? `−${formatRupees(totals.discount)}` : '—'}</b></div>
        <div className="summary-row"><span>Delivery</span><b>{totals.shipping === 0 ? <span className="free-label">FREE</span> : formatRupees(totals.shipping)}</b></div>
        <div className="summary-row"><span>Cash on delivery</span><b>{formatRupees(totals.codFee)}</b></div>
        <p className="shipping-note">{totals.subtotal > 999 ? 'Lovely — delivery is on us.' : `${formatRupees(1000 - totals.subtotal)} away from complimentary delivery.`}</p>
        <div className="summary-total"><span>Today’s total</span><strong>{formatRupees(totals.total)}</strong></div>
        <Button to="/checkout" className="checkout-button">On to your details <ArrowRight /></Button>
        <p className="cod-note">You’ll pay when your good things arrive. Cash on delivery, no fuss.</p>
      </aside>
    </div>
  </div>;
}

export function WishlistPage() {
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const saved = wishlist.map((id) => findProduct(id)).filter((item) => item !== undefined);

  return <div className="wishlist-page page-gutter">
    <div className="page-title-block">
      <span className="eyebrow">THE PIECES YOU’RE THINKING ABOUT</span>
      <h1>Your saved <em>daydreams.</em></h1>
      <p>{saved.length} good {saved.length === 1 ? 'thing' : 'things'} for later.</p>
    </div>
    {saved.length ? <>
      <div className="wishlist-grid">{saved.map((product) => <div className="wishlist-item" key={product.id}>
        <button className="wishlist-remove" onClick={() => toggleWishlist(product.id)} aria-label={`Remove ${product.title} from wishlist`}><Heart fill="currentColor" /></button>
        <Link to={`/product/${product.id}`} className="wishlist-image"><img src={product.image} alt={product.title} /><span>YOUR SAVED PIECE</span></Link>
        <div className="wishlist-info"><div><Link to={`/product/${product.id}`}>{product.title}</Link><span>{product.category}</span></div><strong>{formatRupees(product.price)}</strong></div>
        <button className="wishlist-add" onClick={() => addToCart(product.id, product.sizes[0], product.colors[0])}>Add to your bag <ArrowRight /></button>
      </div>)}</div>
      <div className="wishlist-footer-note">A good feeling looks good on you. <Link to="/shop">Keep browsing <ArrowUpRight /></Link></div>
    </> : <div className="empty-state wishlist-empty">
      <span className="empty-icon"><Heart /></span>
      <h2>No daydreams <em>just yet.</em></h2>
      <p>Save the things you love. They’ll be here when you come back.</p>
      <Button to="/shop">Find something to love <ArrowRight /></Button>
    </div>}
  </div>;
}
