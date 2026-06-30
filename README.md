# Content Forge ⚒️

Генератор контента для сайтов. React SPA, которая через API провайдера (OpenAI, Ollama или демо-режим) генерирует структуру страницы, а потом позволяет её отредактировать и экспортировать в HTML. Без бэкенда — всё в браузере, данные в localStorage.

## Фичи

- **3 провайдера**: OpenAI, Ollama, демо (без ключей)
- **Генерация текста**: 3–6 секций по описанию и Tone of Voice
- **Генерация картинок**: DALL-E 3 (OpenAI) или picsum (демо) для hero/image/gallery
- **Редактор**: править текст, урлы картинок, менять порядок секций
- **Превью**: как выглядит страница
- **Экспорт в HTML**: скачать одним файлом
- **Поиск по проектам** на дашборде
- **Статусы**: черновик → генерация → готов

## Стек

| Технология | Назначение |
|---|---|
| React 19 | |
| TypeScript | |
| styled-components | |
| Vite | |
| React Router v7 | |
| OpenAI API / Ollama API | Провайдеры |
| uuid | ID |
| oxlint | Линтер |

## Установка

```bash
npm install
npm run dev      # dev-сервер
npm run build    # сборка
npm run preview  # посмотреть сборку
```

## Быстрый старт

1. Зайти в **Настройки** (⚙️)
2. Выбрать провайдера:
   - **OpenAI** — ввести ключ, выбрать модель
   - **Ollama** — урл сервера (по умолч. http://localhost:11434) и модель
   - **Демо** — ничего, всё в браузере
3. Включить генерацию картинок (опционально)
4. **+ Новый проект** → название, описание, Tone of Voice, промпт
5. После генерации → **Редактор** (править секции, картинки, порядок)
6. **Превью** или **Экспорт HTML**

## Маршруты

| Route | Страница |
|---|---|
| `/` | Список проектов |
| `/new` | Новый проект |
| `/project/:id/generate` | Генерация |
| `/editor/:id` | Редактор секций |
| `/preview/:id` | Превью |
| `/settings` | Настройки |

## Структура

```
content-forge/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   ├── openai.ts        # OpenAI (чат + DALL-E)
│   │   ├── ollama.ts        # Ollama
│   │   └── demo.ts          # Демо-генератор
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SectionBlock.tsx
│   │   ├── PreviewRenderer.tsx
│   │   └── ParticleBackground.tsx
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   └── useGeneration.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NewProject.tsx
│   │   ├── Generate.tsx
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   └── Settings.tsx
│   ├── styles/
│   │   └── glass.ts
│   ├── types.ts
│   ├── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── README.md
```

## Провайдеры

| Провайдер | Ключ | Текст | Картинки |
|---|---|---|---|
| **OpenAI** | нужен | GPT-4o / GPT-3.5 Turbo | DALL-E 3 |
| **Ollama** | нет | любая локальная модель | нет |
| **Демо** | нет | шаблоны в браузере | picsum.photos |

## Ссылки

- OpenAI API key: https://platform.openai.com/api-keys
- Ollama: https://ollama.com
