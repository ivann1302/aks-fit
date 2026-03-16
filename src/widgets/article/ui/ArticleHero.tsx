import Link from 'next/link';
import type { ArticleData } from '../model';
import styles from './ArticleHero.module.scss';

interface Props {
  article: ArticleData;
}

export function ArticleHero({ article }: Props) {
  const {
    title,
    excerpt,
    category,
    date,
    author = 'Александр Соколов',
    readTime = '5 мин',
  } = article;

  return (
    <section className={styles.hero}>
      <p className={styles.breadcrumb}>
        <Link href="/blog">Блог</Link> / {category}
      </p>

      <span className={styles.category}>{category.toUpperCase()}</span>

      <h1 className={styles.title}>{title}</h1>

      <p className={styles.excerpt}>{excerpt}</p>

      <div className={styles.meta}>
        <div className={styles.avatar} aria-hidden="true" />
        <div className={styles.metaInfo}>
          <span className={styles.author}>{author}</span>
          <span className={styles.metaDetail}>
            {date} · {readTime} чтения
          </span>
        </div>
      </div>
    </section>
  );
}
