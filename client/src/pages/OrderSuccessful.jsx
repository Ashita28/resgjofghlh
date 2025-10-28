import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { check } from '../assets';
import styles from './pagesStyles/success.module.css';

const OrderSuccessful = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          navigate('/'); // redirect target
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={styles.successPage} role="status" aria-live="polite">
      <div className={styles.centerWrap}>
        <h1 className={styles.title}>Thanks For Ordering</h1>

        <div className={styles.checkWrap}>
          <img src={check} alt="" className={styles.checkIcon} />
        </div>
      </div>

      <p className={styles.countdown}>Redirecting in {seconds}</p>
    </div>
  );
};

export default OrderSuccessful;
