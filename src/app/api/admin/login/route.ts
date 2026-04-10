import { NextRequest } from "next/server"
import { createAdminSession, setAdminCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const adminPassword = (process.env.ADMIN_PASSWORD ?? "8714").trim()
  if (!password || password.trim() !== adminPassword) {
    return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const token = await createAdminSession()
  await setAdminCookie(token)
  return Response.json({ ok: true })
}
