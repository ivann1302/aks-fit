# Установка и настройка проекта — личные заметки

> Этот файл не коммитится (.gitignore). Храни здесь токены-тестовые, личные заметки, команды.

---

## Почему именно этот стек

| Инструмент             | Зачем                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **Node.js 18.17+**     | Движок для запуска Next.js. Версия 18+ нужна для нативного fetch и нового App Router                   |
| **Next.js 15**         | Даёт SSR/SSG из коробки, API Routes (бэкенд без отдельного сервера), оптимизацию изображений и шрифтов |
| **React 19**           | Идёт в комплекте с Next.js 15. Новые хуки (`use`, `useFormStatus`), улучшенный Concurrent Mode         |
| **TypeScript**         | Ловит ошибки до запуска кода. В больших проектах экономит часы отладки                                 |
| **SCSS + CSS Modules** | SCSS = переменные, миксины, вложенность. Modules = стили не текут между компонентами (локальный scope) |
| **Redux Toolkit**      | Управление глобальным состоянием (калькулятор, статус форм). RTK убирает бойлерплейт Redux             |
| **react-hook-form**    | Лёгкая библиотека для форм. Меньше ре-рендеров чем controlled inputs, встроенная валидация             |
| **next-pwa**           | Добавляет Service Worker и оффлайн-поддержку. Сайт устанавливается на телефон как приложение           |
| **framer-motion**      | Анимации (опционально). Простое API для плавных переходов между секциями                               |

---

## Шаг 1 — Установить Node.js

```bash
# Проверить текущую версию
node -v   # нужно 18.17.0 или выше
npm -v    # нужно 9+

# Если Node.js нет — скачать LTS с nodejs.org
# Или через nvm (Node Version Manager) — рекомендуется:

# Установить nvm (Linux/Mac)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Перезапустить терминал, затем:
nvm install --lts        # установить последний LTS
nvm use --lts            # активировать его
nvm alias default lts/*  # сделать дефолтным
```

**Почему nvm?** Позволяет переключаться между версиями Node.js для разных проектов без конфликтов.

---

## Шаг 2 — Создать проект Next.js

```bash
npx create-next-app@latest aks-fit
```

**Отвечать на вопросы установщика:**

```
✔ Would you like to use TypeScript?          › Yes
✔ Would you like to use ESLint?              › Yes
✔ Would you like to use Tailwind CSS?        › No   ← используем SCSS
✔ Would you like your code inside a `src/`? › Yes
✔ Would you like to use App Router?          › Yes
✔ Would you like to use Turbopack?           › Yes  ← быстрее webpack
✔ Would you like to customize the alias?     › No
```

**Почему App Router, а не Pages Router?**
App Router (папка `app/`) — это новый подход Next.js 13+. Поддерживает React Server Components, layouts, параллельные роуты. Pages Router устарел.

---

## Шаг 3 — Установить зависимости

```bash
cd aks-fit

# --- Обязательные ---

# Redux Toolkit: createSlice, createAsyncThunk, configureStore
# react-redux: Provider, useSelector, useDispatch
npm install @reduxjs/toolkit react-redux
# Почему RTK а не чистый Redux? RTK = Redux + Immer + DevTools из коробки.
# Меньше кода, нет мутаций вручную, встроенный thunk.

# SCSS: препроцессор CSS
npm install sass
# Почему sass а не node-sass? node-sass устарел, sass — официальная Dart Sass реализация.

# PWA: Service Worker + манифест
npm install next-pwa
# Автоматически генерирует sw.js при сборке. Не нужно писать SW вручную.

# Формы: регистрация полей, валидация, submit
npm install react-hook-form
# Почему не Formik? react-hook-form быстрее (uncontrolled inputs),
# меньше весит, проще API для простых форм.

# --- Dev-зависимости (только для разработки, не попадают в бандл) ---

# Типы для Node.js (для NextRequest, NextResponse в API Routes)
npm install -D @types/node
```

**Опционально — анимации:**

