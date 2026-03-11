'use client';

import { useEffect } from 'react';
import { SERVICES } from '../model';
import styles from './ServicesSection.module.scss';

export function ServicesSection() {
  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const cards = document.querySelectorAll(`.${styles.card}`);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle(styles.active, e.isIntersecting)),
      { threshold: 0.5 }
    );
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

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
              <hr className={styles.cardDivider} />
              <p>{back}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
