import { z } from 'zod';

// z.string().transform(Number).pipe(...) — берёт строку из HTML-инпута,
// конвертирует в число и проверяет диапазон
const numField = (min: number, max: number, minMsg: string, maxMsg: string) =>
  z
    .string({ error: 'Обязательное поле' })
    .nonempty('Обязательное поле')
    .transform(Number)
    .pipe(z.number().min(min, minMsg).max(max, maxMsg));

export const calculatorSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: numField(13, 80, 'Минимум 13 лет', 'Максимум 80 лет'),
  weight: numField(30, 300, 'Минимум 30 кг', 'Максимум 300 кг'),
  height: numField(100, 250, 'Минимум 100 см', 'Максимум 250 см'),
  activity: z.string().transform(Number).pipe(z.number().min(1).max(5)),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

// Сырые данные формы (строки из HTML-инпутов)
export type CalculatorFormRaw = {
  gender: 'male' | 'female';
  age: string;
  weight: string;
  height: string;
  activity: string;
  goal: 'lose' | 'maintain' | 'gain';
};

// CalculatorFormData живёт в @/shared/types — используется и в calc-results
