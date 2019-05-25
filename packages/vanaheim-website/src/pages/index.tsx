import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import styles from './index.scss';

export default function() {
  return <div className={styles.demo}>{formatMessage({ id: 'index.start' })}</div>;
}
