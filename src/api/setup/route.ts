import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const container = req.scope as any
  const apiKeyService = container.resolve("api_key")
  const userService = container.resolve("user")
  const authService = container.resolve("auth")

  let publishableKey: string | undefined

  try {
    const keys = (await apiKeyService.listApiKeys({}, { take: 100 })) as any[]
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

  if (!publishableKey) {
    try {
      const keyFile = join(process.cwd(), "static", "api-key.txt")
      if (existsSync(keyFile)) {
        publishableKey = readFileSync(keyFile, "utf-8").trim() || undefined
      }
    } catch {}
  }

  let adminEmail: string | undefined
  let adminUserId: string | undefined
  let adminLinked = false

  try {
    const users = (await userService.listUsers({ email: "admin@croshara.com" })) as any[]
    if (users && users.length > 0) {
      adminUserId = users[0].id
      adminEmail = users[0].email
    }
  } catch (err: any) {
    console.warn("[/setup] listUsers failed:", err?.message || err)
  }

  try {
    const authIdentities = (await authService.listAuthIdentities({}, { take: 1000 })) as any[]
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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const container = req.scope as any
  const authService = container.resolve("auth")
  const userService = container.resolve("user")
  const link = container.resolve("link")

  const email = "admin@croshara.com"
  const password = "croshara123"
  const results: any = { steps: [] }

  let user: any = null
  try {
    const users = (await userService.listUsers({ email })) as any[]
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

  let authIdentity: any = null
  try {
    const regResult = await authService.register("emailpass", {
      body: { email, password },
    })
    results.steps.push({ step: "register", result: regResult?.id || regResult })
  } catch (err: any) {
    results.steps.push({ step: "register", error: err?.message })
  }

  try {
    const allIdentities = (await authService.listAuthIdentities({}, { take: 1000 })) as any[]
    authIdentity = allIdentities?.find((a: any) => a.entity_id === email) || null
    results.steps.push({
      step: "lookupIdentity",
      found: Boolean(authIdentity),
      totalIdentities: allIdentities?.length || 0,
    })
  } catch (err: any) {
    results.steps.push({ step: "lookupIdentity", error: err?.message })
  }

  if (authIdentity && user) {
    try {
      await link.create({
        user: { user_id: user.id },
        auth: { auth_identity_id: authIdentity.id },
      })
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

  const apiKeyService = container.resolve("api_key")
  let publishableKey: string | undefined
  try {
    const keys = (await apiKeyService.listApiKeys({}, { take: 100 })) as any[]
    const match = keys?.find(
      (k: any) => k.title === "Storefront" && k.type === "publishable",
    )
    if (match) {
      publishableKey = match.token
      results.steps.push({ step: "apiKey", key: publishableKey })
    } else {
      const created = await apiKeyService.createApiKeys({
        title: "Storefront",
        type: "publishable",
        created_by: user?.id || "system",
        last_used_by: user?.id || "system",
      })
      publishableKey = created.token
      results.steps.push({ step: "apiKeyCreated", key: publishableKey })
    }
  } catch (err: any) {
    results.steps.push({ step: "apiKey", error: err?.message })
  }

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
