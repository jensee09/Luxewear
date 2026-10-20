import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../store/use-store';
import { ProductGrid } from '../components/ui';
import { Button } from '../components/ui';

const categories = ['All', 'Women', 'Men', 'Kids', 'Unisex'];
export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const category = searchParams.get('category') ?? 'All';
  const filtered = useMemo(() => {
    const result = products.filter((item) => (category === 'All' || item.category === category) && item.price <= maxPrice && (`${item.title} ${item.category} ${item.tag} ${item.description}`).toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'top-rated') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') result.sort((a, b) => Number(b.tag.includes('NEW') || b.tag.includes('JUST')) - Number(a.tag.includes('NEW') || a.tag.includes('JUST')));
    return result;
  }, [category, query, sort, maxPrice]);
  const setCategory = (value: string) => { const next = new URLSearchParams(searchParams); value === 'All' ? next.delete('category') : next.set('category', value); setSearchParams(next); };
  return <div className="shop-page page-gutter"><section className="shop-hero"><div><span className="eyebrow">THE LUXEWEAR COLLECTION</span><h1>Wear what<br /><em>moves you.</em></h1><p>Pieces to make the everyday feel a little more like yours.</p></div><div className="shop-hero-image"><img src="/images/fashion/fashion-05.webp" alt="LuxeWear fashion collection" /><span>ISSUE NO. 01<br /><b>THE FEEL-GOOD EDIT</b></span></div></section>
    <div className="shop-toolbar"><div className="shop-search"><Search /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by feeling, fit, or favourite…" aria-label="Search products" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}</div><button className={`filter-toggle ${showFilters ? 'is-active' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}><SlidersHorizontal /> Filters</button><label className="sort-select"><ArrowDownWideNarrow /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">New arrivals</option><option value="top-rated">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>
    <div className={`shop-filter-row ${showFilters ? 'is-open' : ''}`}><div className="category-filters" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'is-active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="price-filter"><span>Up to ₹{maxPrice.toLocaleString('en-IN')}</span><input type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /></label></div>
    <div className="shop-results-bar"><p><strong>{filtered.length}</strong> lovely {filtered.length === 1 ? 'thing' : 'things'}{category !== 'All' ? ` for ${category.toLowerCase()}` : ''}</p>{(category !== 'All' || query || maxPrice < 5000) && <button className="clear-filters" onClick={() => { setQuery(''); setCategory('All'); setMaxPrice(5000); }}>Clear filters <X /></button>}</div>
    {filtered.length ? <ProductGrid items={filtered} /> : <div className="empty-state shop-empty"><span className="empty-orbit">✳</span><h2>Nothing here <em>just yet.</em></h2><p>Try a different search or let’s start fresh.</p><Button onClick={() => { setQuery(''); setCategory('All'); setMaxPrice(5000); }}>See everything <ArrowRight /></Button></div>}
    <div className="shop-bottom-note"><span>✳</span><p>Every piece has a story. Yours is next.</p><span>✳</span></div>
  </div>;
}
