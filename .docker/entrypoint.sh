#!/bin/bash

cd /home/app

npm install -g yarn

yarn install
yarn run dev:server
