# Инструкция по созданию SPA+PWA на React 19 + Next.js + SCSS

> Пошаговые спринты для джуна фронтендера
> Стек: Next.js · React 19 · SCSS · Redux Toolkit · Next.js API Routes · Telegram Bot API · PWA
> Архитектура: **Feature-Sliced Design (FSD)**

---

## Что такое FSD и зачем он нужен

**Feature-Sliced Design** — методология организации кода, где файлы группируются не по типу (`components/`, `hooks/`), а по **смыслу и ответственности**.

### Правило слоёв (строгая иерархия)

```
app → pages → widgets → features → entities → shared
```

**Главное правило:** слой может импортировать только из слоёв **ниже** себя. Никаких импортов вверх.

| Слой     | Папка           | Что хранит                                                     |
| -------- | --------------- | -------------------------------------------------------------- |
| App      | `src/app/`      | Next.js роутинг, провайдеры, глобальные стили                  |
| Pages    | `src/pages/`    | Композиция страниц из виджетов                                 |
| Widgets  | `src/widgets/`  | Крупные независимые блоки (Header, Hero, FAQ)                  |
| Features | `src/features/` | Бизнес-действия пользователя (отправить форму, посчитать КБЖУ) |
| Entities | `src/entities/` | Бизнес-сущности (Заявка, Пользователь)                         |
| Shared   | `src/shared/`   | Переиспользуемая инфраструктура (UI-кит, утилиты, конфиг)      |

### Структура каждого слайса

```
feature-name/
├── ui/       ← React-компоненты
├── model/    ← Redux slice, типы, хуки
├── api/      ← запросы к серверу
├── lib/      ← вспомогательные функции
└── index.ts  ← публичный API (импортируют ТОЛЬКО через него!)
```

---

## Структура проекта (FSD + DevOps)

```
aks-fit/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Проверки качества на каждый push/PR
│       └── deploy.yml          # Деплой на Vercel при merge в main
│
├── public/
│   ├── icons/                  # PWA иконки (192×192, 512×512)
│   ├── images/                 # Фото тренера и др.
│   └── manifest.json           # PWA манифест
│
├── src/
│   ├── app/                    # [СЛОЙ] App
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── api/send-form/route.ts
│   │
│   ├── pages/home/             # [СЛОЙ] Pages
│   │   ├── ui/HomePage.tsx
│   │   └── index.ts
│   │
│   ├── widgets/                # [СЛОЙ] Widgets
│   │   ├── header/
│   │   ├── footer/
│   │   ├── hero-section/
│   │   ├── calculator-section/
│   │   ├── about-section/
│   │   └── faq-section/
│   │
│   ├── features/               # [СЛОЙ] Features
│   │   ├── send-application/
│   │   └── calculate-nutrition/
│   │
│   ├── entities/application/   # [СЛОЙ] Entities
│   │
│   └── shared/                 # [СЛОЙ] Shared
│       ├── api/
│       ├── config/env.ts
│       ├── lib/store/
│       ├── ui/
│       └── styles/
│
├── .dockerignore
├── .env.local                  # Не коммитить!
├── .husky/pre-commit           # Git hook — запускает lint-staged
├── .prettierrc
├── .prettierignore
├── docker-compose.yml          # Dev среда
├── docker-compose.prod.yml     # Production среда
├── Dockerfile                  # Production образ
├── Dockerfile.dev              # Dev образ
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Sprint 0 — Code Quality: Prettier + ESLint + Husky + lint-staged

**Цель:** Код автоматически форматируется и проверяется перед каждым коммитом
**Время:** 1 день

> Настраивай тулинг **в первый день**, не потом. Исправить 1000 файлов задним числом больно.

### Шаг 0.1 — Prettier

**Что это:** Форматировщик кода. Ставит кавычки, запятые, отступы — единообразно для всей команды.

```bash
npm install -D prettier eslint-config-prettier
# eslint-config-prettier — отключает ESLint-правила, которые конфликтуют с Prettier
```

Создать `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

Создать `.prettierignore`:

```
node_modules
.next
public
*.lock
```

Добавить скрипт в `package.json`:

