#!/bin/bash
set -e
NODE_ENV=development npm install
node node_modules/@medusajs/cli/cli.js build
