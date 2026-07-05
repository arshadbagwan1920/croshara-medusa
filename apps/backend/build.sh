#!/usr/bin/env bash
set -e

NODE_ENV=development npm install

# Remove broken draft-order admin widget that breaks Vite frontend build
rm -rf ../node_modules/@medusajs/draft-order/.medusa/server/src/admin

node node_modules/@medusajs/cli/cli.js build
