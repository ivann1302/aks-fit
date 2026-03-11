'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './Footer.module.scss';

interface FooterProps {
  footerRef: React.RefObject<HTMLElement | null>;
  scrollBtnRef: React.RefObject<HTMLButtonElement | null>;
}

// useSyncExternalStore — рекомендованный способ определить, что мы на клиенте (без setState в useEffect)
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function Footer({ footerRef, scrollBtnRef }: FooterProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className={styles.footer} ref={footerRef as React.RefObject<HTMLElement>}>
        <div className={styles.socials}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/images/icons/contacts/instagram.png"
              alt="Instagram"
              width={48}
              height={48}
            />
          </a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <Image
              src="/images/icons/contacts/telegram.png"
              alt="Telegram"
              width={48}
              height={48}
            />
          </a>
        </div>
        <p>© {new Date().getFullYear()} AKS Fit. Все права защищены.</p>
      </footer>
      {mounted &&
        createPortal(
          <button
            ref={scrollBtnRef}
            className={styles.scrollTop}
            onClick={scrollToTop}
            aria-label="Наверх"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polyline
                points="5,15 12,8 19,15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>,
          document.body
        )}
    </>
  );
}
