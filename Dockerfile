# Этап 1: Сборка Python
FROM python:latest AS python-build
WORKDIR /app
RUN pwd

# Установка зависимостей Python
COPY . .
WORKDIR /app/backend/algorithms
# RUN ls requirements.txt
RUN pip install -r requirements.txt

# Этап 2: Сборка Node.js
FROM node:14
WORKDIR /app

# Копирование остальных файлов проекта
COPY . .

# Установка зависимостей Node.js
COPY package*.json ./

RUN npm install

# Копирование файлов Python из предыдущего этапа
COPY --from=python-build /app .

# Открытие порта 8080
EXPOSE 8080

# Запуск приложения
WORKDIR /app/backend
CMD [ "node", "server.js" ]