import type { CalculatorFormData, CalculatorResult, Goal } from '@/shared/types';
import styles from './ResultsSection.module.scss';

interface Props {
  result: CalculatorResult;
  form: CalculatorFormData;
}

function getBmi(weight: number, height: number) {
  const bmi = weight / Math.pow(height / 100, 2);
  const label = bmi < 18.5 ? 'Недостаток' : bmi < 25 ? 'Норма' : bmi < 30 ? 'Избыток' : 'Ожирение';
  return { value: bmi.toFixed(1), label };
}

function getWeightGoal(goal: Goal) {
  if (goal === 'lose') return { value: '−5 кг', period: 'за 2–3 месяца' };
  if (goal === 'gain') return { value: '+5 кг', period: 'за 2–3 месяца' };
  return { value: '0 кг', period: 'поддержание' };
}

function getWorkouts(activity: number) {
  const map: Record<number, string> = { 1: '1–2', 2: '2–3', 3: '3–4', 4: '4–5', 5: '5+' };
  return map[activity] ?? '3–4';
}

// ── Donut Chart ────────────────────────────────────────────────────────────

const CX = 90,
  CY = 90,
  R = 65,
  SW = 26;
const CIRC = 2 * Math.PI * R;

interface SegmentProps {
  pct: number;
  rotation: number;
  color: string;
}

function DonutSegment({ pct, rotation, color }: SegmentProps) {
  return (
    <circle
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={SW}
      strokeDasharray={`${CIRC * pct} ${CIRC}`}
      strokeLinecap="butt"
      transform={`rotate(${rotation} ${CX} ${CY})`}
    />
  );
}

function DonutChart({ target }: { target: number }) {
  const carbs = Math.round((target * 0.45) / 4);
  const protein = Math.round((target * 0.3) / 4);
  const fat = Math.round((target * 0.25) / 9);

  // каждый сегмент начинается там, где закончился предыдущий
  // стартуем сверху (-90°), идём по часовой
  const rot0 = -90;
  const rot1 = rot0 + 0.45 * 360;
  const rot2 = rot1 + 0.3 * 360;

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartContainer}>
        <svg viewBox="0 0 180 180" className={styles.chartSvg}>
          <DonutSegment pct={0.45} rotation={rot0} color="#e8923a" />
          <DonutSegment pct={0.3} rotation={rot1} color="#d9304f" />
          <DonutSegment pct={0.25} rotation={rot2} color="#c4956a" />
        </svg>
        <div className={styles.chartCenter}>
          <span className={styles.chartValue}>{target}</span>
          <span className={styles.chartUnit}>ккал</span>
        </div>
      </div>

      <ul className={styles.legend}>
        <li className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#e8923a' }} />
          <span className={styles.legendLabel}>Углеводы</span>
          <span className={styles.legendVal}>45% · {carbs} г</span>
        </li>
        <li className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#d9304f' }} />
          <span className={styles.legendLabel}>Белки</span>
          <span className={styles.legendVal}>30% · {protein} г</span>
        </li>
        <li className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#c4956a' }} />
          <span className={styles.legendLabel}>Жиры</span>
          <span className={styles.legendVal}>25% · {fat} г</span>
        </li>
      </ul>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ResultsSection({ result, form }: Props) {
  const bmi = getBmi(form.weight, form.height);
  const weightGoal = getWeightGoal(form.goal);
  const workouts = getWorkouts(form.activity);

  const cards = [
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0c0-3-1.5-5-1.5-5S14 9 12 2z" />
          <path
            d="M12 12c0 0-2 2-2 4a2 2 0 0 0 4 0c0-2-2-4-2-4z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
      value: result.target,
      unit: 'ккал / день',
      label: 'Суточная норма калорий',
      accent: false,
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
          <path d="M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
        </svg>
      ),
      value: bmi.value,
      unit: `ИМТ — ${bmi.label}`,
      label: 'Индекс массы тела',
      accent: true,
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="3" x2="12" y2="8" />
        </svg>
      ),
      value: weightGoal.value,
      unit: weightGoal.period,
      label: 'Оптимальная цель',
      accent: false,
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.5 6.5h11M6.5 17.5h11" />
          <rect x="2" y="5" width="4" height="4" rx="1" />
          <rect x="18" y="5" width="4" height="4" rx="1" />
          <rect x="2" y="15" width="4" height="4" rx="1" />
          <rect x="18" y="15" width="4" height="4" rx="1" />
        </svg>
      ),
      value: workouts,
      unit: 'тренировки в неделю',
      label: 'Рекомендуемая нагрузка',
      accent: false,
    },
  ];

  return (
    <section className={styles.section} id="results">
      <div className={styles.head}>
        <h2 className={styles.title}>Ваши результаты</h2>
        <p className={styles.subtitle}>На основе введённых данных — ваш персональный расчёт</p>
      </div>

      <div className={styles.cards}>
        {cards.map((card, i) => (
          <div key={i} className={`${styles.card} ${card.accent ? styles.cardAccent : ''}`}>
            <span className={styles.cardIcon}>{card.icon}</span>
            <span className={styles.cardValue}>{card.value}</span>
            <span className={styles.cardUnit}>{card.unit}</span>
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.macroBlock}>
        <h3 className={styles.macroTitle}>Распределение макронутриентов</h3>
        <DonutChart target={result.target} />
      </div>
    </section>
  );
}
