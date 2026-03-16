# Объяснения

---

## Next.js Image: width/height и пропорции

`<Image>` из `next/image` требует явно указать `width` и `height` — это нужно для резервирования места в DOM до загрузки картинки (предотвращает CLS — прыжки верстки).

**Проблема:** если CSS меняет одно измерение (например `width: max-content`) и не трогает второе — браузер не знает, как пересчитать пропорции.

**Правило Next.js:** если CSS меняет `width` → в CSS должен быть `height: auto` (и наоборот).

```scss
.reviewsIcon {
  width: max-content;
  height: auto; // ← говорим браузеру: сам пересчитай высоту
}
```

---

## `scroll-behavior: smooth` и Next.js роутинг

`scroll-behavior: smooth` в CSS делает все скроллы на странице плавными — в том числе когда Next.js при переходе на новую страницу скроллит в начало.

**Проблема:** Next.js хочет отключить плавный скролл во время перехода (иначе пользователь видит медленный скролл вверх). Для этого он ищет `data-scroll-behavior="smooth"` на элементе `<html>` — это его сигнал "здесь есть плавный скролл, я его временно отключу".

**Без атрибута:** Next.js не может отключить smooth scroll → предупреждение в консоли.

```tsx
<html lang="en" data-scroll-behavior="smooth">
```

Это не включает smooth scroll — он уже включён в CSS. Атрибут просто говорит Next.js: "я знаю о нём, управляй им".

---

## ESLint ошибки при коммите (husky + lint-staged)

**Контекст:** В проекте настроен husky — он запускает ESLint перед каждым коммитом. Флаг `--max-warnings=0` означает: даже предупреждения блокируют коммит.

