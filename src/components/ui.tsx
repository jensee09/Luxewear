import { useState, type ReactNode, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Plus, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../store/use-store';
import { useStore } from '../store/use-store';
import { formatRupees } from './layout';

export function Button({ children, to, onClick, kind = 'primary', type = 'button', disabled = false, className = '' }: {
  children: ReactNode; to?: string; onClick?: () => void; kind?: 'primary' | 'soft' | 'dark' | 'text'; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; className?: string;
}) {
  const classes = `button button--${kind} ${className}`;
  return to ? <Link to={to} className={classes}>{children}</Link> : <button className={classes} type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function SectionHeading({ eyebrow, title, text, link, linkLabel = 'Shop the edit' }: {
  eyebrow: string; title: ReactNode; text?: string; link?: string; linkLabel?: string;
}) {
  return <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
    {link && <Link to={link} className="text-link heading-link">{linkLabel}<ArrowRight /></Link>}
  </div>;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const navigate = useNavigate();
  const saved = wishlist.includes(product.id);

  const quickAdd = () => {
    addToCart(product.id, product.sizes[0], product.colors[0]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: -((event.clientY - bounds.top) / bounds.height - .5) * 9,
      y: ((event.clientX - bounds.left) / bounds.width - .5) * 11,
    });
  };
  const onPointerLeave = () => setTilt({ x: 0, y: 0 });

  return <motion.article className="product-card" style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: 'preserve-3d' }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45, delay: Math.min(index % 4, 3) * .055 }} whileHover={{ y: -6 }}>
    <div className="product-image-wrap">
      <Link to={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.title}`}>
        <img className="product-image" src={product.image} alt={`${product.title} — ${product.category} fashion`} loading={index < 4 ? 'eager' : 'lazy'} />
      </Link>
      <span className="product-tag">{product.tag}</span>
      <button className={`favorite-button ${saved ? 'is-favorite' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`} aria-pressed={saved}><Heart fill={saved ? 'currentColor' : 'none'} /></button>
      <button className="quick-add" onClick={quickAdd} aria-label={`Quick add ${product.title} to bag`}><span>{added ? 'Added!' : 'Quick add'}</span>{added ? <ShoppingBag /> : <Plus />}</button>
    </div>
    <div className="product-info"><div><Link className="product-title" to={`/product/${product.id}`}>{product.title}</Link><span className="product-category">{product.category}</span></div><div className="price-row"><strong>{formatRupees(product.price)}</strong><del>{formatRupees(product.oldPrice)}</del></div></div>
    <div className="product-meta"><span className="rating"><Star fill="currentColor" /> {product.rating} <small>({product.reviewCount})</small></span><button className="tiny-arrow" onClick={() => navigate(`/product/${product.id}`)} aria-label={`See ${product.title} details`}><ArrowRight /></button></div>
  </motion.article>;
}

export function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length) return null;
  return <div className="product-grid">{items.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>;
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
