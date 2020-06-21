FROM node:13.12.0-alpine as build
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
COPY yarn.lock ./
RUN yarn install
ENV REACT_APP_WS_ENDPOINT=ws://localhost:8080
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