```json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

### Шаг 0.2 — Улучшить ESLint

Проект уже имеет ESLint 9 с flat config (`eslint.config.mjs`). Добавляем `prettier` в extends:

```javascript
// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier' // ← последним! отключает конфликты с Prettier
  ),
  {
    rules: {
      // Запрещаем console.log в коде (оставляем только console.error)
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      // Неиспользуемые переменные — ошибка (исключение: _ префикс)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Запрет any — предупреждение, не ошибка (для джуна норм)
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
```

### Шаг 0.3 — Husky (git hooks)

**Что это:** Запускает скрипты перед коммитом (`pre-commit`), перед пушем (`pre-push`) и т.д.
**Зачем:** Нельзя закоммитить код с ошибками — хук не даст.

```bash
npm install -D husky lint-staged
npx husky init
# Команда создаёт папку .husky/ и настраивает git hook автоматически
```

После команды появится `.husky/pre-commit`. Заменить его содержимое:

```bash
# .husky/pre-commit
npx lint-staged
```

### Шаг 0.4 — lint-staged

**Что это:** Запускает линтер/форматтер только на **изменённых** файлах (не на всём проекте).
**Зачем:** `eslint .` на большом проекте работает 30+ секунд. lint-staged — 1–2 секунды.

Добавить в `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
    "*.{scss,css}": ["prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Шаг 0.5 — Проверить что всё работает

```bash
# Форматировать весь проект
npm run format

# Проверить линтер
npm run lint

# Сделать тестовый коммит — husky должен запустить lint-staged
git add .
git commit -m "chore: setup code quality tools"
# Увидишь вывод lint-staged с зелёными галочками ✔
```

> **Частая ошибка:** `husky - command not found` после клонирования репозитория.
> Решение: добавить в `package.json` скрипт `"prepare": "husky"` — он запустится автоматически при `npm install`.

---

## Sprint 1 — App слой: лейаут, провайдеры, роутинг

**Цель:** Страница рендерится, Redux подключён
**Время:** 1–2 дня

### Шаг 1.1 — Настройка путей в tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

### Шаг 1.2 — Настройка next.config.ts

```typescript
import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: 'standalone', // ← нужно для Docker (копирует только нужные файлы)
  sassOptions: {
    additionalData: `
      @use '@/shared/styles/_variables.scss' as *;
      @use '@/shared/styles/_mixins.scss' as *;
    `,
  },
};

module.exports = withPWA(nextConfig);
```

### Шаг 1.3 — SCSS: shared/styles/

Создать `src/shared/styles/_variables.scss`:

```scss
$color-primary: #2563eb;
$color-primary-dark: #1d4ed8;
$color-accent: #f59e0b;
$color-text: #111827;
$color-text-muted: #6b7280;
$color-bg: #ffffff;
$color-bg-alt: #f9fafb;
$color-border: #e5e7eb;

$font-family: 'Inter', system-ui, sans-serif;
$font-size-base: 16px;

$bp-mobile: 480px;
$bp-tablet: 768px;
$bp-desktop: 1200px;

$container-width: 1200px;
$container-padding: 1rem;
```

Создать `src/shared/styles/_mixins.scss`:

```scss
@use 'variables' as *;

@mixin mobile {
  @media (max-width: #{$bp-mobile}) {
    @content;
  }
}
@mixin tablet {
  @media (max-width: #{$bp-tablet}) {
    @content;
  }
}
@mixin desktop {
  @media (min-width: #{$bp-desktop}) {
    @content;
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Создать `src/shared/styles/globals.scss`:

```scss
@use 'variables' as *;

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: $font-family;
  font-size: $font-size-base;
  color: $color-text;
  background: $color-bg;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}
```

### Шаг 1.4 — Redux Store (shared/lib/store)

Создать `src/shared/lib/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import formReducer from '@features/send-application/model/formSlice';
import calculatorReducer from '@features/calculate-nutrition/model/calculatorSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    calculator: calculatorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Создать `src/shared/lib/store/hooks.ts`:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
```

Создать `src/shared/config/env.ts`:

```typescript
export const env = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN!,
  telegramChatId: process.env.TELEGRAM_CHAT_ID!,
};
```

### Шаг 1.5 — Провайдер и layout

Создать `src/app/providers.tsx`:

```tsx
'use client';
import { Provider } from 'react-redux';
import { store } from '@shared/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

Обновить `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '@shared/styles/globals.scss';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'AKS Fit — персональный тренер',
  description: 'Тренировки онлайн и офлайн. Похудение, набор массы, здоровье.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Шаг 1.6 — Pages слой

Создать `src/pages/home/ui/HomePage.tsx`:

```tsx
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { HeroSection } from '@widgets/hero-section';
import { AboutSection } from '@widgets/about-section';
import { CalculatorSection } from '@widgets/calculator-section';
import { FaqSection } from '@widgets/faq-section';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CalculatorSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
```

Создать `src/pages/home/index.ts`:

```typescript
export { HomePage } from './ui/HomePage';
```

Обновить `src/app/page.tsx`:

```tsx
import { HomePage } from '@pages/home';

export default function Page() {
  return <HomePage />;
}
```

---

## Sprint 2 — Widgets: Header + Hero + Feature: форма

**Цель:** Хедер, Hero-секция, форма отправляет заявку в TG
**Время:** 2–3 дня

### Шаг 2.1 — Entity: Application

Создать `src/entities/application/model/types.ts`:

```typescript
export interface ApplicationDto {
  name: string;
  phone: string;
  message?: string;
}
```

Создать `src/entities/application/index.ts`:

```typescript
export type { ApplicationDto } from './model/types';
```

### Шаг 2.2 — Feature: send-application

Создать `src/features/send-application/model/formSlice.ts`:

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ApplicationDto } from '@entities/application';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  status: Status;
  error: string | null;
}

export const submitForm = createAsyncThunk(
  'form/submit',
  async (data: ApplicationDto, { rejectWithValue }) => {
    const res = await fetch('/api/send-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || 'Ошибка отправки');
    }
    return res.json();
  }
);

const formSlice = createSlice({
  name: 'form',
  initialState: { status: 'idle', error: null } as FormState,
  reducers: {
    resetForm: state => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitForm.pending, s => {
        s.status = 'loading';
      })
      .addCase(submitForm.fulfilled, s => {
        s.status = 'success';
      })
      .addCase(submitForm.rejected, (s, a) => {
        s.status = 'error';
        s.error = a.payload as string;
      });
  },
});

export const { resetForm } = formSlice.actions;
export default formSlice.reducer;
```

Создать `src/features/send-application/ui/ContactForm.tsx`:

```tsx
'use client';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@shared/lib/store/hooks';
import { submitForm, resetForm } from '../model/formSlice';
import type { ApplicationDto } from '@entities/application';
import styles from './ContactForm.module.scss';

interface Props {
  title?: string;
  onSuccess?: () => void;
}

export function ContactForm({ title = 'Оставить заявку', onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(s => s.form);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationDto>();

  const onSubmit = async (data: ApplicationDto) => {
    const result = await dispatch(submitForm(data));
    if (submitForm.fulfilled.match(result)) {
      reset();
      onSuccess?.();
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <p>Заявка отправлена! Свяжусь с вами в ближайшее время.</p>
        <button onClick={() => dispatch(resetForm())} className={styles.btn}>
          Отправить ещё
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.field}>
        <label htmlFor="name">Имя *</label>
        <input
          id="name"
          type="text"
          placeholder="Иван Иванов"
          {...register('name', { required: 'Введите имя' })}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Телефон *</label>
        <input
          id="phone"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          {...register('phone', {
            required: 'Введите телефон',
            pattern: { value: /^[\+\d\s\(\)\-]{10,}$/, message: 'Неверный формат' },
          })}
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Сообщение</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Расскажите о своей цели..."
          {...register('message')}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.btn} disabled={status === 'loading'}>
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
```

Создать `src/features/send-application/index.ts`:

```typescript
export { ContactForm } from './ui/ContactForm';
export { submitForm, resetForm } from './model/formSlice';
export { default as formReducer } from './model/formSlice';
```

### Шаг 2.3 — API Route → Telegram

Создать `src/app/api/send-form/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@shared/config/env';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ message: 'Имя и телефон обязательны' }, { status: 400 });
    }

    const text = [
      `📥 *Новая заявка с сайта*`,
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      message ? `💬 ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${env.telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.telegramChatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '📞 Позвонить', url: `tel:${phone}` }]],
        },
      }),
    });

    if (!tgRes.ok) throw new Error('Telegram API error');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
