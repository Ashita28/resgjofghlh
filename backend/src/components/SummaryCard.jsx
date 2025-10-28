import React from 'react'
import styles from './componentStyles/summaryCard.module.css'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ...imports stay the same

const SummaryCard = () => {
  const options = ['Daily', 'Weekly', 'Monthly', 'Yearly']

  const data = [
    { name: 'Take Away', value: 24, color: '#999999' },
    { name: 'Served', value: 41, color: '#666666' },
    { name: 'Dine in', value: 39, color: '#333333' },
  ]

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3>Order Summary</h3>
          <p>hijokplrngntop[gtgkoikokyhikoy[phokphnoy</p>
        </div>

        <select className={styles.dropDown}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <div className={styles.orderDetail}>
          <div className={styles.detail}>
            <p>09</p>
            <p>Served</p>
          </div>

          <div className={styles.detail}>
            <p>05</p>
            <p>Dine in</p>
          </div>

          <div className={styles.detail}>
            <p>06</p>
            <p>Take Away</p>
          </div>
        </div>

        <div className={styles.visualData}>
          {/* Donut chart */}
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={4}
                cx="50%"
                cy="50%"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Data labels and bars (grid-based rows) */}
          <div className={styles.dataList}>
            {data.map((item) => (
              <div key={item.name} className={styles.dataRow}>
                <div className={styles.label}>{item.name}</div>
                <div className={styles.percent}>({item.value}%)</div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
