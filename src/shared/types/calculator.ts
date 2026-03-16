export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface CalculatorFormData {
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  activity: number;
  goal: Goal;
}

export interface CalculatorResult {
  bmr: number;
  tdee: number;
  target: number;
}
