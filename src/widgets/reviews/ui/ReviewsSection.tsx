'use client';

import { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../model';
import styles from './ReviewsSection.module.scss';

export function ReviewsSection() {
  const total = TESTIMONIALS.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % total);
    }, 8500);
    return () => clearInterval(timer);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      setActiveIndex(i => (delta > 0 ? (i + 1) % total : (i - 1 + total) % total));
    }
    touchStartX.current = null;
  };

  return (
    <section className={styles.reviews}>
      <h2 className={styles.reviewsTitle}>Отзывы</h2>
      <div className={styles.carousel}>
        <div
          className={styles.carouselTrack}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {TESTIMONIALS.map((item, i) => {
            let d = i - activeIndex;
            if (d > total / 2) d -= total;
            if (d < -total / 2) d += total;
            const isCenter = d === 0;
            const isVisible = Math.abs(d) === 1;
            return (
              <div
                key={i}
                className={styles.carouselItem}
                style={{
                  transform: `translateX(${d * 100}%) scale(${isCenter ? 1 : 0.8})`,
                  opacity: isCenter ? 1 : isVisible ? 0.2 : 0,
                  pointerEvents: isCenter || isVisible ? 'auto' : 'none',
                  cursor: isVisible && !isCenter ? 'pointer' : 'default',
                }}
                onClick={() => !isCenter && setActiveIndex(i)}
              >
                <div className={styles.shadowEffect}>
                  <div className={styles.testimonialAvatar}>{item.initial}</div>
                  <p className={styles.testimonialText}>{item.text}</p>
                </div>
                <div className={styles.testimonialName}>{item.name}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Перейти к отзыву ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
