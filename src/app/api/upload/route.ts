import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession(request)
  if (!isAdmin) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return Response.json({ error: "파일이 없습니다." }, { status: 400 })
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: "JPG, PNG, WEBP 형식만 가능합니다." },
      { status: 400 }
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
  }

  const ext = file.name.split(".").pop() || "jpg"
  const path = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = await createClient()
  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from("lost-item-photos")
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from("lost-item-photos")
    .getPublicUrl(path)

  return Response.json({ url: urlData.publicUrl, path }, { status: 201 })
}
