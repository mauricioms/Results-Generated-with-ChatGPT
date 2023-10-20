#!/bin/bash

cd /app/front-end

npm i
npm run prod

cd /app/back-end

npm i
npm run start

