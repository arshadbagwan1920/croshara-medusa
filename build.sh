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

# Admin build goes to .medusa/server/public/admin/ but server looks in public/admin/
mkdir -p public/admin
if [ -d .medusa/server/public/admin ]; then
  cp -r .medusa/server/public/admin/* public/admin/
  echo "=== Copied admin build to public/admin/ ==="
else
  echo "=== WARNING: no admin build found at .medusa/server/public/admin ==="
  # Create a minimal index.html so server doesn't crash
  echo '<!DOCTYPE html><html><body>Admin loading...</body></html>' > public/admin/index.html
fi

node node_modules/@medusajs/cli/cli.js db:migrate
