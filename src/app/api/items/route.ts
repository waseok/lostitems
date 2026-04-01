import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth"
import { sendNewItemNotification } from "@/lib/notify"
import type { LostItemInsert } from "@/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "active"
  const category = searchParams.get("category")
  const q = searchParams.get("q")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const supabase = await createClient()
  let query = supabase
    .from("lost_items")
    .select("*", { count: "exact" })
    .order("found_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status !== "all") {
    query = query.eq("status", status as "active" | "completed")
  }
  if (category) {
    query = query.eq("category", category as never)
  }
  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  const { data, error, count } = await query
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ items: data, total: count, page, limit })
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession(request)
  const body: LostItemInsert = await request.json()
  const { name, location, finder_name, category, description, found_date, photo_url, photo_path } = body

  if (!name || !location || !finder_name) {
    return Response.json({ error: "필수 항목을 입력해주세요." }, { status: 400 })
  }

  // 관리자는 바로 active, 일반 사용자는 pending
  const status = isAdmin ? "active" : "pending"

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lost_items")
    .insert({
      name, location, finder_name,
      category: category || "other",
      description: description || null,
      found_date: found_date || new Date().toISOString().split("T")[0],
      photo_url: photo_url || null,
      photo_path: photo_path || null,
      status,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // 관리자 직접 등록 시 알림 발송
  if (isAdmin) {
    sendNewItemNotification(data)
  }

  return Response.json(data, { status: 201 })
}
