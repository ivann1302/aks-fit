import styles from './Footer.module.scss';

interface FooterProps {
  footerRef: React.RefObject<HTMLElement>;
}

export function Footer({ footerRef }: FooterProps) {
  return (
    <footer className={styles.footer} ref={footerRef}>
      <p>© {new Date().getFullYear()} AKS Fit. Все права защищены.</p>
    </footer>
  );
}
