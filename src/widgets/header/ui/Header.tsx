'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';

interface HeaderProps {
  headerRef?: React.RefObject<HTMLElement | null>;
  alwaysVisible?: boolean;
}

export function Header({ headerRef, alwaysVisible = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const headerClass = [styles.stickyHeader, alwaysVisible ? styles.stickyHeaderVisible : ''].join(
    ' '
  );

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <header className={headerClass} ref={headerRef as React.RefObject<HTMLElement>}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Aksenova fitness
          </Link>
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
          <ul className={menuOpen ? styles.drawerOpen : ''}>
            <li onClick={() => scrollToSection('about')}>Обо мне</li>
            <li onClick={() => setMenuOpen(false)}>Фитнес</li>
            <li onClick={() => setMenuOpen(false)}>Питание</li>
            <li onClick={() => setMenuOpen(false)}>Статьи</li>
            <li onClick={() => setMenuOpen(false)}>Контакты</li>
            <li onClick={() => setMenuOpen(false)}>
              <Link href="/calculator">Калькулятор</Link>
            </li>
          </ul>
        </nav>
      </header>
      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
    </>
  );
}
