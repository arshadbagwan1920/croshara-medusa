#!/bin/bash
set -e
npm install --no-save @medusajs/cli@2.17.2 ts-node tsconfig-paths
node node_modules/@medusajs/cli/cli.js build
