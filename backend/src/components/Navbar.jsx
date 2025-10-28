import React from 'react'
import styles from './componentStyles/nav.module.css'
import { down_arrow, logo } from '../assets'

const Navbar = ({ selectedPage = 'analytics' }) => {

  const placeholders = {
    analytics: 'Filter...',
    products: 'Search',
  }

  const placeholder = placeholders[selectedPage] || 'Filter...'

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt='logo' />
      </div>

      {/* ✅ Conditional display logic */}
      {selectedPage === 'orders' ? (
        <h1 className={styles.orderHeading}>Order Line</h1>
      ) : (
        selectedPage !== 'tables' && (
          <div className={styles.searchBox}>
            <input placeholder={placeholder} />
            <div>
              <img src={down_arrow} alt='downward arrow' />
            </div>
          </div>
        )
      )}
    </nav>
  )
}

export default Navbar
