# 使用最新版node
FROM node:lts-slim

WORKDIR /app

RUN mkdir -p /app/node_modules && chown -R node:node /app

COPY package.json /app/package.json

USER node

COPY --chown=node:node . .

RUN npm install
EXPOSE 8080

CMD ["node", "index.js"]
