#!/bin/bash
set -e

NODE_ENV=development npm install

# @medusajs/medusa lists draft-order as a dep, but its admin frontend bundle is broken
# Remove only the admin widget files so Vite skips them, keep the package.json for type resolution
rm -rf node_modules/@medusajs/draft-order/.medusa/server/src/admin

node node_modules/@medusajs/cli/cli.js build
