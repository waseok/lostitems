import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminSession(request)
  if (!isAdmin) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 })
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const { grade, class_name, name, content } = await request.json()
  if (!grade || !class_name || !name || !content) {
    return Response.json({ error: "모든 항목을 입력해주세요." }, { status: 400 })
  }
  const supabase = await createClient()
  const { error } = await supabase
    .from("suggestions")
    .insert({ grade, class_name, name, content })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true }, { status: 201 })
}
