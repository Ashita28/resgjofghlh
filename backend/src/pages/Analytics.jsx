import React from 'react';
import { DetailsCard, RevenueCard, SummaryCard, TableAssign } from '../components';
import styles from './pagesStyles/analytics.module.css';
import ChefOrderTable from '../components/ChefOrderTable';

const Analytics = () => {
  return (
    <div className={styles.analyticsPage}>
      <header className={styles.heading}><h1>Analytics</h1></header>

      <DetailsCard/>

      <section className={styles.cards}>
        <SummaryCard/>
        <RevenueCard/>
        <div>
          <TableAssign/>
        </div>
      </section>

      <ChefOrderTable/>
    </div>
  );
};

export default Analytics;
