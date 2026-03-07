# add-good-vue

Vue 3 + Vite landing page.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Railway deploy

Проект уже подготовлен под Railway:

- Добавлен [`railway.json`](./railway.json) с build/start командами.
- Добавлен `start`-скрипт в `package.json` с поддержкой порта из переменной `PORT`.
- Для сборки в Railway используется `npm install --include=dev && npm run build` (вместо `npm ci`), чтобы избежать `EBUSY` на кэшируемом `node_modules/.vite`.

Как задеплоить:

1. Запушить репозиторий на GitHub.
2. В Railway создать `New Project -> Deploy from GitHub repo`.
3. Выбрать этот репозиторий и дождаться первого деплоя.
4. В сервисе Railway открыть `Settings -> Networking` и нажать `Generate Domain`.
