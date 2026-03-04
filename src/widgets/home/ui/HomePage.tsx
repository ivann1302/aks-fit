'use client';

import { useEffect, useRef, useState } from 'react';
import { useParallaxScroll } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { SERVICES } from '../model';
import styles from './HomePage.module.scss';

const TESTIMONIALS = [
  {
    name: 'Мария К.',
    text: 'Благодаря Татьяне я наконец-то достигла своей цели — минус 12 кг за 4 месяца. Индивидуальный подход и поддержка на каждом шагу!',
    initial: 'М',
  },
  {
    name: 'Анна С.',
    text: 'Три месяца тренировок — и я чувствую себя совершенно другим человеком. Программа питания работает, результат виден уже через 2 недели.',
    initial: 'А',
  },
  {
    name: 'Ольга П.',
    text: 'Начинала с нуля, боялась что не справлюсь. Татьяна объяснила всё доступно, теперь я в зале уже полгода и не останавливаюсь!',
    initial: 'О',
  },
  {
    name: 'Елена В.',
    text: 'Лучший тренер, с которым мне приходилось работать. Знает всё о питании и тренировках, всегда на связи и поддерживает мотивацию.',
    initial: 'Е',
  },
  {
    name: 'Дарья М.',
    text: 'После родов думала, что форму уже не вернуть. За 5 месяцев работы с Татьяной вернулась к добеременному весу и чувствую себя отлично!',
    initial: 'Д',
  },
];

export function HomePage() {
  const { containerRef, mainRef, heroRef, footerRef, contentRef, wrapperRef, stickyHeaderRef } =
    useParallaxScroll();

  const aboutTitleRef = useRef<HTMLHeadingElement>(null);

  const total = TESTIMONIALS.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % total);
    }, 8500);
    return () => clearInterval(timer);
  }, [total]);

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
              <h2 className={styles.reviewsTitle}>Отзывы</h2>
              <div className={styles.carousel}>
                <div className={styles.carouselTrack}>
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
