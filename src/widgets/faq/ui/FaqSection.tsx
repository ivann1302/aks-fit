import { faqs } from '../model';
import styles from './FaqSection.module.scss';

export function FaqSection() {
  return (
    <section className={styles.faq}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Часто задаваемые вопросы</h2>
        {faqs.map(({ id, question, answer }) => (
          <div key={id} className={styles.item}>
            <input className={styles.trigger} id={id} type="checkbox" />
            <label className={styles.label} htmlFor={id}>
              {question}
            </label>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
