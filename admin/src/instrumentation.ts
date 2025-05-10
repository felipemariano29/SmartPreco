import { env } from "./env"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && env.NEXT_PUBLIC_MOCK_API) {
    const { server } = await import("./mocks/server")
    server.listen()
  }
}
