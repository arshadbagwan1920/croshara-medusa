#!/bin/bash
set -e

NODE_ENV=development npm install

# @medusajs/medusa lists draft-order as a dep, but its admin bundle uses
# defineRouteConfig which Vite can't resolve (broken optional peer dep).
# Replace with empty stubs so Vite resolves the import but loads nothing.
rm -rf node_modules/@medusajs/draft-order/.medusa/server/src/admin
mkdir -p node_modules/@medusajs/draft-order/.medusa/server/src/admin
printf '%s\n' 'export default {}' > node_modules/@medusajs/draft-order/.medusa/server/src/admin/index.mjs
printf '%s\n' 'module.exports = {}' > node_modules/@medusajs/draft-order/.medusa/server/src/admin/index.js

node node_modules/@medusajs/cli/cli.js build

# Debug: list admin build artifacts after build
echo "=== Build artifacts ==="
find .medusa -type f 2>/dev/null | head -30 || echo "(no .medusa dir)"
find build -type f 2>/dev/null | head -30 || echo "(no build dir)"
echo "=== End ==="

node node_modules/@medusajs/cli/cli.js db:migrate