```bash
npm install framer-motion
# Если нужны плавные появления секций, анимация кнопок, переходы страниц.
# Устанавливай только если реально используешь — добавляет ~50кб в бандл.
```

---

## Шаг 4 — Настроить Telegram Bot

### 4.1 Создать бота

1. Открыть Telegram → найти `@BotFather`
2. Написать `/newbot`
3. Придумать имя (отображается): `AKS Fit Bot`
4. Придумать username (уникальный): `aksfit_notify_bot`
5. BotFather пришлёт токен вида: `1234567890:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4.2 Получить Chat ID

**Способ 1 — через userinfobot:**

1. Написать боту `/start`
2. Открыть `@userinfobot` → он пришлёт твой Chat ID

**Способ 2 — через API:**

```bash
# Замени YOUR_TOKEN на токен бота
curl https://api.telegram.org/botYOUR_TOKEN/getUpdates
# После того как написал боту — в ответе будет "chat":{"id":123456789}
```

### 4.3 Создать .env.local

```bash
# В корне проекта (aks-fit/.env.local)
# Этот файл уже в .gitignore у Next.js — токен не утечёт в git
```

Содержимое `.env.local`:

```env
TELEGRAM_BOT_TOKEN=1234567890:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=123456789
```

**Почему переменные на сервере, а не на фронте?**
Если написать `NEXT_PUBLIC_BOT_TOKEN` — токен попадёт в JS-бандл и будет виден любому в DevTools.
Без `NEXT_PUBLIC_` — переменная доступна только в `API Routes` (серверный код), никогда не отправляется клиенту.

---

## Шаг 5 — Настроить VS Code

### Расширения (обязательные)

```
ESLint              — подсвечивает ошибки JS/TS в реальном времени
Prettier            — форматирует код при сохранении
SCSS IntelliSense   — автодополнение для SCSS переменных и миксинов
```

### Расширения (рекомендуемые)

```
Error Lens          — показывает ошибки прямо на строке (не только снизу)
GitLens             — история изменений, blame, сравнение веток
Auto Rename Tag     — переименовывает закрывающий тег при изменении открывающего
ES7+ React snippets — быстрые сниппеты: rafce → компонент, useState → хук
Redux DevTools      — расширение браузера для отладки Redux store
```

### Настройки VS Code (.vscode/settings.json)

Создать файл `.vscode/settings.json` в корне проекта:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "scss.validate": false,
  "css.validate": false
}
```

> `scss.validate: false` — отключает встроенный SCSS валидатор VS Code, который не понимает кастомные миксины и ругается ложными ошибками.

---

## Шаг 6 — Проверить что всё работает

```bash
# Запустить dev-сервер
npm run dev

# Открыть в браузере
# http://localhost:3000 — должна открыться страница Next.js

# Проверить сборку (ловит TypeScript ошибки)
npm run build

# Проверить линтер
npm run lint
```

---

## Частые проблемы при установке

### Ошибка: `Cannot find module 'sass'`

```bash
npm install sass --save-dev
# Перезапустить dev-сервер
```

### Ошибка: `Module not found: @shared/...`

```bash
# Проверить tsconfig.json — должны быть paths алиасы
# Перезапустить VS Code (Ctrl+Shift+P → "Developer: Reload Window")
```

### Ошибка: `TELEGRAM_BOT_TOKEN is not defined`

```bash
# Убедиться что .env.local существует в корне проекта (рядом с package.json)
# Переменные без NEXT_PUBLIC_ работают ТОЛЬКО в API Routes, не в клиентском коде
# Перезапустить dev-сервер после изменения .env.local
```

### PWA не работает локально

```bash
# next-pwa отключён в development по умолчанию (disable: process.env.NODE_ENV === 'development')
# Для теста PWA нужна production сборка:
npm run build && npm start
# Затем открыть Chrome → DevTools → Lighthouse → PWA
```

---

## Мои данные (заполни сам — файл не попадёт в git)

```
Vercel URL:        https://...
Telegram Bot Name: @...
Chat ID:           ...
Домен (если есть): ...
```
