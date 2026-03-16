'use client';

import { useInView } from '@/shared/hooks';
import { QA_ITEMS, type QaItem } from '../model';
import styles from './QaSection.module.scss';

function QaItem({ client, question, answer }: Omit<QaItem, 'id'>) {
  const { ref, inView } = useInView(0.15);

  return (
    <div ref={ref} className={`${styles.item} ${inView ? styles.visible : ''}`}>
      <div className={styles.question}>
        <span className={styles.avatar}>{client[0]}</span>
        <div className={styles.bubble}>
          <span className={styles.clientName}>{client}</span>
          <p className={styles.text}>{question}</p>
        </div>
      </div>
      <div className={styles.answer}>
        <div className={styles.bubble}>
          <span className={styles.trainerName}>Татьяна</span>
          <p className={styles.text}>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function QaSection() {
  return (
    <section className={styles.qa}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Вопросы клиентов</h2>
        <div className={styles.list}>
          {QA_ITEMS.map(item => (
            <QaItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
