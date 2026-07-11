import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IApiKeyModuleService, IAuthModuleService, IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

// GET /setup - returns the publishable API key (which is designed to be public)
// plus admin-user bootstrap status. This route is intentionally unauthenticated
// because publishable API keys only grant store-API access, never admin.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const container = req.scope as unknown as { resolve: <T>(name: string) => T }
  const apiKeyService = container.resolve<IApiKeyModuleService>(Modules.API_KEY)
  const userService = container.resolve<IUserModuleService>(Modules.USER)
  const authService = container.resolve<IAuthModuleService>(Modules.AUTH)

  let publishableKey: string | undefined
  let adminEmail: string | undefined
  let adminUserId: string | undefined
  let adminLinked = false

  // 1. Find the "Storefront" publishable key (look up by title).
  try {
    const keys = (await apiKeyService.listApiKeys({
      title: "Storefront",
    } as any)) as any[]
    if (keys && keys.length > 0) {
      publishableKey = keys[0].token
    }
  } catch (err: any) {
    console.warn("[/setup] listApiKeys(title=Storefront) failed:", err?.message || err)
    // Some Medusa builds don't support filtering by title directly - fall back to listing all.
    try {
      const all = (await apiKeyService.listApiKeys({} as any, {
        take: 100,
      } as any)) as any[]
      const match = all?.find(
        (k: any) => k.title === "Storefront" && k.type === "publishable",
      )
      if (match) publishableKey = match.token
      else if (all && all.length > 0) {
        // And if there's only one publishable key, use it.
        const onlyPub = all.filter((k: any) => k.type === "publishable")
        if (onlyPub.length === 1) publishableKey = onlyPub[0].token
      }
    } catch (err2: any) {
      console.warn("[/setup] listApiKeys fallback failed:", err2?.message || err2)
    }
  }

  // Fallback: read from /static/api-key.txt that create-api-key.ts writes.
  if (!publishableKey) {
    try {
      const keyFile = join(process.cwd(), "static", "api-key.txt")
      if (existsSync(keyFile)) {
        publishableKey = readFileSync(keyFile, "utf-8").trim() || undefined
      }
    } catch {}
  }

  // 2. Check admin user state (proof-of-life that create-admin.ts ran).
  try {
    const users = (await userService.listUsers(
      { email: "admin@croshara.com" } as any,
    )) as any[]
    if (users && users.length > 0) {
      adminUserId = users[0].id
      adminEmail = users[0].email
    }
  } catch (err: any) {
    console.warn("[/setup] listUsers failed:", err?.message || err)
  }

  // 3. Check whether the auth identity is linked to the user.
  // Without the link, /auth/admin/emailpass returns a JWT with actor_id="",
  // and /admin/* endpoints reject it with 401.
  try {
    const authIdentities = (await authService.listAuthIdentities(
      {} as any,
      { take: 1000 } as any,
    )) as any[]
    const targetEmail = "admin@croshara.com"
    const emailMatches = (authIdentities || []).filter(
      (a: any) => a.entity_id === targetEmail,
    )
    if (emailMatches.length > 0 && adminUserId) {
      adminLinked = true
    }
  } catch (err: any) {
    console.warn("[/setup] listAuthIdentities failed:", err?.message || err)
  }

  res.json({
    ok: Boolean(publishableKey),
    publishableApiKey: publishableKey || null,
    adminUser: adminEmail
      ? { email: adminEmail, id: adminUserId, linked: adminLinked }
      : null,
    backendUrl: process.env.MEDUSA_BACKEND_URL || null,
    hint: publishableKey
      ? "Use header 'x-publishable-api-key: <publishableApiKey>' for /store/* endpoints."
      : "Run `medusa exec src/scripts/create-api-key.ts` to create the publishable key.",
  })
}
