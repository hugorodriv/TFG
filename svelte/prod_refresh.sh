#!/bin/bash

# Abort if command exits with non 0 code
set -e

# Make sure PWD is /svelte/ folder
# CD into the folder in which this script is located
cd "$(dirname "$0")"

git fetch
git pull
docker-compose down
docker-compose up --build --force-recreate -d
