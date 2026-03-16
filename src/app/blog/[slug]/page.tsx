import { notFound } from 'next/navigation';
import { ARTICLES } from '@/widgets/blog-section/model';
import { ArticlePage } from '@/views/article';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) notFound();

  const related = ARTICLES.filter(a => a.slug !== slug).slice(0, 3);

  return <ArticlePage article={article} related={related} />;
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}
