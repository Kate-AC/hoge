FROM node:18-alpine3.15

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash

WORKDIR /project
ADD . .

RUN npm upgrade
RUN npm install -g npm@9.1.1
RUN npm install -g @nestjs/cli
RUN npm install -g firebase-tools
