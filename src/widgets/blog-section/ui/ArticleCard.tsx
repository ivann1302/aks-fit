import Link from 'next/link';
import type { Article } from '../model';
import styles from './ArticleCard.module.scss';

const TEST_SLUG = 'uprazhneniya-dlya-osanki';

interface Props {
  article: Article;
}

export function ArticleCard({ article }: Props) {
  const { title, excerpt, category, date, dark } = article;

  return (
    <Link href={`/blog/${TEST_SLUG}`} className={`${styles.card} ${dark ? styles.cardDark : ''}`}>
      <div className={styles.image} />

      <div className={styles.body}>
        <span className={`${styles.tag} ${dark ? styles.tagDark : ''}`}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.footer}>
          <span className={styles.date}>{date}</span>
          <span className={styles.read}>
            Читать
            <svg
              width="14"
              height="14"
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
          </span>
        </div>
      </div>
    </Link>
  );
}
