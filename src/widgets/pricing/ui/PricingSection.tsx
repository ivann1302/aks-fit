import Link from 'next/link';
import styles from './PricingSection.module.scss';

const PLANS = [
  {
    id: 'start',
    label: 'Старт',
    price: '5 000 ₽',
    desc: 'Базовая программа для тех, кто только начинает путь к результату',
    features: [
      'Индивидуальный план тренировок',
      'Рекомендации по питанию',
      'Поддержка в мессенджере',
      'Ежемесячная корректировка программы',
    ],
    dark: false,
  },
  {
    id: 'progress',
    label: 'Прогресс',
    price: '9 000 ₽',
    badge: 'Популярный',
    desc: 'Полное сопровождение с персональной коррекцией на каждом этапе',
    features: [
      'Индивидуальный план тренировок',
      'Детальный план питания с расчётом КБЖУ',
      'Видеоразборы техники упражнений',
      'Еженедельная коррекция и чек-ин',
      'Приоритетный ответ в течение 2 часов',
    ],
    dark: true,
  },
  {
    id: 'premium',
    label: 'Премиум',
    price: '15 000 ₽',
    desc: 'VIP-сопровождение для максимально быстрого и устойчивого результата',
    features: [
      'Всё из тарифа «Прогресс»',
      'Онлайн-тренировки в прямом эфире',
      'Ответ в течение 30 минут 24/7',
      'Анализ прогресса каждые 2 недели',
      'Персональные рецепты под твой вкус',
    ],
    dark: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>Тарифы</span>
        <h2 className={styles.title}>Выбери свой формат</h2>
        <p className={styles.subtitle}>
          Персональный подход к каждому клиенту — от первой тренировки до стабильного результата
        </p>
      </div>

      <div className={styles.grid}>
        {PLANS.map(plan => (
          <div key={plan.id} className={`${styles.card} ${plan.dark ? styles.cardDark : ''}`}>
            {plan.badge && (
              <div className={styles.badgeRow}>
                <span className={styles.badge}>{plan.badge}</span>
              </div>
            )}
            <div className={styles.cardTop}>
              <span className={styles.label}>{plan.label}</span>
              <div className={styles.priceRow}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.per}>/ месяц</span>
              </div>
              <p className={styles.desc}>{plan.desc}</p>
            </div>
            <div className={styles.divider} />
            <div className={styles.cardBody}>
              <ul className={styles.features}>
                {plan.features.map(f => (
                  <li key={f}>
                    <span className={styles.dot} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/#contacts" className={styles.btn}>
                Выбрать тариф
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        <span className={styles.noteStar}>✦</span>
        Первая консультация бесплатна — напишите мне, и мы подберём программу под вас
      </p>
    </section>
  );
}
