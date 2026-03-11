'use client';

import Image from 'next/image';
import styles from './ProcessSection.module.scss';

// Знакомство: силуэт человека + речевой пузырь с точками
const IconMeet = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7.5" cy="5.5" r="2.8" />
    <path d="M1.5 21 C1.5 15.5 4.5 13 7.5 13 C10.5 13 13.5 15.5 13.5 21" />
    <path d="M14.5 6.5 H21.5 Q22.5 6.5 22.5 7.5 V13 Q22.5 14 21.5 14 H18 L16.5 16.5 L16 14 H14.5 Q13.5 14 13.5 13 V7.5 Q13.5 6.5 14.5 6.5 Z" />
    <circle cx="16.5" cy="10.5" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="18.5" cy="10.5" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="20.5" cy="10.5" r="0.55" fill="currentColor" stroke="none" />
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

const DESCRIPTIONS: Record<string, string> = {
  Знакомство:
    'Бесплатная консультация: обсуждаем твои цели, образ жизни, противопоказания и пожелания.',
  Программа:
    'Составляю индивидуальный план тренировок и питания, адаптированный под твои цели и возможности.',
  Тренировки:
    'Работаем вместе: онлайн или офлайн. Я контролирую технику, корректирую нагрузку и мотивирую.',
  Питание:
    'Помогаю выстроить рацион без жёстких диет: сбалансированное питание под твои цели и образ жизни.',
  Поддержка:
    'Всегда на связи — отвечаю на вопросы, помогаю с питанием и слежу за твоим прогрессом.',
  Результат:
    'Анализируем достижения и при необходимости корректируем программу для дальнейшего роста.',
};

export function ProcessSection() {
  return (
    <section className={styles.process}>
      <div className={styles.phoneWrapper}>
        <Image
          src="/images/phone.png"
          alt="Телефон"
          width={620}
          height={1240}
          className={styles.phone}
        />
      </div>
      <div className={styles.layout}>
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