```

### Шаг 2.4 — Widgets: Header + HeroSection

Создать `src/widgets/header/ui/Header.tsx`:

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';

const NAV = [
  { href: '#about', label: 'Обо мне' },
  { href: '#calculator', label: 'Калькулятор' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Контакты' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          AKS Fit
        </Link>
        <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
          {NAV.map(l => (
            <a key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <button
          className={styles.burger}
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
```

Создать `src/widgets/header/index.ts`:

```typescript
export { Header } from './ui/Header';
```

Создать `src/widgets/hero-section/ui/HeroSection.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { ContactForm } from '@features/send-application';
import styles from './HeroSection.module.scss';

export function HeroSection() {
  const [showForm, setShowForm] = useState(false);
  return (
    <section className={styles.hero} id="hero">
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Персональный тренер <br />
            <span className={styles.accent}>с результатом</span>
          </h1>
          <p className={styles.subtitle}>
            Помогу достичь твоей цели: похудение, набор массы, здоровье.
          </p>
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>
              Записаться на тренировку
            </button>
            <a href="#calculator" className={styles.btnSecondary}>
              Рассчитать КБЖУ
            </a>
          </div>
        </div>
        {showForm && (
          <div className={styles.formWrapper}>
            <ContactForm title="Записаться" onSuccess={() => setShowForm(false)} />
          </div>
        )}
      </div>
    </section>
  );
}
```

