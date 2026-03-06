# Объяснения

---

## FSD (Feature-Sliced Design)

### Главная идея

Обычный подход группирует файлы **по типу**: `components/`, `hooks/`, `utils/`.
FSD группирует **по смыслу**: каждый кусок кода знает за что отвечает.

---

### Слои — строгая иерархия

```
app → pages → widgets → features → entities → shared
```

**Правило одно:** каждый слой может импортировать только из слоёв **ниже** себя.

В этом проекте:

```
src/
├── app/          ← Next.js роутинг, layout
├── pages/        ← сборка страниц из виджетов
├── widgets/      ← крупные независимые блоки
├── entities/     ← бизнес-сущности (пока пустой)
├── features/     ← действия пользователя (пока пустой)
└── shared/       ← переиспользуемые вещи
```

---

### Слайс — единица внутри слоя

Каждая папка внутри слоя — это **слайс**. Смотри на `widgets/`:

```
widgets/
├── header/      ← слайс "шапка"
├── hero/        ← слайс "главный экран"
├── about/       ← слайс "о нас"
├── services/    ← слайс "услуги"
├── reviews/     ← слайс "отзывы"
├── contacts/    ← слайс "контакты"
└── footer/      ← слайс "подвал"
```

Каждый слайс **изолирован** — он не знает о существовании соседей.

---

### Сегменты — структура внутри слайса

`widgets/reviews/` — хороший пример:

```
widgets/reviews/
├── ui/
│   ├── ReviewsSection.tsx        ← React-компонент
│   └── ReviewsSection.module.scss
├── model/
│   ├── index.ts                  ← реэкспорт
│   └── testimonials.ts           ← данные (тип + массив)
└── index.ts                      ← публичный API
```

- `model/` хранит **данные** (что показывать)
- `ui/` хранит **UI** (как показывать)
- `index.ts` — единственная дверь наружу

---

### Публичный API (index.ts)

```ts
// ✅ Правильно — через index.ts
import { ReviewsSection } from '@/widgets/reviews';

// ❌ Неправильно — мимо index.ts
import { ReviewsSection } from '@/widgets/reviews/ui/ReviewsSection';
```

Если переименуешь файл внутри — снаружи ничего не сломается.

---

### Цепочка слоёв в проекте

```
app/page.tsx
  └── pages/home/HomePage.tsx   ← собирает виджеты
        ├── widgets/header/
        ├── widgets/hero/
        ├── widgets/about/
        ├── widgets/services/
        ├── widgets/reviews/
        ├── widgets/contacts/
        └── widgets/footer/
              └── shared/ui/Button   ← переиспользуемый UI
```

Направление импортов: только вниз ↓

---

### Что нельзя делать

```ts
// ❌ widgets импортирует другой widget
// widgets/home/HomePage.tsx
import { Header } from '@/widgets/header'; // НАРУШЕНИЕ!

// ✅ Это задача pages слоя
// pages/home/HomePage.tsx
import { Header } from '@/widgets/header'; // ок — pages → widgets
```

---

### Итоговая схема

```
┌─────────────────────────────────────────┐
│  APP    │  layout.tsx, page.tsx          │
├─────────────────────────────────────────┤
│  PAGES  │  pages/home/HomePage.tsx       │ ← собирает виджеты
├─────────────────────────────────────────┤
│ WIDGETS │  header, hero, about,          │ ← независимые блоки
│         │  services, reviews, contacts,  │
│         │  footer                        │
├─────────────────────────────────────────┤
│ FEATURE │  (будет: send-application,     │
│         │   calculate-nutrition)         │
├─────────────────────────────────────────┤
│ ENTITY  │  (будет: Application, User)    │
├─────────────────────────────────────────┤
│ SHARED  │  ui/Button, hooks/, styles/    │ ← общая инфраструктура
└─────────────────────────────────────────┘
```
