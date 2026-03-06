'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import {
  ACTIVITY_LEVELS,
  GOAL_DELTA,
  type CalculatorFormData,
  type CalculatorResult,
  type Goal,
} from '../model';
import styles from './CalculatorSection.module.scss';

const INITIAL_FORM: CalculatorFormData = {
  gender: 'male',
  age: '',
  weight: '',
  height: '',
  activity: 1,
  goal: 'maintain',
};

function calcCalories(data: CalculatorFormData): CalculatorResult {
  const age = Number(data.age);
  const weight = Number(data.weight);
  const height = Number(data.height);
  const kfa = ACTIVITY_LEVELS.find(l => l.value === data.activity)!.kfa;

  const bmr =
    data.gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * kfa;
  const target = tdee + GOAL_DELTA[data.goal];

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target) };
}

export function CalculatorSection() {
  const [form, setForm] = useState<CalculatorFormData>(INITIAL_FORM);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const currentActivity = ACTIVITY_LEVELS.find(l => l.value === form.activity)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calcCalories(form));
  };

  return (
    <section className={styles.calculator}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Калькулятор калорий</h2>
        <p className={styles.description}>
          Рассчитайте свою суточную норму калорий по формуле Миффлина–Сан Жеора — одной из наиболее
          точных формул для определения базового обмена веществ. Укажите свои параметры, уровень
          активности и цель, и получите персональную рекомендацию.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Общая информация */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Общая информация</legend>

            <div className={styles.genderRow}>
              <label
                className={`${styles.genderLabel} ${form.gender === 'male' ? styles.genderLabelActive : ''}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === 'male'}
                  onChange={() => setForm({ ...form, gender: 'male' })}
                  className={styles.hiddenInput}
                />
                Мужчина
              </label>
              <label
                className={`${styles.genderLabel} ${form.gender === 'female' ? styles.genderLabelActive : ''}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === 'female'}
                  onChange={() => setForm({ ...form, gender: 'female' })}
                  className={styles.hiddenInput}
                />
                Женщина
              </label>
            </div>

            <div className={styles.fieldsRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="age">
                  Возраст
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="age"
                    type="number"
                    min={13}
                    max={80}
                    placeholder="30"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <span className={styles.unit}>лет</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="weight">
                  Вес
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="weight"
                    type="number"
                    min={30}
                    max={300}
                    placeholder="70"
                    value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <span className={styles.unit}>кг</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="height">
                  Рост
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="height"
                    type="number"
                    min={100}
                    max={250}
                    placeholder="175"
                    value={form.height}
                    onChange={e => setForm({ ...form, height: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <span className={styles.unit}>см</span>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Дневная активность */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Дневная активность</legend>

            <div className={styles.sliderWrapper}>
              <div className={styles.sliderTrackWrapper}>
                <div
                  className={styles.sliderFill}
                  style={{ width: `${((form.activity - 1) / 4) * 100}%` }}
                />
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={form.activity}
                  onChange={e => setForm({ ...form, activity: Number(e.target.value) })}
                  className={styles.slider}
                />
              </div>

              <div className={styles.sliderSteps}>
                {ACTIVITY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    className={`${styles.sliderStep} ${form.activity === level.value ? styles.sliderStepActive : ''}`}
                    onClick={() => setForm({ ...form, activity: level.value })}
                  >
                    {level.value}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.activityInfo}>
              <span className={styles.activityLabel}>{currentActivity.label}</span>
              <span className={styles.activityDesc}>{currentActivity.description}</span>
              <span className={styles.activityKfa}>КФА: {currentActivity.kfa}</span>
            </div>
          </fieldset>

          {/* Цель */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Цель</legend>

            <div className={styles.goalsRow}>
              {(
                [
                  { value: 'lose', label: 'Сбросить вес', sub: '−500 ккал' },
                  { value: 'maintain', label: 'Поддерживать вес', sub: '0 ккал' },
                  { value: 'gain', label: 'Набрать вес', sub: '+500 ккал' },
                ] as { value: Goal; label: string; sub: string }[]
              ).map(({ value, label, sub }) => (
                <label
                  key={value}
                  className={`${styles.goalCard} ${form.goal === value ? styles.goalCardActive : ''}`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={value}
                    checked={form.goal === value}
                    onChange={() => setForm({ ...form, goal: value })}
                    className={styles.hiddenInput}
                  />
                  <span className={styles.goalLabel}>{label}</span>
                  <span className={styles.goalSub}>{sub}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.submitRow}>
            <Button type="submit">Рассчитать</Button>
          </div>
        </form>

        {result && (
          <div className={styles.result}>
            <div className={styles.resultCard}>
              <span className={styles.resultValue}>{result.target}</span>
              <span className={styles.resultUnit}>ккал / день</span>
              <span className={styles.resultCaption}>
                {form.goal === 'lose' && 'для снижения веса'}
                {form.goal === 'maintain' && 'для поддержания веса'}
                {form.goal === 'gain' && 'для набора веса'}
              </span>
            </div>
            <div className={styles.resultDetails}>
              <div className={styles.resultDetailItem}>
                <span className={styles.resultDetailLabel}>Базовый обмен (BMR)</span>
                <span className={styles.resultDetailValue}>{result.bmr} ккал</span>
              </div>
              <div className={styles.resultDetailItem}>
                <span className={styles.resultDetailLabel}>С учётом активности (TDEE)</span>
                <span className={styles.resultDetailValue}>{result.tdee} ккал</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