### 1. `<a>` вместо `<Link>` (error)
Next.js запрещает `<a href="/...">` для внутренних страниц — это делает полную перезагрузку браузера.
`<Link href="...">` из `next/link` — клиентская навигация без перезагрузки (быстрее, сохраняет состояние).
**Внешние ссылки** (https://...) — обычный `<a>` нормален.

### 2. `useEffect` без зависимостей (warning)
```ts
useEffect(() => {
  // используем containerRef, wrapperRef, contentRef
}, []); // ← ESLint: ты используешь эти переменные, но не указал их!
```
Рефы (`useRef`) технически стабильны (объект не меняется), поэтому безопасно добавить их в deps:
```ts
}, [containerRef, wrapperRef, contentRef]);
```

### 3. `watch()` несовместим с React Compiler (warning)
React Compiler — экспериментальная фича, которая автоматически мемоизирует компоненты.
`watch()` от react-hook-form возвращает новую функцию каждый рендер → компилятор не может её безопасно кешировать → выдаёт предупреждение и пропускает мемоизацию этого компонента.
Решение: отключить проверку для конкретной строки через `// eslint-disable-next-line`.

### 4. `console.log` запрещён (warning)
ESLint-правило `no-console` в проекте разрешает только `console.error` и `console.warn`.
`console.log` — отладочный вывод, который не должен попадать в продакшн.
Если нужна заглушка для TODO — просто удаляй `console.log`, логика придёт позже.

---

## App Router vs Pages Router конфликт (Next.js)

**Проблема:** Next.js поддерживает два роутера:
- **Pages Router** (старый) — работает через директорию `src/pages/`
- **App Router** (новый) — работает через директорию `src/app/`

Если оба существуют в проекте одновременно, Next.js пытается их поддерживать параллельно. Но если один и тот же путь (`/blog`, `/calculator`) есть в обоих — он падает с ошибкой конфликта.

**Почему возникло:** В FSD есть слой `pages/` — это компоненты-страницы (не роутинг). Но Next.js видит `src/pages/blog/index.ts` и думает: "это маршрут `/blog` в Pages Router". Одновременно `src/app/blog/page.tsx` — это маршрут `/blog` в App Router. Конфликт.

**Решение:** Переименовать FSD слой `pages` → `views`.
`src/views/` Next.js не трогает — это просто папка с компонентами.

```
src/
  app/          ← Next.js App Router (маршруты)
    blog/page.tsx     → /blog
    calculator/page.tsx → /calculator
  views/        ← FSD слой (просто компоненты, не роутинг)
    blog/
    calculator/
    home/
```

**Правило:** В проекте с Next.js App Router никогда не называй FSD слой `pages/` — используй `views/`.

---

## Анимация вращения телефона (ProcessSection)

### Что видит пользователь

Изображение телефона плавно покачивается само по себе. Когда наводишь курсор — телефон поворачивается вслед за мышью. Убираешь курсор — возвращается к покачиванию.

---

### Из чего состоит

**3D-пространство в CSS:**

```scss
.phoneWrapper {
  perspective: 800px; // создаёт "глубину" — без этого 3D не видно
}

.phoneRotate {
  transform-style: preserve-3d; // дочерние элементы тоже в 3D
  will-change: transform;       // подсказка браузеру: готовь GPU
}
```

`perspective` — это как расстояние от глаз до экрана. Чем меньше число, тем сильнее искажение перспективы.

**Поворот через CSS-трансформацию:**

```
rotateX(Xdeg) — наклон вперёд/назад (ось X — горизонтальная)
rotateY(Ydeg) — поворот влево/вправо (ось Y — вертикальная)
```

---

### requestAnimationFrame — игровой цикл

```ts
const tick = () => {
  // обновить позицию...
  rafId = requestAnimationFrame(tick); // вызвать себя снова
};
requestAnimationFrame(tick); // запустить
```

`requestAnimationFrame` вызывает функцию перед каждым кадром браузера (~60 раз в секунду). Это как `setInterval(fn, 16ms)`, но умнее: браузер сам выбирает момент, не тратит ресурсы на скрытых вкладках.

---

### lerp — плавное движение

```ts
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

rx = lerp(rx, targetRx, 0.08); // текущее → целевое, шаг 8%
```

**Линейная интерполяция (lerp)** — каждый кадр двигаемся на `t` часть от расстояния до цели.

```
targetRx = 30°, rx = 0°
кадр 1: rx = 0 + (30-0)*0.08 = 2.4°
кадр 2: rx = 2.4 + (30-2.4)*0.08 = 4.6°
кадр 3: rx = 4.6 + (30-4.6)*0.08 = 6.6°
...
```

Чем ближе к цели — тем медленнее. Получается плавное замедление, без CSS `transition`.

---

### Авто-анимация (когда мышь не над телефоном)

```ts
if (!hasInteracted) {
  time += 0.015;
  targetRy = Math.sin(time) * 25;      // качание влево-вправо
  targetRx = Math.cos(time * 0.8) * 15; // наклон вперёд-назад
}
```

`Math.sin` и `Math.cos` возвращают значения от -1 до 1, которые плавно меняются со временем. Умножаем на амплитуду (25° и 15°). Разные коэффициенты скорости (`time` vs `time * 0.8`) дают ощущение неравномерного, живого движения.

---

### Реакция на мышь

```ts
const onMouseMove = (e: MouseEvent) => {
  hasInteracted = true;
  const rect = phoneEl.getBoundingClientRect(); // координаты элемента
  const cx = rect.left + rect.width / 2;        // центр X
  const cy = rect.top + rect.height / 2;         // центр Y

  const dx = e.clientX - cx; // насколько мышь правее центра
  const dy = e.clientY - cy; // насколько мышь ниже центра

  const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.45;
  const maxTilt = 40;

  targetRy = (dx / maxDist) * maxTilt; // мышь вправо → поворот вправо
  targetRx = -(dy / maxDist) * maxTilt; // мышь вниз → наклон назад
};
```

Мышь в центре телефона → `dx = 0, dy = 0` → нет поворота.
Мышь у края → максимум ±40°. `Math.max/Math.min` не даёт выйти за предел.

---

### Полная схема работы

```
requestAnimationFrame запускает tick() ~60 раз/сек
        │
        ▼
   hasInteracted?
   ├── НЕТ → sin/cos → targetRx/targetRy (авто-качание)
   └── ДА  → mousemove уже выставил targetRx/targetRy
        │
        ▼
   lerp(rx → targetRx)   // плавно догоняем цель
   lerp(ry → targetRy)
        │
        ▼
   phoneEl.style.transform = rotateX(rx) rotateY(ry)
```

---

### Очистка в useEffect

```ts
return () => {
  phoneEl.removeEventListener('mousemove', onMouseMove);
  phoneEl.removeEventListener('mouseleave', onMouseLeave);
  cancelAnimationFrame(rafId); // останавливаем цикл
};
```

React вызывает эту функцию когда компонент удаляется со страницы. Без очистки — `requestAnimationFrame` продолжал бы крутиться в памяти вечно (утечка).

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
