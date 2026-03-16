'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { ARTICLES, ArticleCard } from '@/widgets/blog-section';
import styles from './BlogPage.module.scss';

const PAGE_SIZE = 6;

export function BlogPage() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    footer.style.position = 'static';
    footer.style.zIndex = 'auto';
  }, []);

  const shown = ARTICLES.slice(0, visible);
  const hasMore = visible < ARTICLES.length;

  return (
    <div className={styles.page}>
      <Header alwaysVisible />
      <main className={styles.main}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Блог</span>
          <h1 className={styles.title}>Статьи о фитнесе и здоровье</h1>
        </div>

        <div className={styles.grid}>
          {shown.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {hasMore && (
          <div className={styles.loadMore}>
            <button className={styles.loadBtn} onClick={() => setVisible(v => v + PAGE_SIZE)}>
              Загрузить ещё статьи
            </button>
          </div>
        )}
      </main>
      <Footer footerRef={footerRef} />
    </div>
  );
}