Создать `src/widgets/hero-section/index.ts`:

```typescript
export { HeroSection } from './ui/HeroSection';
```

---

## Sprint 3 — Feature: Калькулятор КБЖУ

**Цель:** Калькулятор считает норму и отправляет результат в TG
**Время:** 3–4 дня

### Шаг 3.1 — Чистая функция расчёта

Создать `src/features/calculate-nutrition/lib/calculateKbju.ts`:

```typescript
export interface CalcParams {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity: number;
  goal: 'loss' | 'maintain' | 'gain';
}

export interface CalcResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const GOAL_K: Record<CalcParams['goal'], number> = {
  loss: 0.8,
  maintain: 1.0,
  gain: 1.15,
};

// Формула Миффлина-Сан Жеора
export function calculateKbju(p: CalcParams): CalcResult {
  const bmr =
    p.gender === 'male'
      ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
      : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;

  const calories = Math.round(bmr * p.activity * GOAL_K[p.goal]);
  const protein = Math.round(p.weight * 1.8);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, fat, carbs };
}
```

### Шаг 3.2 — Redux Slice

Создать `src/features/calculate-nutrition/model/calculatorSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculateKbju } from '../lib/calculateKbju';
import type { CalcParams, CalcResult } from '../lib/calculateKbju';

interface State {
  params: CalcParams;
  result: CalcResult | null;
}

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState: {
    params: { weight: 70, height: 170, age: 25, gender: 'male', activity: 1.375, goal: 'maintain' },
    result: null,
  } as State,
  reducers: {
    setParam: <K extends keyof CalcParams>(
      state: State,
      action: PayloadAction<{ key: K; value: CalcParams[K] }>
    ) => {
      state.params[action.payload.key] = action.payload.value;
    },
    calcResult: state => {
      state.result = calculateKbju(state.params);
    },
  },
});

export const { setParam, calcResult } = calculatorSlice.actions;
export default calculatorSlice.reducer;
```

### Шаг 3.3 — UI + Widget

Создать `src/features/calculate-nutrition/ui/CalculatorForm.tsx` и `src/widgets/calculator-section/ui/CalculatorSection.tsx` — собирает форму и добавляет заголовок секции. _(Полный код см. в предыдущих коммитах или задокументированных спринтах)_

Создать `src/features/calculate-nutrition/index.ts`:

```typescript
export { CalculatorForm } from './ui/CalculatorForm';
export { calcResult, setParam } from './model/calculatorSlice';
export { default as calculatorReducer } from './model/calculatorSlice';
```

---

## Sprint 4 — Widgets: About + FAQ

**Цель:** Секции "Обо мне" и FAQ
**Время:** 1–2 дня

Создать по аналогии с Header:

- `src/widgets/about-section/ui/AboutSection.tsx` + `index.ts`
- `src/widgets/faq-section/ui/FaqSection.tsx` (useState аккордеон) + `index.ts`

---

## Sprint 5 — PWA

**Цель:** Сайт устанавливается на телефон как приложение
**Время:** 1 день

Создать `public/manifest.json`:

