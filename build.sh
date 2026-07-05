#!/bin/bash
set -e
npm install @medusajs/cli@2.17.2
node node_modules/@medusajs/cli/cli.js build
