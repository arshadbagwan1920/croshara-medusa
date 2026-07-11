import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

// GET /setup - returns publishable API key + admin bootstrap status.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const container = req.scope as any
  const apiKeyService = container.resolve(Modules.API_KEY)
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  let publishableKey: string | undefined

  // 1. Find publishable key via API service.
  try {
    const keys = (await apiKeyService.listApiKeys({} as any, {
      take: 100,
    } as any)) as any[]
    const match = keys?.find(
      (k: any) => k.title === "Storefront" && k.type === "publishable",
    )
    if (match) publishableKey = match.token
    else if (keys && keys.length > 0) {
      const onlyPub = keys.filter((k: any) => k.type === "publishable")
      if (onlyPub.length === 1) publishableKey = onlyPub[0].token
    }
  } catch (err: any) {
    console.warn("[/setup] listApiKeys failed:", err?.message || err)
  }

  // Fallback: read from /static/api-key.txt.
  if (!publishableKey) {
    try {
      const keyFile = join(process.cwd(), "static", "api-key.txt")
      if (existsSync(keyFile)) {
        publishableKey = readFileSync(keyFile, "utf-8").trim() || undefined
      }
    } catch {}
  }

  // 2. Check admin user state.
  let adminEmail: string | undefined
  let adminUserId: string | undefined
  let adminLinked = false

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

  // 3. Check whether the auth identity exists and is linked.
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

// POST /setup - attempt to recover the admin auth identity if it's missing.
// This is a self-healing endpoint: call it after deploy if create-admin failed.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const container = req.scope as any
  const authService = container.resolve(Modules.AUTH)
  const userService = container.resolve(Modules.USER)
  const link = container.resolve<any>(ContainerRegistrationKeys.LINK)

  const email = "admin@croshara.com"
  const password = "croshara123"
  const results: any = { steps: [] }

  // Step 1: Ensure user exists.
  let user: any = null
  try {
    const users = (await userService.listUsers({ email } as any)) as any[]
    user = users?.[0]
    if (!user) {
      user = await userService.createUsers({
        email,
        first_name: "CROSHARA",
        last_name: "Admin",
      })
      results.steps.push({ step: "createUser", userId: user.id })
    } else {
      results.steps.push({ step: "userExists", userId: user.id })
    }
  } catch (err: any) {
    results.steps.push({ step: "createUser", error: err?.message })
    return res.json({ ok: false, error: "Failed to ensure user", details: results })
  }

  // Step 2: Register auth identity (try the correct body format).
  let authIdentity: any = null
  try {
    const regResult = await authService.register("emailpass", {
      body: { email, password },
    } as any)
    results.steps.push({ step: "register", result: regResult?.id || regResult })
  } catch (err: any) {
    results.steps.push({ step: "register", error: err?.message })
  }

  // Look up all identities.
  try {
    const allIdentities = (await authService.listAuthIdentities(
      {} as any,
      { take: 1000 } as any,
    )) as any[]
    authIdentity = allIdentities?.find((a: any) => a.entity_id === email) || null
    results.steps.push({
      step: "lookupIdentity",
      found: Boolean(authIdentity),
      totalIdentities: allIdentities?.length || 0,
    })
  } catch (err: any) {
    results.steps.push({ step: "lookupIdentity", error: err?.message })
  }

  // Step 3: Link user <-> auth identity.
  if (authIdentity && user) {
    try {
      await link.create({
        [Modules.USER]: { user_id: user.id },
        [Modules.AUTH]: { auth_identity_id: authIdentity.id },
      } as any)
      results.steps.push({ step: "link", ok: true })
    } catch (err: any) {
      if (
        err?.message?.includes("exists") ||
        err?.message?.includes("duplicate") ||
        err?.message?.includes("unique") ||
        err?.code === "23505"
      ) {
        results.steps.push({ step: "link", ok: true, note: "already linked" })
      } else {
        results.steps.push({ step: "link", error: err?.message })
      }
    }
  }

  // Step 4: Ensure publishable API key exists.
  const apiKeyService = container.resolve(Modules.API_KEY)
  let publishableKey: string | undefined
  try {
    const keys = (await apiKeyService.listApiKeys({} as any, {
      take: 100,
    } as any)) as any[]
    const match = keys?.find(
      (k: any) => k.title === "Storefront" && k.type === "publishable",
    )
    if (match) {
      publishableKey = match.token
      results.steps.push({ step: "apiKey", key: publishableKey })
    } else {
      // Create one.
      const created = await apiKeyService.createApiKeys({
        title: "Storefront",
        type: "publishable",
        created_by: user?.id || "system",
        last_used_by: user?.id || "system",
      } as any)
      publishableKey = created.token
      results.steps.push({ step: "apiKeyCreated", key: publishableKey })
    }
  } catch (err: any) {
    results.steps.push({ step: "apiKey", error: err?.message })
  }

  // Fallback: read from static file.
  if (!publishableKey) {
    try {
      const keyFile = join(process.cwd(), "static", "api-key.txt")
      if (existsSync(keyFile)) {
        publishableKey = readFileSync(keyFile, "utf-8").trim() || undefined
      }
    } catch {}
  }

  res.json({
    ok: Boolean(authIdentity && user),
    publishableApiKey: publishableKey || null,
    adminEmail: email,
    adminPassword: password,
    details: results,
  })
}
