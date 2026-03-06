export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface CalculatorFormData {
  gender: Gender;
  age: string;
  weight: string;
  height: string;
  activity: number;
  goal: Goal;
}

export interface CalculatorResult {
  bmr: number;
  tdee: number;
  target: number;
}

export const ACTIVITY_LEVELS = [
  {
    value: 1,
    kfa: 1.2,
    label: 'Очень мало',
    description: 'Почти весь день сижу дома',
  },
  {
    value: 2,
    kfa: 1.375,
    label: 'Мало',
    description: 'Иногда выхожу (в магазин или на работу)',
  },
  {
    value: 3,
    kfa: 1.55,
    label: 'Умеренно',
    description: 'В среднем гуляю по 1 часу в день',
  },
  {
    value: 4,
    kfa: 1.725,
    label: 'Активно',
    description: 'Периодически тренируюсь по 2–3 раза в неделю',
  },
  {
    value: 5,
    kfa: 1.9,
    label: 'Очень активно',
    description: 'Регулярно занимаюсь спортом — в среднем 5 раз в неделю или более',
  },
] as const;

export const GOAL_DELTA: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 500,
};
