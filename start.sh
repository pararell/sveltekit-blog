#!/bin/ash
APP_DIR="/usr/app"
APP_DIR_SERVER="/usr/app/server"

VITE_API_URL=http://localhost:7000 npm --prefix=$APP_DIR run build
PORT=7000 npm --prefix=$APP_DIR_SERVER run start