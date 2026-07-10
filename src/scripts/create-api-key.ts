import { IApiKeyModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createApiKey({ container }: { container: { resolve: <T>(name: string) => T } }) {
  const apiKeyService = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

  const existing = await apiKeyService.listApiKeys({ title: "Storefront" } as any)
  if (existing.length > 0) {
    console.log(`API key already exists: ${existing[0].token}`)
    return
  }

  const key = await apiKeyService.createApiKeys({
    title: "Storefront",
    type: "publishable",
    created_by: "seed",
  } as any)

  console.log(`API key created: ${key.token}`)
  console.log(`Use header: x-publishable-api-key: ${key.token}`)
}
