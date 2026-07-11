import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdmin({
  container,
}: {
  container: { resolve: <T>(name: string) => T }
}) {
  const authService = container.resolve<any>(Modules.AUTH)
  const userService = container.resolve<any>(Modules.USER)
  const link = container.resolve<any>(ContainerRegistrationKeys.LINK)

  const email = "admin@croshara.com"
  const password = "croshara123"

  // 1. Find or create the user record.
  let [user] = (await userService.listUsers({ email } as any)) as any[]
  if (!user) {
    user = await userService.createUsers({
      email,
      first_name: "CROSHARA",
      last_name: "Admin",
    })
    console.log(`[create-admin] User created: ${user.id}`)
  } else {
    console.log(`[create-admin] User already exists: ${user.id}`)
  }

  // 2. Register auth identity for emailpass provider.
  //    Medusa v2 emailpass expects { entity_id, password } at top level.
  let authIdentity: any

  try {
    const result = await authService.register("emailpass", {
      entity_id: email,
      password: password,
    } as any)
    console.log(`[create-admin] register result: ${JSON.stringify(result?.id || result)}`)
  } catch (err: any) {
    console.log(`[create-admin] register error: ${err?.message || err}`)
  }

  // Always look up — register may not return the identity directly.
  const allIdentities = (await authService.listAuthIdentities(
    {} as any,
    { take: 1000 } as any,
  )) as any[]
  authIdentity = allIdentities?.find((a: any) => a.entity_id === email) || null

  if (authIdentity) {
    console.log(`[create-admin] Auth identity found: ${authIdentity.id}`)
  } else {
    console.log(`[create-admin] WARNING: No auth identity for ${email}`)
    console.log(`[create-admin] All identities: ${JSON.stringify(allIdentities?.map((a: any) => ({ id: a.id, entity_id: a.entity_id, provider: a.auth_provider })))}`)
  }

  // 3. Link user <-> auth identity.
  if (authIdentity && user) {
    try {
      await link.create({
        [Modules.USER]: { user_id: user.id },
        [Modules.AUTH]: { auth_identity_id: authIdentity.id },
      } as any)
      console.log(`[create-admin] Linked auth ${authIdentity.id} -> user ${user.id}`)
    } catch (err: any) {
      if (
        err?.message?.includes("exists") ||
        err?.message?.includes("duplicate") ||
        err?.message?.includes("unique") ||
        err?.code === "23505"
      ) {
        console.log(`[create-admin] Link already present (ok): ${user.id} <-> ${authIdentity.id}`)
      } else {
        console.log(`[create-admin] link.create FAILED: ${err?.message || err}`)
      }
    }
  }

  console.log(`[create-admin] Admin ready: ${email} / ${password}`)
}
