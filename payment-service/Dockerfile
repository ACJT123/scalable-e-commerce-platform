FROM node:20-alpine

WORKDIR /app

COPY package-lock.json package.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3005

CMD ["npm", "start"]