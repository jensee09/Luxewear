import { useState } from 'react';
import { ArrowRight, Check, Clock3, Heart, LogOut, PackageCheck, Sparkles, Truck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { findProduct, useStore } from '../store/use-store';
import { Button } from '../components/ui';
import { formatRupees } from '../components/layout';

const steps = [
  { label: 'Order placed', icon: <Check /> },
  { label: 'Getting ready', icon: <Sparkles /> },
  { label: 'On the way', icon: <Truck /> },
  { label: 'With you', icon: <PackageCheck /> },
];

export function AccountPage() {
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const wishlist = useStore((state) => state.wishlist);
  const setUser = useStore((state) => state.setUser);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const save = () => {
    if (name.trim() && email.includes('@')) {
      setUser(name.trim(), email.trim());
      setEditing(false);
    }
  };

  return <div className="account-page page-gutter">
    <div className="account-top">
      <div>
        <span className="eyebrow">A LITTLE SPACE, JUST FOR YOU</span>
        <h1>Hi, {user?.name?.split(' ')[0] || 'lovely'}.<br /><em>Good to see you.</em></h1>
        <p>One little place for your details, daydreams, and everything on its way.</p>
      </div>
      <div className="account-flower" aria-hidden="true">✳</div>
    </div>

    <div className="account-dashboard">
      <aside className="account-sidebar">
        <div className="account-user-card">
          <div className="account-avatar"><UserRound /></div>
          <span className="eyebrow">YOUR LUXEWEAR CORNER</span>
          {editing ? <div className="account-edit">
            <label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <button onClick={save}>Save changes <ArrowRight /></button>
          </div> : <>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <button className="edit-profile" onClick={() => setEditing(true)}>Edit your details <ArrowRight /></button>
          </>}
          <div className="account-badges">
            <span><PackageCheck /> {orders.length} orders</span>
            <span><Heart /> {wishlist.length} saved</span>
          </div>
        </div>

        <div className="account-help">
          <span>✳</span><b>Need a little help?</b>
          <p>A human can help with that.</p>
          <a href="mailto:hello@luxewear.example">Drop us a note <ArrowRight /></a>
        </div>
        <button className="mock-signout" onClick={() => setUser('Avery Morgan', 'avery@example.com')}><LogOut /> Reset demo profile</button>
      </aside>

      <section className="account-orders">
        <div className="account-orders-heading">
          <div><span className="eyebrow">THE GOOD THINGS, TRACKED</span><h2>Your <em>orders.</em></h2></div>
          <Link to="/shop" className="text-link">Find something new <ArrowRight /></Link>
        </div>
        {orders.length ? <div className="order-history">{orders.map((order) => <article className="history-card" key={order.id}>
          <div className="history-card-head">
            <div><span className="eyebrow">ORDER · {order.id}</span><small>Placed {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
            <strong>{formatRupees(order.total)}</strong>
          </div>
          <div className="history-items">{order.items.map((line) => {
            const product = findProduct(line.productId);
            return product ? <div key={`${order.id}-${line.productId}-${line.size}`}>
              <img src={product.image} alt="" />
              <span>{product.title}<small>{line.quantity} × {formatRupees(product.price)} · {line.size}</small></span>
            </div> : null;
          })}</div>
          <div className="status-heading"><span>YOUR ORDER’S LITTLE JOURNEY</span><span>{order.status >= 3 ? 'Delivered' : `Arriving around ${order.eta}`}</span></div>
          <div className="order-progress">{steps.map((step, index) => <div className={`progress-step ${index <= order.status ? 'is-done' : ''} ${index === order.status ? 'is-current' : ''}`} key={step.label}>
            <span className="progress-dot">{step.icon}</span><small>{step.label}</small>
          </div>)}</div>
          <div className="history-footer">
            <span><Clock3 /> Cash collected when it arrives</span>
            <Link to={`/order-success/${order.id}`}>View order <ArrowRight /></Link>
          </div>
        </article>)}</div> : <div className="empty-state orders-empty">
          <span className="empty-icon"><PackageCheck /></span>
          <h2>Nothing’s on its way <em>yet.</em></h2>
          <p>Your future favourites and their adventures will show up here.</p>
          <Button to="/shop">Make your first good order <ArrowRight /></Button>
        </div>}
      </section>
    </div>
  </div>;
}
