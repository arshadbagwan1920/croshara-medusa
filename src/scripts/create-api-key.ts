import { Modules } from "@medusajs/framework/utils"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

export default async function createApiKey({
  container,
}: {
  container: { resolve: <T>(name: string) => T }
}) {
  const apiKeyService = container.resolve<any>(Modules.API_KEY)

  // Look up the existing "Storefront" publishable key (idempotent).
  const existing = (await apiKeyService.listApiKeys({
    title: "Storefront",
  } as any)) as any[]

  let tokenToUse: string | undefined

  if (existing && existing.length > 0) {
    tokenToUse = existing[0].token
    // Revoke any other duplicates so future lookups are unambiguous.
    for (const dup of existing.slice(1)) {
      try {
        console.log(`[create-api-key] Removing duplicate key ${dup.id}`)
        await apiKeyService.revokeApiKeys([dup.id] as any)
      } catch {}
    }
    console.log(`[create-api-key] API key already exists: ${tokenToUse}`)
  } else {
    const created = await apiKeyService.createApiKeys({
      title: "Storefront",
      type: "publishable",
      created_by: "seed",
    } as any)
    // createApiKeys on the API_KEY module returns a single key object.
    tokenToUse = (created as any)?.token
    console.log(`[create-api-key] API key created: ${tokenToUse}`)
  }

  // Also dump the token to /static/api-key.txt so the storefront can read it
  // without auth (we will mount /static as public in the server). This is safe
  // because publishable API keys are designed to be public — they only grant
  // store-API access, not admin.
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
