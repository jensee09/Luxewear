import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findProduct, products, useStore } from '../store/use-store';
import { Button, ProductGrid, SectionHeading } from '../components/ui';
import { formatRupees } from '../components/layout';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';

const editorialGalleries: Record<string, string[]> = {
  Women: ['/images/fashion/fashion-08.webp', '/images/fashion/fashion-07.webp', '/images/fashion/fashion-05.webp', '/images/fashion/fashion-06.webp'],
  Men: ['/images/fashion/fashion-10.webp', '/images/fashion/fashion-11.webp', '/images/fashion/fashion-01.webp', '/images/fashion/fashion-12.webp'],
  Kids: ['/images/fashion/fashion-09.webp'],
  Unisex: ['/images/fashion/fashion-13.webp', '/images/fashion/fashion-03.webp', '/images/fashion/fashion-04.webp'],
};

export function ProductPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const product = findProduct(id);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [heroImage, setHeroImage] = useState('');
  const [added, setAdded] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => { if (product) { setSize(product.sizes[0]); setColor(product.colors[0]); setHeroImage(product.image); setQuantity(1); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); } }, [product?.id, reduceMotion]);
  const related = useMemo(() => product ? products.filter((item) => item.id !== product.id && (item.category === product.category || item.featured)).slice(0, 4) : [], [product]);
  if (!product) return <div className="empty-state not-found"><h1>That piece has moved.</h1><p>Maybe it found a new home — there’s plenty more to love.</p><Button to="/shop">Back to the collection <ArrowRight /></Button></div>;
  const isSaved = wishlist.includes(product.id);
  const gallery = [...new Set([product.image, ...(editorialGalleries[product.category] ?? [])])].slice(0, 4);
  const handleAdd = () => { if (!size) return; addToCart(product.id, size, color, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1700); };
  return <div className="product-detail-page page-gutter"><Link to="/shop" className="back-link"><ArrowLeft /> Back to the collection</Link><div className="product-detail-layout">
    <div className="gallery-layout"><div className="gallery-thumbs">{gallery.map((image, index) => <button className={`gallery-thumb ${heroImage === image ? 'is-active' : ''}`} key={`${image}-${index}`} onClick={() => setHeroImage(image)} aria-label={`View image ${index + 1}`}><img src={image} alt="" loading="lazy" /></button>)}</div><motion.div className="gallery-main" key={heroImage} initial={{ opacity: .6, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .3 }}><img src={heroImage} alt={product.title} /><span className="gallery-stamp">LW<br />STUDIO</span></motion.div></div>
    <section className="detail-copy"><span className="eyebrow">{product.category.toUpperCase()} · THE LUXEWEAR EDIT</span><div className="detail-title-row"><h1>{product.title}</h1><button className={`favorite-button detail-favorite ${isSaved ? 'is-favorite' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={isSaved}><Heart fill={isSaved ? 'currentColor' : 'none'} /></button></div><div className="detail-review"><span>★★★★★</span><strong>{product.rating}</strong><a href="#reviews">({product.reviewCount} notes from lovely people)</a></div>
      <div className="detail-prices"><strong>{formatRupees(product.price)}</strong><del>{formatRupees(product.oldPrice)}</del><span className="discount-chip">{Math.round((1 - product.price / product.oldPrice) * 100)}% OFF</span></div><p className="detail-description">{product.description}</p>
      <div className="option-heading"><span>Colour</span><span>{color && <><i className="selected-color-dot" style={{ backgroundColor: color }} /> A good choice</>}</span></div><div className="color-options" role="radiogroup" aria-label="Choose a colour">{product.colors.map((value, index) => <button key={value} style={{ backgroundColor: value }} className={`color-swatch ${color === value ? 'is-selected' : ''}`} onClick={() => setColor(value)} role="radio" aria-checked={color === value} aria-label={`Colour ${index + 1}`} />)}</div>
      <div className="option-heading size-heading"><span>Pick your size</span><button onClick={() => (document.getElementById('size-guide') as HTMLDialogElement | null)?.showModal()}><Ruler /> Size guide</button></div><div className="size-options" role="group" aria-label="Choose a size">{product.sizes.map((value) => <button key={value} onClick={() => setSize(value)} className={size === value ? 'is-selected' : ''} aria-pressed={size === value}>{value}</button>)}</div>
      <div className="buy-row"><div className="quantity-stepper"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus /></button><span aria-live="polite">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus /></button></div><Button onClick={handleAdd} className="add-to-bag-button">{added ? <><Check /> Added to your bag</> : <>Add to bag <span>{formatRupees(product.price * quantity)}</span></>}</Button></div><button className="buy-now-link" onClick={() => { handleAdd(); setTimeout(() => navigate('/cart'), 50); }}>Take it home <ArrowRight /></button>
      <div className="detail-promises"><div><Truck /><span><b>Free delivery over ₹999</b><small>Otherwise just ₹79</small></span></div><div><ShieldCheck /><span><b>Pay when it arrives</b><small>Cash on delivery available</small></span></div></div>
      <details className="product-details-accordion"><summary>Details & care <span>+</span></summary><p>{product.description} We recommend a gentle wash and a little room to air dry. Made to be worn on repeat.</p></details>
      <dialog className="size-guide-dialog" id="size-guide"><div className="dialog-heading"><h2>A good fit, <em>every time.</em></h2><button onClick={() => (document.getElementById('size-guide') as HTMLDialogElement | null)?.close()} aria-label="Close size guide">×</button></div><p>Our pieces are designed to feel easy, not oversized. If you like a little more room, size up.</p><div className="size-guide-list"><span>XS — 32–34 in</span><span>S — 34–36 in</span><span>M — 36–38 in</span><span>L — 38–40 in</span><span>XL — 40–42 in</span></div></dialog>
    </section><div className="mobile-add-bar"><div><strong>{formatRupees(product.price * quantity)}</strong><small>Cash on delivery</small></div><button onClick={handleAdd}>{added ? 'Added to your bag ✓' : 'Add to bag'} <ArrowRight /></button></div></div>
    <section className="related-products page-gutter"><SectionHeading eyebrow="GOOD THINGS GO TOGETHER" title={<>You might also <em>love.</em></>} link="/shop" /><ProductGrid items={related} /></section>
  </div>;
}
