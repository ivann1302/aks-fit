export interface Service {
  title: string;
  image: string;
  back: string;
}

export const SERVICES: Service[] = [
  {
    title: 'Индивидуальная программа',
    image: '/images/cards/individual-program.webp',
    back: 'Программа тренировок, созданная под твои цели, уровень подготовки и образ жизни',
  },
  {
    title: 'План Питания',
    image: '/images/cards/nutrition-plan.webp',
    back: 'Сбалансированное питание без жёстких диет — вкусно, просто и эффективно',
  },
  {
    title: 'Эксклюзивные знания',
    image: '/images/cards/knowledge.webp',
    back: 'Проверенные методики женского фитнеса из многолетнего личного опыта',
  },
  {
    title: 'Постоянная поддержка',
    image: '/images/cards/support.webp',
    back: 'Я на связи каждый день — отвечаю на вопросы и помогаю не сбиться с курса',
  },
];
