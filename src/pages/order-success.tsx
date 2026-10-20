import { motion } from 'motion/react';
import { ArrowRight, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { findProduct, useStore } from '../store/use-store';
import { Button } from '../components/ui';
import { formatRupees } from '../components/layout';
import type * as React from 'react';

export function OrderSuccessPage() {
  const { id = '' } = useParams();
  const order = useStore((state) => state.orders.find((item) => item.id === id));
  if (!order) return <Navigate to="/account" replace />;
  return <div className="success-page page-gutter"><div className="confetti-field" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <motion.i key={index} style={{ '--n': index } as React.CSSProperties} initial={{ y: -18, opacity: 0, rotate: 0 }} animate={{ y: 0, opacity: 1, rotate: (index % 2 ? 40 : -40) }} transition={{ delay: index * 0.05, duration: .8 }}>{['✳', '✦', '·', '●'][index % 4]}</motion.i>)}</div><div className="success-card"><motion.div className="success-mark" initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: .14, stiffness: 180, damping: 13 }}><Sparkles /></motion.div><span className="eyebrow">AND JUST LIKE THAT…</span><h1>Good things are <em>coming.</em></h1><p>We’ve got your order. You’ve got excellent taste.</p><div className="order-id-block"><span>YOUR ORDER NUMBER</span><b>{order.id}</b><small>A little note will find you at {order.address.email}.</small></div><div className="eta-card"><PackageCheck /><span><b>Estimated arrival</b><small>{order.eta} · give or take a day</small></span><span className="eta-pill">ON ITS WAY SOON</span></div><div className="success-summary"><span>{order.items.reduce((sum, line) => sum + line.quantity, 0)} pieces, packed with care</span><b>{formatRupees(order.total)} <small>· cash on delivery</small></b></div><div className="success-actions"><Button to="/account">Follow its journey <ArrowRight /></Button><Link to="/shop" className="quiet-link">Keep a good thing going <ShoppingBag /></Link></div><Link className="tiny-account-link" to="/account">Your order lives in <u>your account</u></Link></div><div className="success-wear-next"><span>✳</span> AN OUTFIT IS A PLAN FOR A GOOD DAY <span>✳</span></div></div>;
}
