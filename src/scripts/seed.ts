import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

const CATEGORY_HANDLES = ["newborn", "infant", "toddler", "gift", "bundle", "custom", "slipper"]

const PRODUCTS: Array<{
  handle: string; title: string; cat: string; price: number; sizes: string[];
  desc: string; badge: string; features: string[]
}> = [
  { handle: "newborn-blush-pink", title: "Newborn Wool Booties Blush Pink", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "Bestseller", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-mint-green", title: "Newborn Wool Booties Mint Green", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "Unisex", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-cream", title: "Newborn Wool Booties Cream", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-navy", title: "Newborn Wool Booties Navy Blue", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-grey", title: "Newborn Wool Booties Grey", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "newborn-walnut", title: "Newborn Wool Booties Walnut Brown", cat: "newborn", price: 599, sizes: ["0-3 months", "3-6 months"], desc: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.", badge: "", features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals", "Gift Wrap Included"] },
  { handle: "infant-blush-pink", title: "Infant Wool Booties Blush Pink", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "Popular", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-mint-green", title: "Infant Wool Booties Mint Green", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "Unisex", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-cream", title: "Infant Wool Booties Cream", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-navy", title: "Infant Wool Booties Navy Blue", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-grey", title: "Infant Wool Booties Grey", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "infant-walnut", title: "Infant Wool Booties Walnut Brown", cat: "infant", price: 799, sizes: ["6-9 months", "9-12 months"], desc: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.", badge: "", features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-blush-pink", title: "Toddler Wool Booties Blush Pink", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-mint-green", title: "Toddler Wool Booties Mint Green", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-cream", title: "Toddler Wool Booties Cream", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-navy", title: "Toddler Wool Booties Navy Blue", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-grey", title: "Toddler Wool Booties Grey", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "toddler-walnut", title: "Toddler Wool Booties Walnut Brown", cat: "toddler", price: 1299, sizes: ["12-18 months", "18-24 months"], desc: "Built for active toddlers. Durable wool construction with reinforced stitching.", badge: "", features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off", "Machine Washable"] },
  { handle: "gift-set-newborn", title: "Newborn Gift Box Set", cat: "gift", price: 999, sizes: ["0-3 months", "3-6 months"], desc: "The complete newborn gift. Premium booties + gift box + handwritten message card.", badge: "Save ₹299", features: ["Premium Gift Box", "Handwritten Note", "Dried Flower Decoration", "Free Shipping", "Eco-Friendly Packaging"] },
  { handle: "gift-set-premium", title: "Premium Gift Box (2 Pairs)", cat: "gift", price: 1599, sizes: ["Mix any sizes"], desc: "Two premium booties in a luxury gift box with personalized message card.", badge: "Save ₹399", features: ["2 Pairs of Booties", "Luxury Gift Box", "Personalized Message", "Free Shipping"] },
  { handle: "gift-set-festival", title: "Festival Special Gift Box", cat: "gift", price: 1299, sizes: ["0-24 months"], desc: "Beautifully packed gift set for Diwali, Pongal, Onam, Christmas or any festival.", badge: "Festive Special", features: ["Festive Gift Wrapping", "Premium Booties", "Handwritten Card", "Free Shipping"] },
  { handle: "sibling-set", title: "Sibling Matching Set", cat: "bundle", price: 998, sizes: ["Mix any sizes"], desc: "Matching booties for siblings! Choose two colors and sizes.", badge: "Save ₹400", features: ["2 Pairs Matching", "Any Color Combo", "Any Size Combo", "Gift Wrap Included"] },
  { handle: "custom-order", title: "Custom Order Booties", cat: "custom", price: 799, sizes: ["0-24 months (your choice)"], desc: "Design your own! Choose body color, trim color, size, and baby name embroidery.", badge: "Made to Order", features: ["Your Color Combo", "Baby Name Embroidery", "Custom Size", "Handmade to Order"] },
  { handle: "winter-bundle", title: "Winter Special Bundle (3 Pairs)", cat: "bundle", price: 1999, sizes: ["0-24 months"], desc: "Stock up for winter! 3 pairs of premium wool booties at a bundle price.", badge: "Best Value", features: ["3 Pairs of Booties", "Mix Colors & Sizes", "Free Shipping", "Save ₹698"] },
  { handle: "slipper-blush-pink", title: "Kids Woolen Slippers Blush Pink", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Easy slip-on promotes independence.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-mint-green", title: "Kids Woolen Slippers Mint Green", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running on tile and marble floors.", badge: "Unisex", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-cream", title: "Kids Woolen Slippers Cream", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Cream is a timeless classic.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-navy", title: "Kids Woolen Slippers Navy Blue", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Navy Blue is bold and durable.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-grey", title: "Kids Woolen Slippers Grey", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Grey is modern minimalist style.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
  { handle: "slipper-walnut", title: "Kids Woolen Slippers Walnut Brown", cat: "slipper", price: 699, sizes: ["2-3 years", "3-4 years", "4-5 years", "5-6 years"], desc: "Anti-skid sole for safe running indoors. Walnut Brown is earthy and warm.", badge: "", features: ["Anti-Skid Sole", "Reinforced Heel", "Easy Slip-On", "Machine Washable"] },
]

export default async function seed({ container }: { container: { resolve: <T>(name: string) => T } }) {
  const productService = container.resolve<IProductModuleService>(Modules.PRODUCT)

  const catIdByHandle: Record<string, string> = {}
  for (const handle of CATEGORY_HANDLES) {
    const existing = await productService.listProductCategories({ handle } as any)
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

  for (const p of PRODUCTS) {
    const existing = await productService.listProducts({ handle: p.handle } as any)
    if (existing.length > 0) {
      console.log(`Product ${p.handle} exists, skip`)
      continue
    }

    const [created] = await productService.createProducts([{
      title: p.title,
      handle: p.handle,
      description: p.desc,
      category_ids: [catIdByHandle[p.cat]],
      options: [{ title: "Size", values: p.sizes }],
      variants: p.sizes.map((s) => ({
        title: s,
        sku: `${p.handle}-${s.toLowerCase().replace(/\s+/g, "-")}`,
        manage_inventory: true,
        allow_backorder: false,
        prices: [{ amount: p.price, currency_code: "inr" }],
        options: { Size: s },
      })),
    }])

    if (p.badge) {
      await productService.updateProducts(created.id, { metadata: { badge: p.badge } })
    }

    console.log(`Created: ${p.title}`)
  }

  console.log(`Seed done: ${PRODUCTS.length} products, ${CATEGORY_HANDLES.length} categories`)
}
