'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';

interface HeaderProps {
  headerRef?: React.RefObject<HTMLElement>;
  alwaysVisible?: boolean;
}

export function Header({ headerRef, alwaysVisible = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerClass = [styles.stickyHeader, alwaysVisible ? styles.stickyHeaderVisible : ''].join(
    ' '
  );

  return (
    <header className={headerClass} ref={headerRef}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          AKS Fit
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
          <li onClick={() => setMenuOpen(false)}>Обо мне</li>
          <li onClick={() => setMenuOpen(false)}>Фитнес</li>
          <li onClick={() => setMenuOpen(false)}>Питание</li>
          <li onClick={() => setMenuOpen(false)}>Статьи</li>
          <li onClick={() => setMenuOpen(false)}>Контакты</li>
          <li onClick={() => setMenuOpen(false)}>
            <Link href="/calculator">Калькулятор</Link>
          </li>
        </ul>
        {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
      </nav>
    </header>
  );
}
