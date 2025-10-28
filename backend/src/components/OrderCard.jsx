// OrderCard.jsx
import React from 'react';
import styles from './componentStyles/orderCard.module.css';
import { timerIcon, foodIcon, dineDone, takeaway } from '../assets';

const OrderCard = ({ orderDetails }) => {
  if (!orderDetails) return <div className={styles.card}>No order details</div>;

  const { orderId, tableNo, orderTime, orderType, items = [], orderStatus } = orderDetails;

  // normalized keys
  const statusKey = (orderStatus || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const typeKey   = (orderType   || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // base classes
  const cardBase     = styles.orderCard;
  const statusClass  = styles[statusKey] || '';
  const typeClass    = styles[typeKey]   || '';

  // combined (must come AFTER base so it wins)
  const combinedCardClass = styles[`${statusKey}${cap(typeKey)}`] || '';

  // orderType header box
  const typeSecClass          = styles[`orderType${cap(typeKey)}`] || '';
  const typeSecCombinedClass  = styles[`orderType${cap(typeKey)}Status${cap(statusKey)}`] || '';

  // status pill
  const statusLabelClass      = styles[`status${statusKey}`] || '';
  const statusLabelComboClass = styles[`status${statusKey}${cap(typeKey)}`] || '';

  const isCompleted = statusKey === 'completed';
  const isDineIn    = typeKey   === 'dinein';
  const isTakeaway  = typeKey   === 'takeaway';

  let statusIcon = timerIcon;
  if (isCompleted && isDineIn) statusIcon = dineDone;
  else if (isCompleted && isTakeaway) statusIcon = takeaway;

  const itemsCountText = `${items.length} ${items.length === 1 ? 'Item' : 'Items'}`;

  return (
    <div className={`${cardBase} ${typeClass} ${statusClass} ${combinedCardClass}`}>
      <div className={styles.cardHeader}>
        <div className={styles.orderInfo}>
          <div>
            <div className={styles.orderIdSection}>
              <img src={foodIcon} alt="food" />
              <h3># {orderId}</h3>
            </div>

            <div className={styles.tableAndTime}>
              <p>Table-0{tableNo}</p>
              <p>{orderTime}</p>
            </div>
          </div>

          <div className={`${styles.orderTypeSec} ${typeSecClass} ${typeSecCombinedClass}`}>
            {isCompleted && isDineIn ? (
              <>
                <p>Done</p>
                <p>Served</p>
              </>
            ) : isCompleted && isTakeaway ? (
              <>
                <p>Take Away</p>
                <p>Not Picked up</p>
              </>
            ) : (
              <>
                <p>{orderType}</p>
                <p>Ongoing: 4 Min</p>
              </>
            )}
          </div>
        </div>

        <h4>{itemsCountText}</h4>
      </div>

      <div className={styles.itemList}>
        <ul>
          {items.map((it, idx) => {
            const qty = it.quantity ?? it.quntity ?? 1; // robust against typo
            return <li key={idx}>{qty} × {it.name}</li>;
          })}
        </ul>
      </div>

      <div className={`${styles.statusLabel} ${statusLabelClass} ${statusLabelComboClass}`}>
        <p>{orderStatus}</p>
        <img src={statusIcon} alt={orderStatus} />
      </div>
    </div>
  );
};

export default OrderCard;
