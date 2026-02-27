import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Отключает ESLint-правила, конфликтующие с Prettier — должен быть последним
  eslintConfigPrettier,
  {
    rules: {
      // console.log в коде — предупреждение, console.error/warn — допустимы
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      // Неиспользуемые переменные — ошибка (исключение: _prefix)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // any — предупреждение, не блокирует (для джуна норм на старте)
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
