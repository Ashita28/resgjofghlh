// RevenueCard.jsx
import React from 'react'
import styles from './componentStyles/revenueCard.module.css'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

const RevenueCard = () => {
  const options = ['Daily', 'Weekly', 'Monthly', 'Yearly']

  // Bar series (soft background columns) + line series (black curve)
  const data = [
    { day: 'Mon', bar: 12, value: 12 },
    { day: 'Tue', bar: 22, value: 24 },
    { day: 'Wed', bar: 18, value: 19 },
    { day: 'Thur', bar: 26, value: 28 },
    { day: 'Fri', bar: 16, value: 18 },
    { day: 'Sat', bar: 34, value: 36 }, // highlighted column
    { day: 'Sun', bar: 24, value: 26 },
  ]

  const highlightDay = 'Sat'

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3>Revenue</h3>
          <p>hijokplrngntop[gtgkoikokyhikoy[phokphnoy</p>
        </div>

        <select className={styles.dropDown}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className={styles.plotCard}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 16, bottom: 12, left: 12 }}
          >
            {/* X axis with day labels; hide Y axis for a clean look */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: '#9aa0a6', fontSize: 12 }}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />

            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #eee' }}
              labelStyle={{ color: '#7b7e81' }}
              formatter={(val, name) =>
                name === 'value' ? [`${val}`, 'Revenue'] : [`${val}`, 'Bar']
              }
            />

            {/* Background bars (behind the line) */}
            <Bar dataKey="bar" barSize={26} radius={[8, 8, 8, 8]}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.day === highlightDay ? '#e8e8e8' : '#f6f6f6'}
                />
              ))}
            </Bar>

            {/* Smooth black line on top */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#222"
              strokeWidth={3}
              dot={false}
              strokeLinecap="round"
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueCard
