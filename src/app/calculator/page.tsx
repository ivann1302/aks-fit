'use client';

import { Header } from '@/widgets/header';
import { CalculatorSection } from '@/widgets/calculator';
import styles from './page.module.scss';

export default function CalculatorPage() {
  return (
    <div className={styles.page}>
      <Header alwaysVisible />
      <main className={styles.main}>
        <CalculatorSection />
      </main>
    </div>
  );
}
