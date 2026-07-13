import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

export default async function createApiKey({ container }: any) {
  const apiKeyService = container.resolve("api_key")

  const existing = (await apiKeyService.listApiKeys({
    title: "Storefront",
  })) as any[]

  let tokenToUse: string | undefined

  if (existing && existing.length > 0) {
    tokenToUse = existing[0].token
    for (const dup of existing.slice(1)) {
      try {
        console.log(`[create-api-key] Removing duplicate key ${dup.id}`)
        await apiKeyService.revokeApiKeys([dup.id])
      } catch {}
    }
    console.log(`[create-api-key] API key already exists: ${tokenToUse}`)
  } else {
    const created = await apiKeyService.createApiKeys({
      title: "Storefront",
      type: "publishable",
      created_by: "seed",
    })
    tokenToUse = (created as any)?.token
    console.log(`[create-api-key] API key created: ${tokenToUse}`)
  }

  try {
    const staticDir = join(process.cwd(), "static")
    if (!existsSync(staticDir)) mkdirSync(staticDir, { recursive: true })
    writeFileSync(join(staticDir, "api-key.txt"), tokenToUse || "", "utf-8")
    console.log(
      `[create-api-key] Wrote publishable key to /static/api-key.txt (${tokenToUse?.length || 0} bytes)`,
    )
  } catch (err: any) {
    console.log(
      `[create-api-key] Failed to dump key file: ${err?.message || err}`,
    )
  }

  console.log(`[create-api-key] Use header: x-publishable-api-key: ${tokenToUse}`)
}
