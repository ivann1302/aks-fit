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

## Шаг 7 — Docker: обернуть приложение в контейнер

Docker позволяет запускать приложение в изолированной среде — одинаково на любом сервере и в CI.

### 7.1 Создать Dockerfile

Файл `Dockerfile` в корне проекта:

```dockerfile
# --- Этап 1: зависимости ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Этап 2: сборка ---
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
# Переменные окружения нужные при сборке (не секреты!)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Этап 3: продакшн-образ (минимальный) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаём непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только то, что нужно для запуска
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> Многоэтапная сборка (multi-stage) — финальный образ не содержит node_modules и исходников. Весит ~100MB вместо ~1GB.

### 7.2 Создать .dockerignore

Файл `.dockerignore` в корне — чтобы не копировать лишнее в образ:

```
node_modules
.next
.git
.env.local
.env*.local
*.md
.vscode
.husky
coverage
```

### 7.3 Включить standalone-вывод в Next.js

В `next.config.ts` добавить опцию `output`:

```ts
const nextConfig = {
  output: 'standalone',
  // ... остальные настройки
}
```

> `standalone` — Next.js соберёт минимальный набор файлов для запуска без npm. Нужно для Docker.

### 7.4 Создать docker-compose.yml

Для удобного локального запуска:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
    env_file:
      - .env.local
    restart: unless-stopped
```

### 7.5 Команды Docker

```bash
# Собрать образ
docker build -t aks-fit .

# Запустить контейнер
docker run -p 3000:3000 --env-file .env.local aks-fit

# Через docker-compose (рекомендуется локально)
docker compose up --build       # пересобрать и запустить
docker compose up -d            # в фоне
docker compose down             # остановить
docker compose logs -f app      # смотреть логи

# Проверить образы
docker images | grep aks-fit

# Войти внутрь контейнера для отладки
docker exec -it <container_id> sh
```

---

## Шаг 8 — CI/CD: автоматические проверки через GitHub Actions

CI запускается при каждом push и PR — автоматически проверяет линтер и сборку.

### 8.1 Создать структуру папок

```bash
mkdir -p .github/workflows
```

### 8.2 Создать workflow: линтер + сборка

Файл `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    name: Lint & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Build
        run: npm run build
        env:
          # Заглушки для переменных окружения при сборке в CI
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

### 8.3 Создать workflow: сборка Docker-образа

Файл `.github/workflows/docker.yml` — проверяет, что образ собирается:

```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  docker:
    name: Build Docker image
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build image
        run: docker build -t aks-fit:${{ github.sha }} .
```

### 8.4 Добавить секреты в GitHub

Чтобы CI имел доступ к переменным окружения:

1. Открыть репозиторий на GitHub
2. **Settings → Secrets and variables → Actions**
3. Нажать **New repository secret**
4. Добавить:
   - `TELEGRAM_BOT_TOKEN` → твой токен
   - `TELEGRAM_CHAT_ID` → твой chat id

### 8.5 Структура .github после настройки

```
.github/
  workflows/
    ci.yml        ← линтер + сборка на каждый PR
    docker.yml    ← сборка Docker-образа при мерже в main
```

---

## Шаг 9 — Git Flow: имитация командной работы

Git Flow — это соглашение о ветках. Позволяет работать структурированно даже в одиночку.

### 9.1 Схема веток

```
main        ← стабильный продакшн (деплоится автоматически)
develop     ← интеграционная ветка (сюда сливаются фичи)
feature/*   ← новая функциональность
fix/*       ← исправление багов
chore/*     ← технические задачи (конфиги, зависимости, рефакторинг)
```

**Правило:** в `main` и `develop` нельзя пушить напрямую — только через Pull Request.

### 9.2 Начальная настройка

```bash
# Создать ветку develop от main
git checkout main
git checkout -b develop
git push -u origin develop
```

### 9.3 Жизненный цикл задачи (Feature Flow)

```bash
# 1. Начать работу над фичей — всегда от develop
git checkout develop
git pull origin develop
git checkout -b feature/hero-section

# 2. Работать, коммитить по мере прогресса
git add src/components/Hero/
git commit -m "feat: add hero section layout"

git add src/components/Hero/Hero.module.scss
git commit -m "feat: add hero section styles"

# 3. Пушить ветку на GitHub
git push -u origin feature/hero-section

# 4. Открыть Pull Request: feature/hero-section → develop
#    (через GitHub UI или gh CLI)
gh pr create --base develop --title "feat: hero section" --body "Добавил секцию Hero с анимацией"

# 5. После апрува мержим PR (через GitHub)
# 6. Удалить ветку после мержа
git branch -d feature/hero-section
git push origin --delete feature/hero-section
```

### 9.4 Конвенция именования коммитов (Conventional Commits)

```
feat:     новая функциональность
fix:      исправление бага
chore:    техническое (конфиги, зависимости)
style:    форматирование, без изменения логики
refactor: рефакторинг без новых фич и багфиксов
docs:     документация
test:     тесты
```

**Примеры:**

```bash
git commit -m "feat: add calculator section"
git commit -m "fix: telegram api error handling"
git commit -m "chore: update eslint config"
git commit -m "style: format hero component"
git commit -m "refactor: extract form validation logic"
```

### 9.5 Релиз в продакшн

```bash
# Когда develop готов к релизу — мержим в main через PR
gh pr create --base main --head develop --title "release: v1.0.0" --body "Релиз первой версии"

# После мержа — тегируем версию
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 9.6 Хотфикс (баг в продакшне)

```bash
# Исправление срочного бага — ветвимся от main, а не develop
git checkout main
git checkout -b fix/form-submit-crash

git commit -m "fix: form submit crash on mobile"

# PR: fix/form-submit-crash → main (срочно)
# Затем тот же фикс мержим в develop:
git checkout develop
git merge fix/form-submit-crash
```

### 9.7 Шпаргалка по командам

```bash
# Посмотреть все ветки
git branch -a

# Переключиться на develop и обновить
git checkout develop && git pull

# Посмотреть историю в виде дерева
git log --oneline --graph --all

# Посмотреть список PR через GitHub CLI
gh pr list

# Проверить статус CI для текущей ветки
gh run list --branch $(git branch --show-current)
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

### Docker: ошибка `ENOENT: no such file or directory, open '/app/.next/standalone/server.js'`

```bash
# Убедиться что в next.config.ts есть: output: 'standalone'
# Пересобрать образ после изменения конфига:
docker build --no-cache -t aks-fit .
```

### CI падает на шаге lint

```bash
# Запустить локально те же команды что в CI:
npm run lint
npm run format:check
npm run build
# Исправить все ошибки до пуша
```

---

## Мои данные (заполни сам — файл не попадёт в git)

```
Vercel URL:        https://...
Telegram Bot Name: @...
Chat ID:           ...
Домен (если есть): ...
GitHub repo:       https://github.com/...
```
