'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ARTICLES } from '../model';
import { ArticleCard } from './ArticleCard';
import styles from './BlogSection.module.scss';

export function BlogSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <div className={styles.headText}>
        <span className={styles.eyebrow}>Блог</span>
        <h2 className={styles.title}>Статьи о фитнесе и здоровье</h2>
        <p className={styles.subtitle}>
          Советы тренера, разборы упражнений и рекомендации по питанию
        </p>
      </div>

      <div className={styles.sliderRow}>
        <button className={styles.btn} onClick={() => scroll(-1)} aria-label="Назад" />
        <div className={styles.track} ref={trackRef}>
          {ARTICLES.map(article => (
            <div key={article.id} className={styles.slide}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        <button className={styles.btn} onClick={() => scroll(1)} aria-label="Вперёд" />
      </div>

      <div className={styles.ctaRow}>
        <Link href="/blog" className={styles.allLink}>
          Все статьи
        </Link>
      </div>
    </section>
  );
}
