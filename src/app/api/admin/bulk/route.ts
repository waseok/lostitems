import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession(request)
  if (!isAdmin) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 })
  }

  const body = await request.json()
  const { action, ids } = body as { action: string; ids: string[] }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: "항목을 선택해주세요." }, { status: 400 })
  }

  const supabase = await createClient()

  if (action === "delete") {
    const { data: items } = await supabase
      .from("lost_items")
      .select("photo_path")
      .in("id", ids)

    const paths = (items || [])
      .map((i) => i.photo_path)
      .filter((p): p is string => !!p)
    if (paths.length > 0) {
      await supabase.storage.from("lost-item-photos").remove(paths)
    }

    const { error } = await supabase.from("lost_items").delete().in("id", ids)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ success: true, count: ids.length })
  }

  if (action === "status") {
    const { status } = body as { status: string }
    if (!["active", "completed", "pending"].includes(status)) {
      return Response.json({ error: "잘못된 상태값입니다." }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { status }
    if (status === "completed") {
      updateData.completed_at = new Date().toISOString()
    }
    if (status === "active") {
      updateData.completed_at = null
      updateData.claimer_grade = null
      updateData.claimer_class = null
      updateData.claimer_name = null
    }

    const { error } = await supabase
      .from("lost_items")
      .update(updateData)
      .in("id", ids)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ success: true, count: ids.length })
  }

  if (action === "clear_claim") {
    const { error } = await supabase
      .from("lost_items")
      .update({
        claimer_grade: null,
        claimer_class: null,
        claimer_name: null,
      })
      .in("id", ids)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ success: true, count: ids.length })
  }

  return Response.json({ error: "지원하지 않는 작업입니다." }, { status: 400 })
}
