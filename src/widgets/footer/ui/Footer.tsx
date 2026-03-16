'use client';

import Link from 'next/link';
import styles from './Footer.module.scss';

interface FooterProps {
  footerRef: React.RefObject<HTMLElement | null>;
}

const NAV_LINKS = [
  { label: 'О тренере', href: '/#about' },
  { label: 'Услуги', href: '/#services' },
  { label: 'Процесс работы', href: '/#process' },
  { label: 'Тарифы', href: '/#pricing' },
  { label: 'Отзывы', href: '/#reviews' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/#contacts' },
  { label: 'Калькулятор', href: '/calculator' },
];

export function Footer({ footerRef }: FooterProps) {
  return (
    <>
      <footer className={styles.footer} ref={footerRef as React.RefObject<HTMLElement>}>
        <div className={styles.main}>
          <div className={styles.brandCol}>
            <span className={styles.brandName}>AKS·Fit</span>
            <p className={styles.brandTag}>
              Персональные тренировки
              <br />и здоровый образ жизни
            </p>
            <span className={styles.accentLine} />
            <div className={styles.contacts}>
              <div className={styles.contactItem}>
                <span className={styles.dot} />
                <span>@aksfit_coach</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.dot} />
                <span>Москва, онлайн по всей России</span>
              </div>
            </div>
          </div>

          <div className={styles.navCol}>
            <span className={styles.colHead}>Навигация</span>
            <nav className={styles.navLinks}>
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className={styles.navLink}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.ctaCol}>
            <span className={styles.colHead}>Начать сейчас</span>
            <p className={styles.ctaText}>Готов изменить своё тело и образ жизни?</p>
            <Link href="/#contacts" className={styles.ctaBtn}>
              Записаться
            </Link>
            <div className={styles.socials}>
              <a
                href="https://t.me/aksfit_coach"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.socialIcon}
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Telegram</span>
              </a>
              <a
                href="https://instagram.com/aksfit_coach"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.socialIcon}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} AKS Fit. Все права защищены.</span>
          <span>Тренер — Александр Соколов</span>
        </div>
      </footer>
    </>
  );
}
