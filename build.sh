#!/bin/bash
set -e

NODE_ENV=development npm install

# @medusajs/medusa lists draft-order as a dep, but its admin bundle is broken
# Remove it so Vite doesn't try to compile the busted admin widgets
rm -rf node_modules/@medusajs/draft-order

node node_modules/@medusajs/cli/cli.js build
