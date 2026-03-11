import { SERVICES } from '../model';
import styles from './ServicesSection.module.scss';

export function ServicesSection() {
  return (
    <section className={styles.content}>
      <p className={styles.contentText}>
        Хочешь выглядеть на 100% и чувствовать себя невероятно? Я приглашаю тебя в мир, где женский
        фитнес приносит радость и быстрые результаты. Присоединяйся ко мне, чтобы получить доступ к
        моим личным наработкам.
      </p>

      <div className={styles.cards}>
        {SERVICES.map(({ title, image, back }) => (
          <div className={styles.card} key={title}>
            <div className={styles.cardImage} style={{ backgroundImage: `url('${image}')` }} />
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p>{back}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
