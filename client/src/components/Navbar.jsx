import React from 'react'
import styles from './componentsStyles/nav.module.css'
import { search_icon } from '../assets'

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <section className={styles.header}>
        <h1>Good evening</h1>
        <p>Place you order here </p>
      </section>

      <section className={styles.search}>
        <img src={search_icon} alt='search icon'/>
        <input type='text' placeholder='Search'/>
      </section>
    </nav>
  )
}

export default Navbar
