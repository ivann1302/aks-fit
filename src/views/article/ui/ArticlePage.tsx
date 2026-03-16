'use client';

import { useRef } from 'react';
import { useFooterReveal } from '@/shared/hooks';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { ArticleHero, ArticleBody, ArticleRelated } from '@/widgets/article';
import type { Article } from '@/widgets/blog-section/model';
import styles from './ArticlePage.module.scss';

interface Props {
  article: Article;
  related: Article[];
}

export function ArticlePage({ article, related }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const { footerRef } = useFooterReveal(
    containerRef as React.RefObject<HTMLElement | null>,
    wrapperRef as React.RefObject<HTMLElement | null>,
    mainRef as React.RefObject<HTMLElement | null>
  );

  return (
    <div ref={containerRef} className={styles.page}>
      <Header alwaysVisible />
      <div ref={wrapperRef} className={styles.wrapper}>
        <main ref={mainRef} className={styles.main}>
          <ArticleHero article={article} />
          <ArticleBody />
          <ArticleRelated articles={related} />
        </main>
        <Footer footerRef={footerRef} />
      </div>
    </div>
  );
}
