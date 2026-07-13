export default async function setupPrices({ container }: any) {
  const knex: any = container.resolve("__pg_connection__")
  const productService = container.resolve("product")
  const regionService = container.resolve("region")

  const regions = await regionService.listRegions({ name: "India" })
  if (!regions?.length) { console.log("[setup-prices] No India region"); return }
  const regionId = regions[0].id

  const all = await productService.listProducts({ status: "published" })
  let done = 0

  for (const p of all) {
    const [full] = await productService.listProducts({ id: p.id }, { relations: ["variants"] })
    for (const v of full.variants) {
      const existing = await knex("product_variant_price_set").where({ variant_id: v.id }).first()
      if (existing) continue
      const amount = v.sku.startsWith("infant-") ? 79900
        : v.sku.startsWith("toddler-") ? 129900
        : v.sku.startsWith("slipper-") ? 69900
        : v.sku.startsWith("gift-set-premium") ? 159900
        : v.sku.startsWith("gift-set-festival") ? 129900
        : v.sku.startsWith("gift-set-newborn") ? 99900
        : v.sku.startsWith("sibling-set") ? 99800
        : v.sku.startsWith("winter-bundle") ? 199900
        : 59900
      const [ps] = await knex("price_set").insert({ id: knex.raw("gen_random_uuid()::text") }).returning("id")
      const psId = ps.id || ps
      await knex("price").insert({ id: knex.raw("gen_random_uuid()::text"), price_set_id: psId, currency_code: "inr", amount, raw_amount: JSON.stringify({ region_id: regionId }) })
      const [priceRow] = await knex("price").where({ price_set_id: psId }).returning("id")
      const priceId = priceRow.id || priceRow
      await knex("price_rule").insert({ id: knex.raw("gen_random_uuid()::text"), price_id: priceId, attribute: "region_id", value: regionId, operator: "eq", priority: 0 })
      await knex("product_variant_price_set").insert({ variant_id: v.id, price_set_id: psId, id: knex.raw("gen_random_uuid()::text") })
      done++
    }
  }
  console.log(`[setup-prices] Done: ${done} variants linked to region prices`)
}
