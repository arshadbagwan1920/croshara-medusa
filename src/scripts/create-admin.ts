export default async function createAdmin({ container }: any) {
  const authService = container.resolve("auth")
  const userService = container.resolve("user")
  const link = container.resolve("link")

  const email = "admin@croshara.com"
  const password = "croshara123"

  let [user] = (await userService.listUsers({ email })) as any[]
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

  let authIdentity: any = null

  try {
    const result = await authService.register("emailpass", {
      body: { email, password },
    })
    console.log(`[create-admin] register result: ${JSON.stringify(result?.id || result)}`)
  } catch (err: any) {
    console.log(`[create-admin] register threw: ${err?.message || err}`)
  }

  const allIdentities = (await authService.listAuthIdentities(
    {},
    { take: 1000 },
  )) as any[]
  authIdentity = allIdentities?.find((a: any) => a.entity_id === email) || null

  if (authIdentity) {
    console.log(`[create-admin] Auth identity found: ${authIdentity.id}`)
  } else {
    console.log(`[create-admin] WARNING: No auth identity for ${email}`)
    console.log(`[create-admin] All identities: ${JSON.stringify(allIdentities?.map((a: any) => ({ id: a.id, entity_id: a.entity_id })))}`)
  }

  if (authIdentity && user) {
    try {
      await link.create({
        user: { user_id: user.id },
        auth: { auth_identity_id: authIdentity.id },
      })
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
