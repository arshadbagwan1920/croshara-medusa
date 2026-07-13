import type { MedusaContainer } from "@medusajs/types"

export default async function setupShippingV2({ container }: { container: MedusaContainer }) {
  const logger = container.resolve("logger")
  const f: any = container.resolve("fulfillment")
  const pg: any = container.resolve("__pg_connection__")

  // Clean old shipping data that was created via raw SQL
  // (service-created FS/SZ/GZ are fine; raw SQL option/price/type needs cleanup)
  await pg("price").where("id", "like", "price_%").del()
  await pg("price_set").del()
  await pg("shipping_option_price_set").del()
  await pg("shipping_option").del()
  await pg("shipping_option_type").del()
  logger.info("Cleaned raw SQL shipping data (keeping FS/SZ/GZ)")

  // Re-create fulfillment set + service zone + geo zone via services
  let fs = (await f.listFulfillmentSets({ name: "India Shipping" }))?.[0]
  if (!fs) {
    const result = await f.createFulfillmentSets([{ name: "India Shipping", type: "shipping" }])
    fs = Array.isArray(result) ? result[0] : result
    // Link to default shipping profile
    await pg("location_fulfillment_set").insert({
      id: (await import("@medusajs/utils")).generateEntityId(undefined, "lfs"),
      fulfillment_set_id: fs.id,
      shipping_profile_id: "sp_01KXD7KJRX0MCSKST9JWA5EZCM",
      created_at: new Date(), updated_at: new Date(),
    })
    logger.info(`Created FS: ${fs.id}`)
  } else logger.info(`FS exists: ${fs.id}`)

  let szs = await f.listServiceZones({ fulfillment_set_id: fs.id, name: "India" })
  let sz = szs?.[0]
  if (!sz) {
    const result = await f.createServiceZones([{ fulfillment_set_id: fs.id, name: "India" }])
    sz = Array.isArray(result) ? result[0] : result
    logger.info(`Created SZ: ${sz.id}`)
  } else logger.info(`SZ exists: ${sz.id}`)

  const gzs = await f.listGeoZones({ service_zone_id: sz.id, country_code: "in" })
  if (!gzs?.length) {
    await f.createGeoZones([{ service_zone_id: sz.id, type: "country", country_code: "in" }])
    logger.info("Created geo zone")
  } else logger.info("Geo zone exists")

  // Create shipping option via service
  const opts = await f.listShippingOptions({ name: "Standard Delivery" })
  if (!opts?.length) {
    const result = await f.createShippingOptions([{
      name: "Standard Delivery",
      price_type: "flat",
      service_zone_id: sz.id,
      shipping_profile_id: "sp_01KXD7KJRX0MCSKST9JWA5EZCM",
      provider_id: "manual_manual",
      type: { label: "Standard", description: "Standard Delivery", code: "standard" },
      data: {},
      prices: [{ currency_code: "inr", amount: 5000 }],
    }])
    const opt = Array.isArray(result) ? result[0] : result
    logger.info(`Created shipping option: ${opt.id} @ ₹50`)
  } else logger.info("Shipping option exists")

  // Verify
  const all = await f.listShippingOptions()
  logger.info(`Total shipping options via service: ${all.length}`)
}
