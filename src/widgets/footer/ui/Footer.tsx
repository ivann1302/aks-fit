import styles from './Footer.module.scss';

interface FooterProps {
  footerRef: React.RefObject<HTMLElement | null>;
}

export function Footer({ footerRef }: FooterProps) {
  return (
    <footer className={styles.footer} ref={footerRef as React.RefObject<HTMLElement>}>
      <p>© {new Date().getFullYear()} AKS Fit. Все права защищены.</p>
    </footer>
  );
}
