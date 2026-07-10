import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: { container: { resolve: <T>(name: string) => T } }) {
  const authService = container.resolve<IAuthModuleService>(Modules.AUTH)

  const email = process.env.ADMIN_EMAIL || "admin@croshara.com"
  const password = process.env.ADMIN_PASSWORD || "croshara123"

  const existing = await authService.listUsers({ email } as any)
  if (existing.length > 0) {
    console.log(`Admin user ${email} already exists`)
    return
  }

  await authService.createUser({
    email,
    password,
    first_name: "CROSHARA",
    last_name: "Admin",
    role: "admin",
  } as any)

  console.log(`Admin user created: ${email} / ${password}`)
}
