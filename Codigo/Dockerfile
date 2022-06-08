# Build
FROM node:16-alpine as build

WORKDIR /home/app

COPY package.json ./
COPY yarn.lock ./
COPY .eslintrc.json ./

COPY packages/common ./packages/common
COPY packages/server ./packages/server
COPY packages/app-web ./packages/app-web

RUN yarn install --pure-lockfile --non-interactive

RUN yarn run build:common
RUN yarn run build:server
RUN yarn run build:app-web

RUN yarn run server run orm:run

# Serve
FROM node:16-alpine

WORKDIR /home/app

COPY package.json ./
COPY yarn.lock ./
COPY .eslintrc.json ./

COPY --from=build /home/app/packages/common/package.json /home/app/packages/common/package.json
COPY --from=build /home/app/packages/common/dist /home/app/packages/common/dist

COPY --from=build /home/app/packages/server/package.json /home/app/packages/server/package.json
COPY --from=build /home/app/packages/server/dist /home/app/packages/server/dist
COPY --from=build /home/app/packages/server/public /home/app/packages/server/public

COPY --from=build /home/app/packages/app-web/build /home/app/packages/server/public/app-web

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /home/app/packages/server

EXPOSE 4025
EXPOSE 5432
EXPOSE 1025

CMD ["yarn", "start:prod"]