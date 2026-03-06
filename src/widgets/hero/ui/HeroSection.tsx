import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement>;
}

export function HeroSection({ heroRef }: HeroSectionProps) {
  return (
    <section className={styles.hero} ref={heroRef}>
      <h1 className={styles.heroTitle}>
        {['Тренировки.', 'Питание.', 'Результат.'].map((word, i) => (
          <span
            key={word}
            className={styles.heroWord}
            style={{ animationDelay: `${0.4 + i * 0.55}s` }}
          >
            {word}
          </span>
        ))}
      </h1>
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
