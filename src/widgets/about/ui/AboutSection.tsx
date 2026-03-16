'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import styles from './AboutSection.module.scss';

export function AboutSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = [titleRef.current, ctaRef.current];
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.5 }
    );
    els.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutInner}>
        <Image
          src="/images/helloAbout.png"
          alt=""
          width={180}
          height={180}
          className={styles.helloIcon}
        />
        <h2 className={styles.aboutTitle} ref={titleRef}>
          Меня зовут Татьяна Аксенова
        </h2>
        <p className={styles.aboutParagraph}>
          Я сертифицированный фитнес-тренер с опытом более 5 лет. Моя специализация — не просто
          тренировки, а комплексный подход: я хорошо ориентируюсь в нутрициологии, поэтому помогаю
          клиентам выстраивать питание без жестких диет и срывов.
        </p>
        <p className={styles.aboutParagraph}>
          Для меня важен каждый человек. Индивидуальный подход — это не просто слова. Я изучаю твои
          привычки, образ жизни и цели, чтобы вместе мы пришли к результату, который останется с
          тобой навсегда.
        </p>
        <p className={styles.aboutCta}>
          Я здесь, чтобы изменить твою жизнь к лучшему.{' '}
          <span ref={ctaRef} className={styles.ctaHighlight}>
            Начнем?
          </span>
        </p>
        <div className={styles.aboutButton}>
          <Button animated>Заказать консультацию</Button>
        </div>
      </div>
    </section>
  );
}
