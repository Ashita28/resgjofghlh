import React from 'react'
import { chefs, clients, currency, orderIcon } from '../assets'
import styles from './componentStyles/details.module.css'

const DetailsCard = () => {

  const details = [{key: 'chefs', icon : chefs, qnt: '04', datatype : 'Total Chefs'},
                    {key: 'revenue', icon : currency, qnt: '12K', datatype : 'Total Revenue'},
                    {key: 'orders', icon : orderIcon, qnt: '20', datatype : 'Total Orders'},
                    {key: 'clients', icon : clients, qnt: '65', datatype : 'Total clients'}]
  return (
    <div className={styles.detailsCard}>
      <ul className={styles.detailsList}>
        {details.map(({key, icon, qnt, datatype}) => (
          <li key={key} className={styles.detailItem}>
            <img src={icon} alt={datatype}/>

            <div>
            <h3>{qnt}</h3>
            <p>{datatype}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DetailsCard
