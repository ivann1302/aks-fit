import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

export function HeroSection({ heroRef }: HeroSectionProps) {
  return (
    <section className={styles.hero} ref={heroRef as React.RefObject<HTMLElement>}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>ПЕРСОНАЛЬНЫЙ ОНЛАЙН ТРЕНЕР</h1>
        <div className={styles.heroBottom}>
          <hr className={styles.heroDivider} />
          <p className={styles.heroSlogan}>Твой путь к телу мечты через удовольствие и комфорт</p>
        </div>
      </div>
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
  );
}
