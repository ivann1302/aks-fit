'use client';

import { useEffect, useRef } from 'react';
import { useParallaxScroll } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { SERVICES } from '../model';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { containerRef, mainRef, heroRef, footerRef, contentRef, wrapperRef, stickyHeaderRef } =
    useParallaxScroll();

  const aboutTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = aboutTitleRef.current;
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
    <div className={styles.scrollAnimate} ref={containerRef}>
      <header className={styles.stickyHeader} ref={stickyHeaderRef}>
        <nav className={styles.nav}>
          <span className={styles.logo}>AKS Fit</span>
          <ul>
            <li>Обо мне</li>
            <li>Фитнес</li>
            <li>Питание</li>
            <li>Статьи</li>
            <li>Контакты</li>
          </ul>
        </nav>
      </header>

      <div className={styles.scrollAnimateMain} ref={mainRef}>
        <div className={styles.wrapperParallax} ref={wrapperRef}>
          <section className={styles.hero} ref={heroRef}>
            <h1 className={styles.heroTitle}>
              {['Тренировки.', 'Питание.', 'Результат.'].map((word, i) => (
                <span
                  key={word}
                  className={styles.heroWord}
                  style={{ animationDelay: `${0.4 + i * 0.55}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <div className={styles.scrollIndicator}>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </section>

          <div ref={contentRef}>
            <section className={styles.about}>
              <div className={styles.aboutInner}>
                <h2 className={styles.aboutTitle} ref={aboutTitleRef}>
                  Меня зовут Татьяна Аксенова
                </h2>
                <p className={styles.aboutParagraph}>
                  Я сертифицированный фитнес-тренер с опытом более 5 лет. Моя специализация — не
                  просто тренировки, а комплексный подход: я хорошо ориентируюсь в нутрициологии,
                  поэтому помогаю клиентам выстраивать питание без жестких диет и срывов.
                </p>
                <p className={styles.aboutParagraph}>
                  Для меня важен каждый человек. Индивидуальный подход — это не просто слова. Я
                  изучаю твои привычки, образ жизни и цели, чтобы вместе мы пришли к результату,
                  который останется с тобой навсегда.
                </p>
                <p className={styles.aboutCta}>
                  Я здесь, чтобы изменить твою жизнь к лучшему. Начнем?
                </p>
                <div className={styles.aboutButton}>
                  <Button>Заказать консультацию</Button>
                </div>
              </div>
            </section>

            <section className={styles.content}>
              <p className={styles.contentText}>
                Хочешь выглядеть на 100% и чувствовать себя невероятно? Я приглашаю тебя в мир, где
                женский фитнес приносит радость и быстрые результаты. Присоединяйся ко мне, чтобы
                получить доступ к моим личным наработкам.
              </p>

              <div className={styles.cards}>
                {SERVICES.map(({ title, image, back }) => (
                  <div className={styles.card} key={title}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardFront}>
                        <div
                          className={styles.cardImage}
                          style={{ backgroundImage: `url('${image}')` }}
                        />
                      </div>
                      <div className={styles.cardBack}>
                        <p>{back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.reviews}>
              <h2>Reviews</h2>
            </section>

            <section className={styles.contacts}>
              <h2>Contacts</h2>
            </section>
          </div>

          <footer className={styles.footer} ref={footerRef}>
            <p>© {new Date().getFullYear()} AKS Fit. Все права защищены.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
