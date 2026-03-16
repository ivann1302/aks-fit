'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { DESCRIPTIONS } from '../model';
import styles from './ProcessSection.module.scss';

// Знакомство: округлённый речевой пузырь (комикс-стиль)
const IconMeet = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 5.5 Q3 2.5 6 2.5 H18 Q21 2.5 21 5.5 V13 Q21 16 18 16 H13.5 L10.5 20 L10 16 H6 Q3 16 3 13 Z" />
    <circle cx="8.5" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

// Программа: планшет с чеклистом и галочками
const IconClipboard = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="3" width="16" height="19" rx="1.5" />
    <path d="M9 3 V1.8 Q9 1 9.8 1 H14.2 Q15 1 15 1.8 V3" />
    <line x1="9" y1="2" x2="15" y2="2" />
    <polyline points="7.5,9 9,10.5 11,7.5" />
    <line x1="12.5" y1="9" x2="17.5" y2="9" />
    <polyline points="7.5,13.5 9,15 11,12" />
    <line x1="12.5" y1="13.5" x2="17.5" y2="13.5" />
    <line x1="7.5" y1="18" x2="16.5" y2="18" />
  </svg>
);

const STEPS = [
  {
    icon: <IconMeet />,
    title: 'Знакомство',
  },
  {
    icon: <IconClipboard />,
    title: 'Программа',
  },
  {
    icon: <Image src="/images/icons/training.webp" alt="Тренировки" width={52} height={52} />,
    title: 'Тренировки',
  },
  {
    icon: <Image src="/images/icons/nutrition.webp" alt="Питание" width={52} height={52} />,
    title: 'Питание',
  },
  {
    icon: <Image src="/images/icons/support.webp" alt="Поддержка" width={52} height={52} />,
    title: 'Поддержка',
  },
  {
    icon: <Image src="/images/icons/result.webp" alt="Результат" width={52} height={52} />,
    title: 'Результат',
  },
];

export function ProcessSection() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [phoneWrapperRef.current, layoutRef.current];
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.15 }
    );
    els.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const phoneEl = phoneRef.current;
    if (!phoneEl) return;

    let targetRx = 0,
      targetRy = 0;
    let rx = 0,
      ry = 0;
    let hasInteracted = false;
    let time = 0;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      if (!hasInteracted) {
        time += 0.015;
        targetRy = Math.sin(time) * 25;
        targetRx = Math.cos(time * 0.8) * 15;
      }
      rx = lerp(rx, targetRx, 0.08);
      ry = lerp(ry, targetRy, 0.08);
      phoneEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      hasInteracted = true;
      const rect = phoneEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.45;
      const maxTilt = 40;
      targetRy = Math.max(-maxTilt, Math.min(maxTilt, (dx / maxDist) * maxTilt));
      targetRx = Math.max(-maxTilt, Math.min(maxTilt, -(dy / maxDist) * maxTilt));
    };

    const onMouseLeave = () => {
      hasInteracted = false;
      targetRx = 0;
      targetRy = 0;
    };

    phoneEl.addEventListener('mousemove', onMouseMove);
    phoneEl.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      phoneEl.removeEventListener('mousemove', onMouseMove);
      phoneEl.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const parallax = parallaxRef.current;
    if (!section || !parallax) return;

    const MAX_OFFSET = 350;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrolled = viewH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (viewH + section.offsetHeight)));
      parallax.style.transform = `translateY(${(1 - progress) * MAX_OFFSET}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="process" ref={sectionRef} className={styles.process}>
      <div ref={parallaxRef} className={styles.parallaxWrapper}>
        <div ref={phoneWrapperRef} className={`${styles.phoneWrapper} ${styles.slideLeft}`}>
          <div className={styles.phoneRotate} ref={phoneRef}>
            <Image
              src="/images/phone.png"
              alt="Телефон"
              width={620}
              height={1240}
              className={styles.phone}
            />
          </div>
        </div>
      </div>
      <div ref={layoutRef} className={`${styles.layout} ${styles.slideRight}`}>
        <div className={styles.right}>
          <h2 className={styles.title}>Как мы будем с тобой работать?</h2>
          <div className={styles.inner}>
            {STEPS.map(step => (
              <div key={step.title} className={styles.step}>
                <div className={styles.icon}>{step.icon}</div>
                <div className={styles.content}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{DESCRIPTIONS[step.title]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
