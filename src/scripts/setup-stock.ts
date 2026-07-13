import type { MedusaContainer } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"

export default async function setupStockV2({ container }: { container: MedusaContainer }) {
  const logger = container.resolve("logger")
  const invService: any = container.resolve("inventory")
  const slService: any = container.resolve("stock_location")
  const pg: any = container.resolve("__pg_connection__")

  // 1. Find Default sales channel
  const sc = await pg("sales_channel").where({ name: "Default", is_disabled: false }).first()
  if (!sc) { logger.error("No Default SC!"); return }
  logger.info(`SC: ${sc.id}`)

  // 2. Create stock location via service (so MikroORM tracks it)
  let sls = await slService.listStockLocations({ name: "Default Warehouse" })
  let sl = sls?.[0]
  if (!sl) {
    sl = await slService.createStockLocations({ name: "Default Warehouse" })
    logger.info(`Created SL via service: ${sl.id}`)
  } else logger.info(`SL exists: ${sl.id}`)

  // 3. Link SC-SL
  const link = await pg("sales_channel_stock_location").where({ sales_channel_id: sc.id, stock_location_id: sl.id }).first()
  if (!link) {
    await pg("sales_channel_stock_location").insert({
      id: generateEntityId(undefined, "scsl"),
      sales_channel_id: sc.id, stock_location_id: sl.id,
      created_at: new Date(), updated_at: new Date(),
    })
    logger.info("Linked SC-SL")
  }

  // 4. Get all published variants
  const variants = await pg("product_variant").select("product_variant.id").join("product", "product.id", "product_variant.product_id").where("product.status", "published")
  logger.info(`Variants: ${variants.length}`)

  // 5. Create inventory items + levels via service
  let count = 0
  for (const v of variants) {
    const items = await invService.listInventoryItems({ sku: v.id })
    let invItem = items[0]
    if (!invItem) {
      invItem = await invService.createInventoryItems([{ sku: v.id, requires_shipping: true }])
      invItem = Array.isArray(invItem) ? invItem[0] : invItem
    }

    // Link variant to inventory item
    const vli = await pg("product_variant_inventory_item").where({ variant_id: v.id, inventory_item_id: invItem.id }).first()
    if (!vli) {
      await pg("product_variant_inventory_item").insert({
        id: generateEntityId(undefined, "pvli"),
        variant_id: v.id, inventory_item_id: invItem.id, required_quantity: 1,
        created_at: new Date(), updated_at: new Date(),
      })
    }

    // Create inventory level via service
    try {
      const avail = await invService.retrieveStockedQuantity(invItem.id, sl.id)
      if (Number(avail) <= 0) {
        await invService.createInventoryLevels([{
          inventory_item_id: invItem.id, location_id: sl.id, stocked_quantity: 100,
        }])
        count++
      }
    } catch {
      await invService.createInventoryLevels([{
        inventory_item_id: invItem.id, location_id: sl.id, stocked_quantity: 100,
      }])
      count++
    }
  }
  logger.info(`Stocked ${count} variants`)
  logger.info("Done! Ready for cart testing.")
}
