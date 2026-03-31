import { NextRequest } from "next/server"
import { createAdminSession, setAdminCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const token = await createAdminSession()
  await setAdminCookie(token)
  return Response.json({ ok: true })
}
