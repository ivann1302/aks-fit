export interface ArticleData {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  dark?: boolean;
  author?: string;
  readTime?: string;
}
