## Установка и сборка проекта

#### Установите внешние зависимости

```sh
$ npm install
```

#### Запустите сборщик

```sh
$ npm start
```

В результате создастся папка _dist_, в которой окажутся готовые для дальнейшего использования html-файлы.

## Структура

```
├── src/
│   ├── fonts/
│   ├── images/
│   ├── js/
│   ├── pug/
│   └── scss/
```

npm run start команда для разработки локально.Страницу можно открыть в браузере по адресу http://localhost:3010, либо просто найти нужный файл в итоговой папке dist.
Занимает порт 3010, будьте внимательны при запуске, чтобы иные программы не занимали этот порт.
Для сборки production версии команда - npm run minify. Собирает файлы и кладет в dist папку.
Для проверки правильности js и scss файлов - команда npm run lint-prod