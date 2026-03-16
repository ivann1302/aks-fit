import Link from 'next/link';
import type { ArticleData } from '../model';
import styles from './ArticleRelated.module.scss';

interface Props {
  articles: ArticleData[];
}

export function ArticleRelated({ articles }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Похожие статьи</h2>
        <p className={styles.subtitle}>Другие материалы по теме</p>
      </div>

      <div className={styles.grid}>
        {articles.map(article => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className={`${styles.card} ${article.dark ? styles.cardDark : ''}`}
          >
            <div className={styles.image} />
            <div className={styles.body}>
              <span className={styles.category}>{article.category.toUpperCase()}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <span className={styles.readTime}>{article.readTime ?? '5 мин'} чтения</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
