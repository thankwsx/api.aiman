# 使用最新版node
FROM node:lts-slim

WORKDIR /app

COPY package.json /app/package.json

USER node

COPY --chown=node:node . .

RUN npm install
EXPOSE 80

CMD ["node", "index.js"]
