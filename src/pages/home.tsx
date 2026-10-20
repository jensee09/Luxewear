import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Heart, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, useStore } from '../store/use-store';
import { Button, ProductGrid, Reveal, SectionHeading } from '../components/ui';
import type * as React from 'react';
import { usePrefersReducedMotion } from '../hooks/use-reduced-motion';

const featured = products.filter((item) => item.featured).slice(0, 4);
const wheelItems = products.slice(0, 8);
const categories = [
  { title: 'For her', caption: 'Soft edges, strong mood', image: '/images/fashion/fashion-08.webp', category: 'Women', style: 'category-card--tall' },
  { title: 'For him', caption: 'Easy fits, good form', image: '/images/fashion/fashion-10.webp', category: 'Men', style: 'category-card--short' },
  { title: 'Little ones', caption: 'Big days start here', image: '/images/fashion/fashion-09.webp', category: 'Kids', style: 'category-card--short' },
  { title: 'New things', caption: 'Your next favourite', image: '/images/fashion/fashion-07.webp', category: 'Unisex', style: 'category-card--tall' },
];
const quotes = [
  { name: 'Nisha R.', city: 'Pune', quote: 'The jacket is so much nicer in real life. Soft, lovely details, and I already want the other colour.', product: 'Cityline Trench' },
  { name: 'Kabir M.', city: 'Mumbai', quote: 'Finally, basics that feel considered. The fit is easy and the fabric is a proper surprise.', product: 'Studio Essential Tee' },
  { name: 'Anaya D.', city: 'Bengaluru', quote: 'Ordered for the colour. Kept it for how it makes every outfit feel like me.', product: 'Afterglow Slip Dress' },
];

