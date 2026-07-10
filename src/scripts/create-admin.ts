import { IAuthModuleService, IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: { container: { resolve: <T>(name: string) => T } }) {
  const authService = container.resolve<IAuthModuleService>(Modules.AUTH)
  const userService = container.resolve<IUserModuleService>(Modules.USER)

  const email = "admin@croshara.com"
  const password = "croshara123"

  const existing = await userService.listUsers({ email } as any)
  if (existing.length > 0) {
    console.log(`Admin user ${email} already exists`)
    return
  }

  const user = await userService.createUsers({ email, first_name: "CROSHARA", last_name: "Admin" })
  console.log(`User created: ${user.id}`)

  try {
    await authService.register("emailpass", {
      entity_id: email,
      provider_metadata: { password },
    })
    console.log(`Auth identity registered for ${email}`)
  } catch (err) {
    console.log(`Auth identity may already exist (ok): ${err}`)
  }

  console.log(`Admin ready: ${email} / ${password}`)
}
