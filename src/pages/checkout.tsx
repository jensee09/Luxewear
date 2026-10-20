import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, MapPin, PackageCheck, Truck } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { findProduct, totalsFor, type DeliveryAddress, type Order, useStore } from '../store/use-store';
import { Button } from '../components/ui';
import { formatRupees } from '../components/layout';

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Please add your full name.'),
  phone: z.string().regex(/^\d{10}$/, 'Use a 10-digit mobile number.'),
  email: z.string().trim().email('Add a valid email address.'),
  address: z.string().trim().min(8, 'Add a little more detail to the address.'),
  city: z.string().trim().min(2, 'Please add your city.'),
  state: z.string().trim().min(2, 'Please add your state.'),
  pin: z.string().regex(/^\d{6}$/, 'Use a 6-digit PIN code.'),
});
type FormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const promoApplied = useStore((state) => state.promoApplied);
  const addOrder = useStore((state) => state.addOrder);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const totals = useMemo(() => totalsFor(cart, promoApplied), [cart, promoApplied]);
  const [startedWithItems] = useState(() => cart.length > 0);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: { fullName: '', phone: '', email: '', address: '', city: '', state: '', pin: '' },
  });

  const field = (name: keyof FormValues, label: string, placeholder: string, type = 'text', inputMode?: 'numeric' | 'text' | 'email' | 'tel') => <label className={`form-field ${errors[name] ? 'has-error' : ''}`}>
    <span>{label}</span>
    <input {...register(name)} type={type} inputMode={inputMode} placeholder={placeholder} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />
    {errors[name] && <small id={`${name}-error`} className="field-error" role="alert">{errors[name]?.message}</small>}
  </label>;

  const onSubmit = (values: FormValues) => {
    const date = new Date();
    const delivery = new Date(date.getTime() + 4 * 24 * 60 * 60 * 1000);
    const eta = delivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
    const address: DeliveryAddress = values;
    const order: Order = {
      id: `LW-${date.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [...cart],
      ...totals,
      address,
      placedAt: date.toISOString(),
      eta,
      status: 0,
    };
    setUser(values.fullName, values.email);
    addOrder(order);
    navigate(`/order-success/${order.id}`);
  };

  if (!startedWithItems) return <Navigate to="/cart" replace />;

  return <div className="checkout-page page-gutter">
    <Link to="/cart" className="back-link"><ArrowLeft /> Back to your bag</Link>
    <div className="page-title-block">
      <span className="eyebrow">ONE LAST LITTLE THING</span>
      <h1>Where should we <em>find you?</em></h1>
      <p>Just your delivery details, then your good things are on their way.</p>
    </div>

    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="form-section">
          <div className="form-section-heading"><span className="form-step">01</span><div><h2>Your <em>details.</em></h2><p>The basics, please.</p></div></div>
          <div className="form-grid">
            {field('fullName', 'Full name', 'What should we call you?')}
            {field('phone', 'Mobile number', '10-digit number', 'tel', 'numeric')}
            {field('email', 'Email address', 'For order updates', 'email', 'email')}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><span className="form-step">02</span><div><h2>A good place to <em>land.</em></h2><p>Where your parcel should find you.</p></div><MapPin /></div>
          {field('address', 'Street address', 'House, building, street, and area')}
          <div className="form-grid form-grid--three">
            {field('city', 'City', 'Your city')}
            {field('state', 'State', 'Your state')}
            {field('pin', 'PIN code', '6 digits', 'text', 'numeric')}
          </div>
        </section>

        <section className="payment-section">
          <div className="form-section-heading"><span className="form-step">03</span><div><h2>Easy on the <em>paying.</em></h2><p>One nice thing: you pay when it arrives.</p></div></div>
          <div className="cod-selected"><span className="cod-check"><Check /></span><span className="cod-cash-icon">₹</span><span><b>Cash on delivery</b><small>Hand over cash when your order reaches you.</small></span><span className="cod-selected-label">ONLY OPTION</span></div>
          <p className="payment-security"><LockKeyhole /> Your details stay in this browser — this is a local demo checkout.</p>
        </section>

        <Button type="submit" className="place-order-button" disabled={isSubmitting}>Place my order <ArrowRight /></Button>
        <p className="order-terms">By placing the order, you’re asking us to bring these pieces to your door. No card, no prepayment, no surprises.</p>
      </form>

      <aside className="order-summary checkout-summary">
        <div className="summary-header"><span className="eyebrow">THE DETAILS BEFORE THE DETAILS</span><h2>Your order.</h2></div>
        <div className="checkout-items">{cart.map((line) => {
          const product = findProduct(line.productId);
          if (!product) return null;
          return <div className="checkout-item" key={`${product.id}-${line.size}`}>
            <div className="checkout-item-image"><img src={product.image} alt="" /><b>{line.quantity}</b></div>
            <div><b>{product.title}</b><small>{product.category} · size {line.size}</small></div>
            <strong>{formatRupees(product.price * line.quantity)}</strong>
          </div>;
        })}</div>
        <div className="summary-row"><span>Subtotal</span><b>{formatRupees(totals.subtotal)}</b></div>
        {promoApplied && <div className="summary-row"><span>DEMO10 saving</span><b className="saving-value">−{formatRupees(totals.discount)}</b></div>}
        <div className="summary-row"><span>Delivery</span><b>{totals.shipping ? formatRupees(totals.shipping) : <span className="free-label">FREE</span>}</b></div>
        <div className="summary-row"><span>Cash on delivery</span><b>{formatRupees(totals.codFee)}</b></div>
        <div className="summary-total"><span>Pay on arrival</span><strong>{formatRupees(totals.total)}</strong></div>
        <div className="delivery-estimate"><PackageCheck /><span><b>Just a little while</b><small>Estimated to arrive in 4–6 days</small></span></div>
        <div className="checkout-assurances"><span><Check /> Carefully packed</span><span><Truck /> Sent with care</span></div>
      </aside>
    </div>
  </div>;
}
