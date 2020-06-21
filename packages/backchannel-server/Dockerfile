FROM node:13.12.0-alpine as build
WORKDIR /app
COPY lib ./lib
COPY index.ts ./
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn install
RUN yarn build

FROM node:13.12.0-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install --prod
ENV PORT=8080
CMD yarn start
EXPOSE 8080 