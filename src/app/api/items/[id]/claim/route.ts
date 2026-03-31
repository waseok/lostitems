import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("lost_items")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "active")
    .select()
    .single()

  if (error || !data) {
    return Response.json(
      { error: "처리할 수 없습니다. 이미 완료된 항목이거나 존재하지 않습니다." },
      { status: 400 }
    )
  }
  return Response.json(data)
}
