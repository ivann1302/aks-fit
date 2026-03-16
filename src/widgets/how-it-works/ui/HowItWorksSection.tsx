import styles from './HowItWorksSection.module.scss';

const STEPS = [
  {
    num: '1',
    title: 'Заполните данные',
    text: 'Укажите пол, возраст, рост, вес и уровень физической активности',
  },
  {
    num: '2',
    title: 'Получите расчёт',
    text: 'Алгоритм рассчитает ваш ИМТ, суточную норму калорий и оптимальный план',
  },
  {
    num: '3',
    title: 'Начните тренировки',
    text: 'Запишитесь к тренеру и получите персональную программу под ваши цели',
  },
];

export function HowItWorksSection() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.head}>
        <h2 className={styles.title}>Как это работает</h2>
        <p className={styles.subtitle}>Три простых шага к персональному плану</p>
      </div>

      <div className={styles.steps}>
        {STEPS.map(step => (
          <div key={step.num} className={styles.card}>
            <span className={styles.num}>{step.num}</span>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardText}>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