export function HomePage() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [review, setReview] = useState(0);
  const addToCart = useStore((state) => state.addToCart);
  const heroProduct = products[7];
  const reduceMotion = usePrefersReducedMotion();
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] });
  const backY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -24]);
  const frontY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [48, -38]);
  const frontRotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [4, -3]);
  return <>
    <section className="hero-section">
      <div className="hero-mesh" aria-hidden="true" /><div className="hero-orbit hero-orbit--one" aria-hidden="true" /><div className="hero-orbit hero-orbit--two" aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-star">✳</span> THE EVERYDAY, REIMAGINED</span>
        <h1>Dress like<br />you <em>mean it.</em></h1>
        <p>Good clothes. Good feeling. No special occasion required.</p>
        <div className="hero-actions"><Button to="/shop">Find your feeling <ArrowRight /></Button><Link to="/shop?category=Women" className="quiet-link">Explore the new edit <ArrowUpRight /></Link></div>
        <div className="hero-note"><div className="avatar-stack"><span>N</span><span>A</span><span>R</span><b>+</b></div><span>Made for real life<br /><strong>and all its plot twists.</strong></span></div>
        <a className="scroll-cue" href="#the-edit"><ArrowDown /><span>SCROLL A LITTLE</span></a>
      </div>
      <motion.div className="hero-visual" initial={{ opacity: 0, y: 30, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}>
        <motion.div className="hero-photo-card" animate={{ y: [0, -9, 0], rotateY: [0, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
          <img src="/images/fashion/fashion-02.webp" alt="Model wearing a tailored deep-blue LuxeWear jacket" />
          <div className="hero-image-sheen" />
          <span className="photo-stamp">THE<br /><i>good</i><br />EDIT</span>
        </motion.div>
        <motion.div className="hero-orbit-label orbit-label--top" animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}><span>MADE TO MOVE · MADE TO FEEL · </span></motion.div>
        <div className="floating-note floating-note--price"><span>THE OUTERWEAR EDIT</span><b>One good layer<br />changes everything.</b><Link to={`/product/${heroProduct.id}`}>Meet your new layer <ArrowRight /></Link></div>
        <motion.div className="hero-sparkle sparkle--a" animate={{ rotate: [0, 22, -8, 0], scale: [1, 1.16, 1] }} transition={{ duration: 4.4, repeat: Infinity }} aria-hidden="true">✳</motion.div>
        <motion.div className="hero-sparkle sparkle--b" animate={{ y: [0, 8, 0], rotate: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden="true">✦</motion.div>
      </motion.div>
      <span className="hero-side-note">CURATED WITH A LITTLE MORE FEELING — EST. 2026</span>
    </section>

    <section className="category-section page-gutter" id="the-edit">
      <div className="category-intro"><span className="eyebrow">ONE GOOD PLACE TO START</span><h2>A little <em>you,</em><br />in every piece.</h2><Link to="/shop" className="circle-arrow" aria-label="Browse all categories"><ArrowRight /></Link><p>Pick a direction. We made room for all of them.</p></div>
      <div className="category-grid">{categories.map((category, index) => <motion.div key={category.title} className={`category-card ${category.style}`} whileHover={{ y: -6, rotate: index % 2 ? 1 : -1 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}>
        <Link to={`/shop?category=${encodeURIComponent(category.category)}`} className="category-link"><img src={category.image} alt={`${category.title} clothing and style`} loading="lazy" /><div className="category-shade" /><span className="category-index">0{index + 1} / 04</span><span className="category-caption"><small>{category.caption}</small><strong>{category.title}<i><ArrowUpRight /></i></strong></span></Link>
      </motion.div>)}</div>
    </section>

    <section className="ring-section"><div className="ring-section-top page-gutter"><span className="eyebrow">A 360° LITTLE MOODBOARD</span><Link to="/shop" className="text-link">Shop the full collection <ArrowRight /></Link></div>
      <div className="ring-stage"><div className="ring-glow"/><div className="collection-ring" aria-label="Rotating collection preview">{wheelItems.map((item, index) => <Link className="ring-item" to={`/product/${item.id}`} key={item.id} style={{ '--i': index } as React.CSSProperties}><img src={item.image} alt={item.title} loading="lazy" /><span>{item.title}</span></Link>)}</div>
        <div className="ring-center"><span className="eyebrow">THIS SEASON, ON REPEAT</span><h2>Find your<br /><em>own orbit.</em></h2><Link to="/shop" className="ring-center-link">See what moves you <ArrowRight /></Link></div>
      </div>
      <div className="ring-footer page-gutter"><span><i className="ring-dot" /> TAP ANY PIECE TO MAKE IT YOURS</span><span>01 — 08 <ChevronLeft /><ChevronRight /></span></div>
    </section>

    <section ref={storyRef} className="story-section page-gutter"><div className="story-visual">
      <motion.div className="story-photo story-photo--back" style={{ backgroundImage: 'url(/images/fashion/fashion-05.webp)', y: backY, rotate: -5 }} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} />
      <motion.div className="story-photo story-photo--front" style={{ backgroundImage: 'url(/images/fashion/fashion-11.webp)', y: frontY, rotate: frontRotate }} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} />
      <motion.div className="story-orbit-note" animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} aria-hidden="true"><span>FEEL GOOD IN YOUR OWN SKIN ✳ FEEL GOOD IN YOUR OWN SKIN ✳ </span></motion.div>
      <div className="story-cutout"><span>LW</span><i>made of<br />everyday</i></div>
    </div><Reveal className="story-copy"><span className="eyebrow">A SMALL NOTE FROM US</span><h2>Clothes can’t<br />change your life.<br /><em>But they can<br />change your day.</em></h2><p>We think the best outfit is the one you forget you’re wearing — until a window catches your reflection and you think, yes. That’s me.</p><p>So we choose pieces with feeling. Soft where they should be. Certain where it counts. Ready for the life you’re already living.</p><Link to="/shop" className="text-link">Get dressed for your day <ArrowRight /></Link><span className="story-signature">with love, the LuxeWear team <b>✳</b></span></Reveal></section>

    <section className="featured-section page-gutter"><SectionHeading eyebrow="THINGS WE’RE INTO RIGHT NOW" title={<>The good <em>stuff.</em></>} text="A handful of favourites, ready to meet you." link="/shop" /><ProductGrid items={featured} /></section>

    <section className="offer-section page-gutter"><div className="offer-panel"><div className="offer-sparkle" aria-hidden="true">✳</div><span className="eyebrow eyebrow--light">A LITTLE SOMETHING, ON US</span><h2>Good things<br />come <em>back around.</em></h2><p>Take 10% off your first good thing.<br />Use code <strong>DEMO10</strong> at the bag.</p><Button to="/shop" kind="soft">Find your first thing <ArrowRight /></Button><span className="offer-giant">10<span>%</span></span><div className="offer-orbit" /></div></section>

    <section className="review-section page-gutter"><div className="review-heading"><span className="eyebrow">REAL PEOPLE, REAL FEELINGS</span><h2>“I’ll probably<br /><em>wear it tomorrow.”</em></h2><div className="review-rating"><span>★★★★★</span> <b>4.9</b> from 200+ lovely humans</div><div className="review-controls"><button onClick={() => setReview((review + quotes.length - 1) % quotes.length)} aria-label="Previous review"><ChevronLeft /></button><button onClick={() => setReview((review + 1) % quotes.length)} aria-label="Next review"><ChevronRight /></button></div></div>
      <motion.article className="review-card" key={review} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}><span className="review-quote-mark">“</span><div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} fill="currentColor" />)}</div><blockquote>{quotes[review].quote}</blockquote><div className="review-person"><div className="review-avatar">{quotes[review].name.slice(0, 1)}</div><div><b>{quotes[review].name}</b><span>{quotes[review].city} · Bought {quotes[review].product}</span></div><span className="verified-pill">VERIFIED BUYER</span></div></motion.article>
      <div className="review-photo"><img src="/images/fashion/fashion-04.webp" alt="People wearing expressive streetwear together" loading="lazy" /><span>STYLE IS A<br /><i>feeling</i><br />FIRST.</span><Play aria-hidden="true" /></div></section>

    <section className="newsletter-section page-gutter"><Reveal className="newsletter-panel"><div className="newsletter-orbit" aria-hidden="true">✳</div><span className="eyebrow">THE OCCASIONAL GOOD EMAIL</span><h2>In your inbox,<br /><em>not in your way.</em></h2><p>New things, good stories, and the odd treat. Only when it’s worth opening.</p>{joined ? <div className="newsletter-success"><Heart fill="currentColor" /> You’re on the list. Something good is on its way.</div> : <form onSubmit={(event) => { event.preventDefault(); if (email.trim()) setJoined(true); }} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit">Count me in <ArrowRight /></button></form>}<span className="newsletter-fineprint">No noise. Unsubscribe whenever.</span></Reveal><div className="newsletter-photo"><img src="/images/fashion/fashion-13.webp" alt="Thoughtfully styled clothing laid out for an editorial" loading="lazy" /><span className="photo-label">A note for<br />your next day <b>↗</b></span></div></section>
  </>;
}
