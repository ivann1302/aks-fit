export type ArticleCategory = 'Здоровье' | 'Питание' | 'Тренировки' | 'Восстановление';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  slug: string;
  dark?: boolean; // тёмная карточка (#403e3b фон)
  author?: string;
  readTime?: string;
}
