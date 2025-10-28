// src/pages/Home.jsx
import React, { useMemo, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { CategoryCard, ProductCard, EnterDetails } from '../components';
import { burger_icon, drinks, fries, salads, sandwiches, desserts } from '../assets';
import styles from './pagesStyles/home.module.css';
import { useGetFoodsQuery } from '../redux/productApi';
import { useCart } from '../context/CartContext';

const Home = () => {
  const navigate = useNavigate();

  const toOrderPage = () => {
    navigate('/order');
  }

  const categories = [
    { image: burger_icon, label: 'burger' },
    { image: drinks, label: 'drinks' },
    { image: fries, label: 'fries' },
    { image: salads, label: 'salads' },
    {image: sandwiches, label: 'sandwiches'},
    {image: desserts, label: 'desserts'}
  ];

  const [isVisible, setIsVisible] = useState(true);
  const handleVisibility = () => setIsVisible(false);

  const [activeCategory, setActiveCategory] = useState('burger'); // default tab
  const { addItem } = useCart();

  // ✅ RTK Query hook replaces manual fetch
  const { data, isLoading, isError, error } = useGetFoodsQuery({
    category: activeCategory,
    inStock: 'true',
    limit: 20,
    sort: '-createdAt',
  });

  const foods = data?.items || [];

  const heading = useMemo(() => {
    if (!activeCategory) return 'Products';
    return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  }, [activeCategory]);

  const onSelectCategory = (c) => setActiveCategory(c?.label || c);

  return (
    <div className={styles.homePage}>
      <section className={styles.categorySection}>
        <CategoryCard data={categories} onSelect={onSelectCategory} active={activeCategory} />
      </section>

      <section className={styles.productContainer}>
        <h1>{heading}</h1>

        {isLoading && <p>Loading...</p>}
        {isError && <p style={{ color: 'crimson' }}>{error?.data?.error || 'Error loading foods'}</p>}
        {!isLoading && !isError && foods.length === 0 && <p>No products available.</p>}

        {!isLoading && !isError && foods.length > 0 && (
          <ProductCard
            products={foods.map((f) => ({
              id: f._id,
              image: f.itemImage,
              name: f.name,
              price: f.price,
              desc: f.description,
              avgPrepTime: f.avgPrepTime,
              rating: f.rating,
              stock: f.stock,
            }))}
            onAdd={(item) => {
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                avgPrepTime: item.avgPrepTime,
              });
            }}
          />
        )}
      </section>

      <button onClick={toOrderPage} className={styles.nextButton}>Next</button>

      {isVisible && (
        <div className={styles.enterDetailsWrapper}>
          <EnterDetails onClose={handleVisibility} />
        </div>
      )}
    </div>
  );
};

export default Home;