```json
{
  "name": "AKS Fit — Персональный тренер",
  "short_name": "AKS Fit",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563EB",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Сгенерировать иконки на [realfavicongenerator.net](https://realfavicongenerator.net), положить в `public/icons/`.

```bash
npm run build && npm start
# Chrome DevTools → Lighthouse → PWA → score ≥ 80
```

---

## Sprint 6 — Docker

**Цель:** Проект запускается в контейнере — одинаково на любой машине
**Время:** 1–2 дня

### Почему Docker

| Без Docker                    | С Docker                          |
| ----------------------------- | --------------------------------- |
| "У меня работает, у тебя нет" | Одинаковое окружение везде        |
| Разные версии Node.js         | Версия зафиксирована в Dockerfile |
| Ручной деплой на сервер       | `docker run` — и готово           |
| Конфликт зависимостей         | Изоляция контейнеров              |

### Шаг 6.1 — .dockerignore

Создать `.dockerignore`:

```
node_modules
.next
.env.local
.env*.local
.git
.gitignore
*.md
.husky
.vscode
```

> `.dockerignore` работает как `.gitignore` — исключает файлы при сборке образа.
> `node_modules` исключаем т.к. они устанавливаются внутри контейнера.

### Шаг 6.2 — Dockerfile (production, многоэтапная сборка)

Создать `Dockerfile`:

```dockerfile
# ───────────────────────────────────────────
# Этап 1: Установка зависимостей
# ───────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
# npm ci — чистая установка по package-lock.json (быстрее и надёжнее npm install)
RUN npm ci

# ───────────────────────────────────────────
# Этап 2: Сборка приложения
# ───────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next.config.ts должен иметь output: 'standalone'
RUN npm run build

# ───────────────────────────────────────────
# Этап 3: Production-образ (минимальный)
# ───────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаём непривилегированного пользователя (безопасность)
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Копируем только то, что нужно для запуска (standalone включает server.js)
COPY --from=builder /app/public                          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone  ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static      ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js генерируется Next.js при output: 'standalone'
CMD ["node", "server.js"]
```

**Почему 3 этапа?**

- Итоговый образ не содержит `node_modules` (только скомпилированный код)
- Production-образ ~100МБ вместо ~1ГБ с зависимостями

### Шаг 6.3 — Dockerfile.dev (разработка с hot-reload)

Создать `Dockerfile.dev`:

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

# Код монтируется через volume — изменения сразу видны без пересборки
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Шаг 6.4 — docker-compose.yml (для разработки)

Создать `docker-compose.yml`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app # монтируем исходный код
      - /app/node_modules # НЕ перезаписываем node_modules из хоста
      - /app/.next # НЕ перезаписываем кэш сборки
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
    restart: unless-stopped
```

### Шаг 6.5 — docker-compose.prod.yml (для production)

Создать `docker-compose.prod.yml`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
    restart: always
    # Лимиты ресурсов (опционально)
    deploy:
      resources:
        limits:
          memory: 512M
```

### Шаг 6.6 — Добавить скрипты в package.json

```json
"scripts": {
  "docker:dev":   "docker compose up --build",
  "docker:prod":  "docker compose -f docker-compose.prod.yml up --build -d",
  "docker:down":  "docker compose down",
  "docker:logs":  "docker compose logs -f app"
}
```

### Шаг 6.7 — Запустить и проверить

```bash
# Разработка — с hot reload
npm run docker:dev
# Открыть http://localhost:3000

# Production — собрать и запустить в фоне
npm run docker:prod

# Смотреть логи
npm run docker:logs

# Остановить
npm run docker:down
```

---

## Sprint 7 — CI/CD: GitHub Actions + Деплой

**Цель:** При каждом push автоматически проверяется качество кода, при merge в main — деплой
**Время:** 1–2 дня

### Как работает CI/CD

```
git push → GitHub Actions запускает ci.yml
              ↓
           Проверки: ESLint → TypeScript → Build
              ↓
           ✅ Всё ок → можно делать merge в main
              ↓
           Merge в main → deploy.yml → Vercel
```

### Шаг 7.1 — CI: проверки качества

Создать `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint + TypeCheck + Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm' # кэшируем node_modules между запусками

      - name: Install dependencies
        run: npm ci # ci = чистая установка по lock-файлу

      - name: ESLint
        run: npm run lint

      - name: TypeScript check
        run: npx tsc --noEmit # проверяем типы без компиляции файлов

      - name: Build
        run: npm run build
        env:
          # Переменные нужны для сборки (env.ts их читает)
          # Добавить в GitHub: Settings → Secrets and variables → Actions
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

