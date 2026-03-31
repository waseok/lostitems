import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth"
import type { LostItemUpdate } from "@/types"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return Response.json({ error: "분실물을 찾을 수 없습니다." }, { status: 404 })
  }
  return Response.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession(request)
  if (!isAdmin) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 })
  }

  const { id } = await params
  const body: LostItemUpdate = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("lost_items")
    .update(body)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession(request)
  if (!isAdmin) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 })
  }

  const { id } = await params
  const supabase = await createClient()

  // 사진 경로 가져오기 (삭제용)
  const { data: item } = await supabase
    .from("lost_items")
    .select("photo_path")
    .eq("id", id)
    .single()

  if (item?.photo_path) {
    await supabase.storage.from("lost-item-photos").remove([item.photo_path])
  }

  const { error } = await supabase.from("lost_items").delete().eq("id", id)
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return new Response(null, { status: 204 })
}
