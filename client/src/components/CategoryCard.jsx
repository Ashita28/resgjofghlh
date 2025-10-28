import React from 'react';
import styles from './componentsStyles/categoryCard.module.css'


const CategoryCard = ({ data = [] }) => {
  return (
    <div className={styles.categoryContainer}>
      {data.map((productData, idx) => (
        <div className={styles.card} key={`${productData.label}-${idx}`} title={productData.label}>
          <img src={productData.image} alt={productData.label} />
          <p>{productData.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
