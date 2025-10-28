import React, { useState } from 'react'
import { Navbar } from './components'
import { Analytics, Orders, Products, Tables } from './pages'
import styles from './layout.module.css'
import { analytics_icon, orders, products, tables } from './assets'

const MainLayout = () => {
  const [selectedPage, setSelectedPage] = useState("analytics");

  const handleSelectPage = (page) => {
    setSelectedPage(page);
  };

  const sidebarItems = [
    { key: "analytics", icon: analytics_icon, alt: "Analytics" },
    { key: "tables", icon: tables, alt: "Tables" },
    { key: "orders", icon: orders, alt: "Orders" },
    { key: "products", icon: products, alt: "Products" },
  ];

  // ✅ Create a component map
  const pageComponents = {
    analytics: <Analytics />,
    tables: <Tables />,
    orders: <Orders />,
    products: <Products />,
  };

  return (
    <div className={styles.layoutContainer}>
  <Navbar selectedPage={selectedPage} />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <ul>
            {sidebarItems.map(({ key, icon, alt }) => (
              <li
                key={key}
                onClick={() => handleSelectPage(key)}
                className={`${styles.sidebarItem} ${selectedPage === key ? styles.active : ''}`}
              >
                <img src={icon} alt={alt} className={styles.icon} />
              </li>
            ))}
          </ul>

          <div className={styles.blankCircle}></div>
        </aside>

        {/* ✅ Only this section changes dynamically */}
        <div className={styles.mainContent}>
          {pageComponents[selectedPage]}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
