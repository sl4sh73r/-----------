# Этап 1: Сборка Python
FROM python:3.8-slim-buster AS python-build
WORKDIR /app

# Копирование файла requirements.txt и установка зависимостей Python
COPY ./backend/algorithms/requirements.txt .
RUN pip install -r requirements.txt

# Копирование остальных файлов проекта
COPY . .

# Этап 2: Сборка Node.js
FROM node:14
WORKDIR /app

# Копирование остальных файлов проекта
COPY . .

# Установка зависимостей Node.js
RUN npm install

# Копирование установленных Python-зависимостей из контейнера python-build
COPY --from=python-build /usr/local /usr/local

# Открытие порта 8080
EXPOSE 8080

# Запуск приложения
WORKDIR /app/backend
CMD [ "node", "server.js" ]