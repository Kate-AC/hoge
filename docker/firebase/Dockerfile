FROM node:18-alpine

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash \
  && apk add openjdk17-jre-headless

RUN npm install -g firebase-tools

WORKDIR /opt/firebase

# FROM ubuntu:22.04

# RUN apt update && \
# apt install -y curl openjdk-17-jdk && \
# curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
# apt install -y nodejs

# RUN npm install -g firebase-tools

# WORKDIR /opt/firebase
