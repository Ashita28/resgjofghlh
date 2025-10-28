import React from 'react'
import styles from './componentStyles/tableAssign.module.css'

const TableAssign = () => {
  // 1..31 tables
  const tables = Array.from({ length: 31 }, (_, i) => i + 1)

  // sample reserved set (match your mock; tweak as needed)
  const reserved = new Set([4,5,7,9,12,14,17,21,22,26,28,29,30])

  const twoDigit = (n) => n.toString().padStart(2, '0')

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Tables</h3>

        {/* 🔒 header kept untouched */}
        <div className={styles.headerContent}>
          <div className={styles.sub}>
            <div className={styles.reserved}></div>
            <p>Reserved</p>
          </div>

          <div className={styles.sub}>
            <div className={styles.avail}></div>
            <p>Available</p>
          </div>
        </div>
      </div>

      {/* Grid of tables */}
      <div className={styles.grid}>
        {tables.map((n) => {
          const isReserved = reserved.has(n)
          return (
            <div
              key={n}
              className={`${styles.tableBox} ${
                isReserved ? styles.tableReserved : styles.tableAvailable
              }`}
            >
              <span className={styles.tableLabel}>Table</span>
              <span className={styles.tableNum}>{twoDigit(n)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TableAssign
