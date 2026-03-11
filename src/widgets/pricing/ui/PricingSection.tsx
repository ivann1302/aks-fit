'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './PricingSection.module.scss';

export function PricingSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current, bottomRef.current];
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.15 }
    );
    els.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.pricing}>
      <div className={styles.inner}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <div ref={leftRef} className={`${styles.cardLeft} ${styles.slideLeft}`}>
              <h2 className={styles.title}>Онлайн-программа</h2>
              <p className={styles.price}>от 5 000 ₽ / месяц</p>
              <ul className={styles.list}>
                <li>Индивидуальный план тренировок</li>
                <li>Персональный план питания</li>
                <li>Постоянная поддержка и обратная связь</li>
                <li>Корректировка программы под прогресс</li>
              </ul>
              <p className={styles.description}>
                Индивидуальный план тренировок и питания, постоянная поддержка и корректировка
                программы под твой прогресс и цели.
              </p>
            </div>

            <div ref={rightRef} className={`${styles.cardRight} ${styles.slideRight}`}>
              <div className={styles.imageWrapper}>
                <Image src="/images/young.webp" alt="Тренировка" fill className={styles.image} />
              </div>
              <p className={styles.imageCaption}>Результат уже через 4 недели</p>
            </div>
          </div>

          <div ref={bottomRef} className={`${styles.cardBottom} ${styles.slideUp}`}>
            <p className={styles.bottomText}>
              Первая консультация бесплатно — напиши мне, и мы подберём программу именно под тебя
            </p>
          </div>
        </div>

        <p className={styles.note}>
          Цена зависит от выбранного пакета и длительности программы. Свяжитесь со мной для
          уточнения деталей.
        </p>
      </div>
    </section>
  );
}
