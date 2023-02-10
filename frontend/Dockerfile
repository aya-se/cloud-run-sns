FROM node:lts-buster-slim
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD npm run start