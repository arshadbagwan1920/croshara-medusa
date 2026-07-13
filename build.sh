#!/bin/bash
set -e

# npm install needs more memory for dependency resolution on 512MB free tier
NODE_OPTIONS="--max-old-space-size=448" npm install --no-audit --no-fund --no-optional

# Tighten heap for subsequent Node.js commands
export NODE_OPTIONS="--max-old-space-size=384"

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

node node_modules/@medusajs/cli/cli.js exec src/scripts/seed.ts
node node_modules/@medusajs/cli/cli.js exec src/scripts/create-admin.ts
node node_modules/@medusajs/cli/cli.js exec src/scripts/create-api-key.ts
node node_modules/@medusajs/cli/cli.js exec src/scripts/setup-prices.ts
node node_modules/@medusajs/cli/cli.js exec src/scripts/setup-stock.ts
node node_modules/@medusajs/cli/cli.js exec src/scripts/setup-shipping-v2.ts

# Link all products to default shipping profile (required for checkout)
psql "$DATABASE_URL" -c "INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at) SELECT gen_random_uuid()::text, p.id, 'sp_01KXD7KJRX0MCSKST9JWA5EZCM', NOW(), NOW() FROM product p WHERE NOT EXISTS (SELECT 1 FROM product_shipping_profile psp WHERE psp.product_id = p.id AND psp.shipping_profile_id = 'sp_01KXD7KJRX0MCSKST9JWA5EZCM');" 2>/dev/null || true

# Enable system payment provider for India region
psql "$DATABASE_URL" -c "INSERT INTO region_payment_provider (id, region_id, payment_provider_id, created_at, updated_at) SELECT gen_random_uuid()::text, 'reg_01KXD8XRBBVMHHN65DRFG50VVA', 'pp_system_default', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM region_payment_provider WHERE region_id='reg_01KXD8XRBBVMHHN65DRFG50VVA');" 2>/dev/null || true

# Link stock location to fulfillment set
psql "$DATABASE_URL" -c "INSERT INTO location_fulfillment_set (id, stock_location_id, fulfillment_set_id, created_at, updated_at) SELECT gen_random_uuid()::text, sl.id, fs.id, NOW(), NOW() FROM stock_location sl, fulfillment_set fs WHERE sl.name='Default Warehouse' AND fs.name='India Shipping' AND NOT EXISTS (SELECT 1 FROM location_fulfillment_set lfs WHERE lfs.stock_location_id=sl.id AND lfs.fulfillment_set_id=fs.id);" 2>/dev/null || true
