import type { MedusaContainer } from "@medusajs/types"

export default async function cleanupStock({ container }: { container: MedusaContainer }) {
  const logger = container.resolve("logger")
  const pg: any = container.resolve("__pg_connection__")

  // Delete old raw-SQL inventory levels/items/links
  await pg("inventory_level").del()
  await pg("product_variant_inventory_item").del()
  await pg("inventory_item").del()
  await pg("sales_channel_stock_location").del()
  await pg("stock_location").del()
  logger.info("Cleaned up all raw inventory data")
}
