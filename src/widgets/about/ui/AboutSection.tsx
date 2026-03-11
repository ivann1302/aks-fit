'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import styles from './AboutSection.module.scss';

export function AboutSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.about}>
      <div className={styles.aboutInner}>
        <Image
          src="/images/hello.png"
          alt=""
          width={140}
          height={140}
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
        <p className={styles.aboutCta}>Я здесь, чтобы изменить твою жизнь к лучшему. Начнем?</p>
        <div className={styles.aboutButton}>
          <Button>Заказать консультацию</Button>
        </div>
      </div>
    </section>
  );
}
