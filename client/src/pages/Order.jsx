// src/pages/Order.jsx
import React, { useEffect, useRef, useState } from 'react';
import OrderCard from '../components/OrderCard';
import { location_icon, timer_icon, fwd_icon } from '../assets';
import styles from './pagesStyles/order.module.css';
import AddInstructions from '../components/AddInstructions';
import { useCart } from '../context/CartContext';
import { useCreateOrderMutation, getUserId } from '../redux/orderApi';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'

  const { cart, inc, dec, removeItem, totals, clear } = useCart();
  const { itemTotal, delivery, taxes, grandTotal } = totals;

  const [createOrder, { isLoading: placing, error: placeErr }] = useCreateOrderMutation();
  const navigate = useNavigate();

  // ----- swipe refs/state
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const textRef = useRef(null);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);
  const maxXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const placedRef = useRef(false);

  // lock/unlock background scroll when modal is open
  useEffect(() => {
    if (showInstructions) document.body.classList.add('noScroll');
    else document.body.classList.remove('noScroll');
    return () => document.body.classList.remove('noScroll');
  }, [showInstructions]);

  const handlePlaceOrder = async () => {
    if (!cart.items.length || placing || placedRef.current) return;

    const user = getUserId();
    if (!user) {
      console.error('Missing user id. Set localStorage "user_id" or VITE_DEMO_USER_ID.');
      return;
    }

    const payload = {
      user,
      items: cart.items.map((it) => ({ food: it.id, qnt: it.qty })),
      orderType,
      note: instructions,
      tax: Number(taxes || 0),
      delivery: Number(delivery || 0),
    };

    try {
      placedRef.current = true; // avoid duplicate posts
      const resp = await createOrder(payload).unwrap();
      clear();
      // set success style
      if (trackRef.current) trackRef.current.classList.add(styles.swiped);
      navigate('/success', { state: { orderId: resp?.order?._id } });
    } catch (e) {
      placedRef.current = false;
      console.error(e);
    }
  };

  // ----- swipe logic using Pointer Events (no preventDefault needed)
  useEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;

    const trackRect = () => track.getBoundingClientRect();
    const knobRect = () => knob.getBoundingClientRect();

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      // we rely on CSS `touch-action: none` to prevent scrolling,
      // so no e.preventDefault() here (avoids passive error)
      const dx = e.clientX - startXRef.current;
      const next = clamp(startLeftRef.current + dx, 0, maxXRef.current);
      knob.style.transform = `translateX(${next}px)`;

      // fade label as we progress
      if (textRef.current) {
        const ratio = next / maxXRef.current || 0;
        textRef.current.style.opacity = String(1 - Math.min(1, ratio * 1.2));
      }

      // if reached end, commit
      if (next >= maxXRef.current) {
        isDraggingRef.current = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        handlePlaceOrder();
      }
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);

      // snap back if not completed
      knob.style.transition = 'transform 0.25s ease';
      knob.style.transform = 'translateX(0px)';
      if (textRef.current) {
        textRef.current.style.transition = 'opacity 0.25s ease';
        textRef.current.style.opacity = '1';
      }
      // remove transitions after snap
      const tid = setTimeout(() => {
        knob.style.transition = '';
        if (textRef.current) textRef.current.style.transition = '';
      }, 260);
      return () => clearTimeout(tid);
    };

    const onPointerDown = (e) => {
      if (placing || placedRef.current) return; // block when busy/placed
      // compute bounds
      const tr = trackRect();
      const kr = knobRect();
      maxXRef.current = Math.max(0, tr.width - kr.width - 8); // small right padding

      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      // parse current translateX (may be empty)
      const m = (knob.style.transform || '').match(/translateX\(([-0-9.]+)px\)/);
      startLeftRef.current = m ? parseFloat(m[1]) : 0;

      // capture pointer
      knob.setPointerCapture?.(e.pointerId);

      document.addEventListener('pointermove', onPointerMove, { passive: false });
      document.addEventListener('pointerup', onPointerUp, { passive: true });
    };

    knob.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      knob.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [placing, cart.items.length]); // rebind if placing state changes

  const isDisabled = placing || cart.items.length === 0;

  return (
    <div className={styles.orderPage}>
      {/* Cart items */}
      <section className={styles.orderCardContainer}>
        {cart.items.length === 0 ? (
          <p>No items yet. Add from the menu.</p>
        ) : (
          cart.items.map((it) => (
            <OrderCard
              key={it.id}
              id={it.id}
              name={it.name}
              price={it.price}
              image={it.image}
              qty={it.qty}
              onInc={inc}
              onDec={dec}
              onRemove={removeItem}
            />
          ))
        )}
      </section>

      {!!placeErr && (
        <p style={{ color: 'crimson', margin: '0.5rem 1rem' }}>
          {placeErr?.data?.error || 'Failed to place order.'}
        </p>
      )}

      <button
        type="button"
        className={styles.addNote}
        onClick={() => setShowInstructions(true)}
        aria-haspopup="dialog"
        aria-controls="add-instructions-sheet"
      >
        Add cooking instructions (optional)
      </button>

      {/* Dine In / Take Away */}
      <section className={styles.orderType}>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${orderType === 'dine-in' ? styles.active : ''}`}
            aria-selected={orderType === 'dine-in'}
            onClick={() => setOrderType('dine-in')}
            type="button"
          >
            Dine In
          </button>
          <button
            className={`${styles.toggleBtn} ${orderType === 'takeaway' ? styles.active : ''}`}
            aria-selected={orderType === 'takeaway'}
            onClick={() => setOrderType('takeaway')}
            type="button"
          >
            Take Away
          </button>
        </div>
      </section>

      {/* Bill */}
      <section className={styles.billContainer}>
        <div>
          <div className={styles.billRow}>
            <p>Item Total</p>
            <p>₹{itemTotal.toFixed(2)}</p>
          </div>

          <div className={`${styles.billRow} ${styles.dotted}`}>
            <p>Delivery Charge</p>
            <p>₹{delivery.toFixed(2)}</p>
          </div>

          <div className={styles.billRow}>
            <p>Taxes</p>
            <p>₹{taxes.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.billTotal}>
          <p>Grand Total</p>
          <p>₹{grandTotal.toFixed(2)}</p>
        </div>
      </section>

      {/* Details */}
      <section className={styles.userDetails}>
        <p className={styles.detailsTitle}>Your details</p>
        <p className={styles.person}>Divya Sigatapu, 9109109109</p>
      </section>

      <section className={styles.address}>
        <div className={styles.addrRow}>
          <img src={location_icon} alt="location icon" />
          <p>Delivery at Home - Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...</p>
        </div>

        <div className={styles.addrRow}>
          <img src={timer_icon} alt="timer icon" />
          <p>
            Delivery in <strong>42 mins</strong>
          </p>
        </div>
      </section>

      {/* Swipe to Order */}
      <section className={styles.swipeToOrder}>
        <button
          ref={trackRef}
          type="button"
          className={styles.swipeBtn}
          disabled={isDisabled}
          aria-busy={placing}
          title={
            cart.items.length === 0
              ? 'Add items to place order'
              : placing
              ? 'Placing...'
              : 'Swipe to Order'
          }
        >
          <div ref={knobRef} className={styles.swipeIcon}>
            <img src={fwd_icon} alt="fwd arrow" />
          </div>
          <span ref={textRef} className={styles.swipeText}>
            {placing ? 'Placing...' : 'Swipe to Order'}
          </span>
        </button>
      </section>

      {/* Bottom Sheet Modal */}
      {showInstructions && (
        <AddInstructions
          id="add-instructions-sheet"
          initialValue={instructions}
          onClose={() => setShowInstructions(false)}
          onCancel={() => setShowInstructions(false)}
          onSubmit={(text) => {
            setInstructions(text);
            setShowInstructions(false);
          }}
        />
      )}
    </div>
  );
};

export default Order;
