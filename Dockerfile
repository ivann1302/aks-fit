# --- Этап 1: зависимости ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
ENV HUSKY=0
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