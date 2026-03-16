'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '../model';
import styles from './ReviewsSection.module.scss';

export function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    track.scrollBy({ left: dir * (card.offsetWidth + 40), behavior: 'smooth' });
  };

  return (
    <section id="reviews" className={styles.reviews}>
      <Image
        src="/images/reviews.png"
        alt=""
        width={270}
        height={270}
        className={styles.reviewsIcon}
      />
      <h2 className={styles.reviewsTitle}>Голос моих учениц</h2>
      <div className={styles.sliderRow}>
        <button className={styles.btn} onClick={() => scroll(-1)} aria-label="Назад" />
        <div className={styles.sliderTrack} ref={trackRef}>
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{item.initial}</div>
                <span className={styles.name}>{item.name}</span>
              </div>
              <p className={styles.text}>{item.text}</p>
            </div>
          ))}
        </div>
        <button className={styles.btn} onClick={() => scroll(1)} aria-label="Вперёд" />
      </div>
    </section>
  );
}