> **Почему `npm ci` а не `npm install`?**
> `npm ci` — удаляет `node_modules` и устанавливает точно по `package-lock.json`. Не обновляет lock-файл. Идеально для CI — воспроизводимые сборки.

### Шаг 7.2 — Deploy: автодеплой на Vercel

**Вариант A (проще): Vercel подключён напрямую к GitHub**

В Vercel Dashboard: Import Project → выбрать репозиторий → автодеплой настроится сам.
Каждый `push main` → деплой без GitHub Actions.

**Вариант B (больше контроля): деплой через GitHub Actions**

Создать `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: [] # можно добавить: needs: [quality] если в одном файле

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Как получить VERCEL_TOKEN, ORG_ID, PROJECT_ID:**

```bash
npm i -g vercel
vercel login
vercel link   # привязывает папку к проекту Vercel, создаёт .vercel/project.json
# В .vercel/project.json: orgId и projectId
# VERCEL_TOKEN: vercel.com → Account Settings → Tokens → Create
```

### Шаг 7.3 — Добавить секреты в GitHub

GitHub репозиторий → Settings → Secrets and variables → Actions → New repository secret:

| Секрет               | Значение                         |
| -------------------- | -------------------------------- |
| `TELEGRAM_BOT_TOKEN` | токен бота из BotFather          |
| `TELEGRAM_CHAT_ID`   | ваш chat id                      |
| `VERCEL_TOKEN`       | токен из Vercel Account Settings |
| `VERCEL_ORG_ID`      | из `.vercel/project.json`        |
| `VERCEL_PROJECT_ID`  | из `.vercel/project.json`        |

### Шаг 7.4 — SEO метаданные

В `src/app/page.tsx`:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Персональный тренер AKS Fit — Онлайн и офлайн',
  description: 'Похудение, набор массы, здоровье. Индивидуальные программы.',
  openGraph: {
    title: 'AKS Fit — Персональный тренер',
    description: 'Запишись на первую бесплатную консультацию',
    images: ['/og-image.jpg'],
  },
};
```

---

## Правила импортов FSD

```typescript
// ✅ Через index.ts нижнего слоя
import { ContactForm } from '@features/send-application';
import { useAppSelector } from '@shared/lib/store/hooks';

// ❌ Мимо index.ts напрямую в файл
import { ContactForm } from '@features/send-application/ui/ContactForm';

// ❌ Из верхнего слоя в нижний
// features не импортирует из widgets или pages
```

---

## Чеклист по завершению каждого спринта

| Sprint | Проверить                                                              |
| ------ | ---------------------------------------------------------------------- |
| 0      | `git commit` запускает lint-staged → ошибка в коде не даёт закоммитить |
| 1      | `npm run dev` без ошибок, Redux DevTools видит store                   |
| 2      | Форма отправляет заявку → TG получает сообщение с кнопкой              |
| 3      | Калькулятор считает верно, кнопка "план питания" шлёт в TG             |
| 4      | Аккордеон FAQ работает, секция "Обо мне" адаптивна                     |
| 5      | Lighthouse PWA score ≥ 80, сайт ставится на телефон                    |
| 6      | `docker compose up` → сайт на localhost:3000 внутри контейнера         |
| 7      | Push в main → CI зелёный → сайт задеплоен на Vercel автоматически      |

---

## Частые ошибки

```
❌ Коммитить .env.local
✅ Проверить .gitignore, никогда не добавлять NEXT_PUBLIC_ к секретным переменным

❌ 'use client' на каждом компоненте
✅ Только где есть useState/useEffect/обработчики событий

❌ Импортировать мимо index.ts в папку слайса
✅ Только через публичный API: import { X } from '@features/send-application'

❌ output: 'standalone' не добавлен → Docker образ не работает
✅ next.config.ts: output: 'standalone' — обязательно для Dockerfile

❌ Секреты прямо в docker-compose.yml или ci.yml
✅ В GitHub Secrets / .env.local — никогда в файлах которые коммитятся
```

---

## Команды

```bash
npm run dev           # Разработка
npm run build         # Сборка
npm run lint          # ESLint
npm run format        # Prettier — форматировать всё
npm run format:check  # Prettier — только проверка (для CI)

npm run docker:dev    # Dev в Docker с hot-reload
npm run docker:prod   # Production в Docker
npm run docker:down   # Остановить контейнеры
npm run docker:logs   # Логи приложения
```
