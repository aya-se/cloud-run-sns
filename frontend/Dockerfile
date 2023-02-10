FROM node:lts-buster-slim
WORKDIR /app
COPY . .
RUN npm install && cd src && npm run build
CMD npm run start