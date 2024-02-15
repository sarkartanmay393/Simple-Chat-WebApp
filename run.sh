#!/bin/bash

npm i concurrently -g
concurrently "cd server && npm i && npm run dev" "cd client && npm i && npm run dev"