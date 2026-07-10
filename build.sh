#!/bin/bash
set -e

NODE_ENV=development npm install

# @medusajs/medusa lists draft-order as a dep, but its admin bundle is broken.
# Replace admin entry with an empty stub so Vite resolves the import successfully.
rm -rf node_modules/@medusajs/draft-order/.medusa/server/src/admin
mkdir -p node_modules/@medusajs/draft-order/.medusa/server/src/admin
cat > node_modules/@medusajs/draft-order/.medusa/server/src/admin/index.mjs << 'ADMIN_STUB'
const noop = {}
export { noop as default, noop }
ADMIN_STUB
cp node_modules/@medusajs/draft-order/.medusa/server/src/admin/index.mjs node_modules/@medusajs/draft-order/.medusa/server/src/admin/index.js

node node_modules/@medusajs/cli/cli.js build
