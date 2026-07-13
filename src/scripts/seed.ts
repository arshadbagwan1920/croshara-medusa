const CATEGORY_HANDLES = ["newborn", "infant", "toddler", "gift", "bundle", "custom", "slipper"]

const PRODUCTS: Array<{
  handle: string; title: string; cat: string; price: number; sizes: string[];
  desc: string; badge: string; features: string[]
}> = [
  { handle: "newborn-blush-pink", title: "Newborn Wool Booties Blush Pink", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "Bestseller", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-mint-green", title: "Newborn Wool Booties Mint Green", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "Unisex", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-cream", title: "Newborn Wool Booties Cream", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-navy", title: "Newborn Wool Booties Navy Blue", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-grey", title: "Newborn Wool Booties Grey", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-walnut", title: "Newborn Wool Booties Walnut Brown", cat: "newborn", price: 59900, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "infant-blush-pink", title: "Infant Wool Booties Blush Pink", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "Popular", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-mint-green", title: "Infant Wool Booties Mint Green", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "Unisex", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-cream", title: "Infant Wool Booties Cream", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-navy", title: "Infant Wool Booties Navy Blue", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-grey", title: "Infant Wool Booties Grey", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-walnut", title: "Infant Wool Booties Walnut Brown", cat: "infant", price: 79900, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-blush-pink", title: "Toddler Wool Booties Blush Pink", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-mint-green", title: "Toddler Wool Booties Mint Green", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-cream", title: "Toddler Wool Booties Cream", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-navy", title: "Toddler Wool Booties Navy Blue", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-grey", title: "Toddler Wool Booties Grey", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-walnut", title: "Toddler Wool Booties Walnut Brown", cat: "toddler", price: 129900, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "gift-set-newborn", title: "Newborn Gift Box Set", cat: "gift", price: 99900, sizes: ["0-3 months", "3-6 months"], desc: "The complete newborn gift. Premium booties + gift box + handwritten message card.", badge: "Save ₹299", features: ["Premium Gift Box", "Handwritten Note", "Dried Flower Decoration", "Free Shipping", "Eco-Friendly Packaging"] },
  { handle: "gift-set-premium", title: "Premium Gift Box (2 Pairs)", cat: "gift", price: 159900, sizes: ["Mix any sizes"], desc: "Two premium booties in a luxury gift box with personalized message card.", badge: "Save ₹399", features: ["2 Pairs of Booties", "Luxury Gift Box", "Personalized Message", "Free Shipping"] },
  { handle: "gift-set-festival", title: "Festival Special Gift Box", cat: "gift", price: 129900, sizes: ["0-24 months"], desc: "Beautifully packed gift set for Diwali, Pongal, Onam, Christmas or any festival.", badge: "Festive Special", features: ["Festive Gift Wrapping", "Premium Booties", "Handwritten Card", "Free Shipping"] },
  { handle: "sibling-set", title: "Sibling Matching Set", cat: "bundle", price: 99800, sizes: ["Mix any sizes"], desc: "Matching booties for siblings! Choose two colors and sizes.", badge: "Save ₹400", features: ["2 Pairs Matching", "Any Color Combo", "Any Size Combo", "Gift Wrap Included"] },
  { handle: "custom-order", title: "Custom Order Booties", cat: "custom", price: 79900, sizes: ["0-24 months (your choice)"], desc: "Design your own! Choose body color, trim color, size, and baby name embroidery.", badge: "Made to Order", features: ["Your Color Combo", "Baby Name Embroidery", "Custom Size", "Handmade to Order"] },
  { handle: "winter-bundle", title: "Winter Special Bundle (3 Pairs)", cat: "bundle", price: 199900, sizes: ["0-24 months"], desc: "Stock up for winter! 3 pairs of premium wool booties at a bundle price.", badge: "Best Value", features: ["3 Pairs of Booties", "Mix Colors & Sizes", "Free Shipping", "Save ₹698"] },
  { handle: "slipper-blush-pink", title: "Kids Woolen Slippers Blush Pink", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Easy slip-on promotes independence.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-mint-green", title: "Kids Woolen Slippers Mint Green", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running on tile and marble floors.", badge: "Unisex", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-cream", title: "Kids Woolen Slippers Cream", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Cream is a timeless classic.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-navy", title: "Kids Woolen Slippers Navy Blue", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Navy Blue is bold and durable.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-grey", title: "Kids Woolen Slippers Grey", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Grey is modern minimalist style.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-walnut", title: "Kids Woolen Slippers Walnut Brown", cat: "slipper", price: 69900, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Walnut Brown is earthy and warm.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
]

export default async function seed({ container }: any) {
  const productService = container.resolve("product")
  const regionService = container.resolve("region")
  const scService = container.resolve("sales_channel")
  const apiKeyService = container.resolve("api_key")
  const pg: any = container.resolve("__pg_connection__")

  // 1. Create India region
  let regions = await regionService.listRegions({})
  let india = regions.find((r: any) => r.name === "India")
  if (!india) {
    india = await regionService.createRegions({ name: "India", currency_code: "inr", countries: ["IN"] })
    console.log(`Created India region: ${india.id}`)
  } else {
    console.log(`India region exists: ${india.id}`)
  }

  // 2. Create categories
  const catIdByHandle: Record<string, string> = {}
  for (const handle of CATEGORY_HANDLES) {
    const existing = await productService.listProductCategories({ handle })
    if (existing.length > 0) {
      catIdByHandle[handle] = existing[0].id
      console.log(`Category ${handle} exists`)
      continue
    }
    const [cat] = await productService.createProductCategories([{
      name: handle.charAt(0).toUpperCase() + handle.slice(1),
      handle,
      is_active: true,
      is_internal: false,
    }])
    catIdByHandle[handle] = cat.id
    console.log(`Created category: ${handle}`)
  }

  // 3. Create products
  for (const p of PRODUCTS) {
    const existing = await productService.listProducts({ handle: p.handle })
    if (existing.length > 0) {
      console.log(`Product ${p.handle} exists, skip`)
      continue
    }

    const [created] = await productService.createProducts([{
      title: p.title,
      handle: p.handle,
      description: p.desc,
      category_ids: [catIdByHandle[p.cat]],
      status: "published",
      options: [{ title: "Size", values: p.sizes }],
      variants: p.sizes.map((s: string) => ({
        title: s,
        sku: `${p.handle}-${s.toLowerCase().replace(/\s+/g, "-")}`,
        manage_inventory: true,
        allow_backorder: false,
        prices: [{ amount: p.price, currency_code: "inr", rules: { region_id: india.id } }],
        options: { Size: s },
      })),
    }])

    if (p.badge) {
      await productService.updateProducts(created.id, { metadata: { badge: p.badge } })
    }

    console.log(`Created: ${p.title}`)
  }

  // 4. Find/create default sales channel
  let channels = await scService.listSalesChannels({})
  let defaultSC = channels.find((c: any) => c.name === "Default" || c.is_default)
  if (!defaultSC) {
    defaultSC = await scService.createSalesChannels({ name: "Default", description: "Default", is_default: true })
    console.log(`Created default SC: ${defaultSC.id}`)
  } else {
    console.log(`Default SC: ${defaultSC.id}`)
  }

  // 5. Link all published products to sales channel
  for (const p of PRODUCTS) {
    const existing = await productService.listProducts({ handle: p.handle })
    if (existing && existing.length > 0) {
      const prod = existing[0]
      const linkRow = await pg("product_sales_channel").where({ product_id: prod.id }).first()
      const alreadyLinked = Boolean(linkRow)
      if (!alreadyLinked) {
        await scService.linkProducts(defaultSC.id, [prod.id])
        console.log(`Linked ${p.handle} to sales channel`)
      }
    }
  }

  // 6. Link publishable key to sales channel
  const keys = await apiKeyService.listApiKeys({ token: "pk_2d0c221791010170c5b01d8210cbd35b2052e05f585648b10cd4db551e19d497" })
  if (keys && keys.length > 0) {
    const pk = keys[0]
    const link = container.resolve("link")
    try {
      await link.create({ sales_channel_api_key: { sales_channel_id: defaultSC.id, api_key_id: pk.id } })
      console.log(`Linked SC to publishable key`)
    } catch (err: any) {
      console.log(`Key link note: ${err?.message || err}`)
    }
  }

  console.log(`Seed done: ${PRODUCTS.length} products, region + SC ready`)
}
