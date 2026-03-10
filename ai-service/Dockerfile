FROM node:20

WORKDIR /app

COPY . .

WORKDIR /app/src

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]