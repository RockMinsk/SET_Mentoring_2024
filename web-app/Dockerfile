FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm config -g set registry https://registry.npmjs.org/
RUN npm config -g set strict-ssl false

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]