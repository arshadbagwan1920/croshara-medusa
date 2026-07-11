import { IAuthModuleService, IUserModuleService } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createAdmin({
  container,
}: {
  container: { resolve: <T>(name: string) => T }
}) {
  const authService = container.resolve<IAuthModuleService>(Modules.AUTH)
  const userService = container.resolve<IUserModuleService>(Modules.USER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const email = "admin@croshara.com"
  const password = "croshara123"

  // Find or create the user record.
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

  // Find or create the auth identity for this email.
  let authIdentity: any
  const existingAuth = (await authService.listAuthIdentities(
    {} as any,
    { take: 1000 } as any,
  )) as any[]
  const match = existingAuth?.find((a: any) => a.entity_id === email)
  if (match) {
    authIdentity = match
    console.log(
      `[create-admin] Auth identity already exists: ${authIdentity.id}`,
    )
  } else {
    try {
      authIdentity = await authService.register("emailpass", {
        entity_id: email,
        provider_metadata: { password },
      })
      console.log(
        `[create-admin] Auth identity registered: ${authIdentity.id}`,
      )
    } catch (err: any) {
      console.log(
        `[create-admin] authService.register failed (continuing with lookup): ${err?.message || err}`,
      )
      const retry = (await authService.listAuthIdentities(
        {} as any,
        { take: 1000 } as any,
      )) as any[]
      authIdentity = retry?.find((a: any) => a.entity_id === email) || null
    }
  }

  // ALWAYS link them. The link call is idempotent — if a link already exists
  // Medusa returns it without error, but newly-created sides must be linked
  // for /admin endpoints to accept the auth identity's JWT (otherwise the
  // token arrives with actor_id="" and admin middleware rejects it).
  if (authIdentity) {
    try {
      await link.create({
        [Modules.USER]: { user_id: user.id },
        [Modules.AUTH]: { auth_identity_id: authIdentity.id },
      } as any)
      console.log(
        `[create-admin] Linked auth ${authIdentity.id} -> user ${user.id}`,
      )
    } catch (err: any) {
      // Idempotent — if link already exists, Medusa throws ConnectorError
      // E11000 (duplicate key); safe to swallow.
      if (
        err?.message?.includes("exists") ||
        err?.message?.includes("duplicate") ||
        err?.message?.includes("unique")
      ) {
        console.log(
          `[create-admin] Link already present (ok): ${user.id} <-> ${authIdentity.id}`,
        )
      } else {
        console.log(
          `[create-admin] link.create failed: ${err?.message || err}`,
        )
      }
    }
  }

  console.log(`[create-admin] Admin ready: ${email} / ${password}`)
}
