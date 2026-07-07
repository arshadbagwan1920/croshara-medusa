#!/usr/bin/env bash
set -e

# Install ALL deps (including devDeps needed for build)
NODE_ENV=development npm install

# Delete draft-order entirely (not in package.json, but npm workspaces may hoist stale copies)
rm -rf ../../node_modules/@medusajs/draft-order 2>/dev/null || true
rm -rf node_modules/@medusajs/draft-order 2>/dev/null || true

node node_modules/@medusajs/cli/cli.js build
