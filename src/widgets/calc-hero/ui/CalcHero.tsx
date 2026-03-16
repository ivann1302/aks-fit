'use client';

import { Button } from '@/shared/ui';
import styles from './CalcHero.module.scss';

export function CalcHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.title}>ФИТНЕС КАЛЬКУЛЯТОР</h1>
        <p className={styles.subtitle}>
          Рассчитайте свою норму калорий, оптимальный вес и получите персональный план тренировок
        </p>
        <div className={styles.buttons}>
          <Button onClick={() => scrollTo('calculator')}>Начать расчёт</Button>
          <button className={styles.btnOutline} onClick={() => scrollTo('how-it-works')}>
            Как это работает
          </button>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </section>
  );
}
