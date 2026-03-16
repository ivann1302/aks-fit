import Link from 'next/link';
import styles from './CalcCta.module.scss';

export function CalcCta() {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <h2 className={styles.title}>Готовы начать?</h2>
        <p className={styles.text}>
          Запишитесь на консультацию — тренер составит программу под ваши результаты расчёта
        </p>
      </div>

      <div className={styles.right}>
        <Link href="/#contacts" className={styles.btnPrimary}>
          Записаться бесплатно
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnOutline}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Написать в Telegram
        </a>
        <span className={styles.note}>Бесплатная консультация 20 минут</span>
      </div>
    </section>
  );
}
