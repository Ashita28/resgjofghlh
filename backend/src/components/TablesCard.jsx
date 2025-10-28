import React from 'react';
import styles from './componentStyles/tableCard.module.css';
import { delTable as delIcon, chair } from '../assets';

const TablesCard = ({ table, onDelete }) => {
  if (!table) return null;
  const { _id, tableName, tableNum, chairs: chairCount } = table;

  const twoDigit = (n) => n.toString().padStart(2, '0');

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardData}>
        <img
          className={styles.delBtn}
          src={delIcon}
          alt="delete icon"
          title="Delete table"
          onClick={() => onDelete?.(_id)}
          role="button"
          style={{ cursor: 'pointer' }}
        />

        <div className={styles.tableInfo}>
          <h3>{tableName || 'Table'}</h3>
          <p>{twoDigit(tableNum)}</p>
        </div>

        <div className={styles.chairInfo}>
          <img src={chair} alt="chair icon" />
          <p>{twoDigit(chairCount)}</p>
        </div>
      </div>
    </div>
  );
};

export default TablesCard;
