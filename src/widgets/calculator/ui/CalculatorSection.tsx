'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Button } from '@/shared/ui';
import {
  ACTIVITY_LEVELS,
  GOAL_DELTA,
  calculatorSchema,
  type CalculatorFormData,
  type CalculatorFormRaw,
  type CalculatorResult,
  type Goal,
} from '../model';
import styles from './CalculatorSection.module.scss';

const GOALS: { value: Goal; label: string }[] = [
  { value: 'lose', label: 'Снижение веса' },
  { value: 'maintain', label: 'Поддержание веса' },
  { value: 'gain', label: 'Набор веса' },
];

function calcCalories(data: CalculatorFormData): CalculatorResult {
  const kfa = ACTIVITY_LEVELS.find(l => l.value === data.activity)!.kfa;

  const bmr =
    data.gender === 'male'
      ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
      : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

  const tdee = bmr * kfa;
  const target = tdee + GOAL_DELTA[data.goal];

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target) };
}

interface Props {
  onResult?: (result: CalculatorResult, form: CalculatorFormData) => void;
}

export function CalculatorSection({ onResult }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    // CalculatorFormRaw — строки из HTML-инпутов, CalculatorFormData — числа после валидации
  } = useForm<CalculatorFormRaw, unknown, CalculatorFormData>({
    resolver: standardSchemaResolver(calculatorSchema),
    defaultValues: {
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      activity: '1',
      goal: 'maintain',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const gender = watch('gender');

  const onSubmit = (data: CalculatorFormData) => {
    const result = calcCalories(data);
    setSubmitted(true);
    onResult?.(result, data);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Узнайте свои параметры</h2>
        <p className={styles.sectionSubtitle}>
          Заполните данные — и получите персональные рекомендации за 2 минуты
        </p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        {/* Прогресс-бар */}
        <div className={styles.progressBar}>
          <div className={styles.progressFilled} />
          <div className={styles.progressEmpty} />
          <div className={styles.progressEmpty} />
        </div>

        <div className={styles.cardInner}>
          {/* Шаг */}
          <div className={styles.stepRow}>
            <span className={styles.stepLabel}>Шаг 1 из 3</span>
            <span className={styles.stepName}>Личные данные</span>
          </div>

          {/* Пол */}
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Ваш пол</span>
            <div className={styles.genderRow}>
              <label
                className={`${styles.genderBtn} ${gender === 'male' ? styles.genderBtnActive : ''}`}
              >
                <input
                  type="radio"
                  value="male"
                  {...register('gender')}
                  className={styles.hiddenInput}
                />
                Мужской
              </label>
              <label
                className={`${styles.genderBtn} ${gender === 'female' ? styles.genderBtnActive : ''}`}
              >
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className={styles.hiddenInput}
                />
                Женский
              </label>
            </div>
          </div>

          {/* Возраст + Цель */}
          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="age">
                Возраст
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="age"
                  type="number"
                  placeholder="28"
                  {...register('age')}
                  className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
                />
                <span className={styles.unit}>лет</span>
              </div>
              {errors.age && <span className={styles.error}>{errors.age.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="goal">
                Цель
              </label>
              <div className={styles.selectWrapper}>
                <select id="goal" {...register('goal')} className={styles.select}>
                  {GOALS.map(g => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <svg
                  className={styles.chevron}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <polyline
                    points="6,9 12,15 18,9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Рост + Вес + Активность */}
          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="height">
                Рост
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register('height')}
                  className={`${styles.input} ${errors.height ? styles.inputError : ''}`}
                />
                <span className={styles.unit}>см</span>
              </div>
              {errors.height && <span className={styles.error}>{errors.height.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="weight">
                Вес
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="weight"
                  type="number"
                  placeholder="70"
                  {...register('weight')}
                  className={`${styles.input} ${errors.weight ? styles.inputError : ''}`}
                />
                <span className={styles.unit}>кг</span>
              </div>
              {errors.weight && <span className={styles.error}>{errors.weight.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="activity">
                Активность
              </label>
              <div className={styles.selectWrapper}>
                <select id="activity" {...register('activity')} className={styles.select}>
                  {ACTIVITY_LEVELS.map(l => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <svg
                  className={styles.chevron}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <polyline
                    points="6,9 12,15 18,9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            {submitted && (
              <button type="button" className={styles.btnBack} onClick={() => setSubmitted(false)}>
                ← Назад
              </button>
            )}
            <Button type="submit" animated>
              Рассчитать
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
