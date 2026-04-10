import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  let grade: string | null = null
  let className: string | null = null
  let studentName: string | null = null

  try {
    const body = await request.json()
    grade = body.grade?.trim() || null
    className = body.class_name?.trim() || null
    studentName = body.student_name?.trim() || null
  } catch {
    // body 파싱 실패 시 기존 방식(정보 없이 완료)으로 처리
  }

  if (!grade || !className || !studentName) {
    return Response.json(
      { error: "학년, 반, 이름을 모두 입력해주세요." },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("lost_items")
    .update({
      claimer_grade: grade,
      claimer_class: className,
      claimer_name: studentName,
    })
    .eq("id", id)
    .eq("status", "active")
    .is("claimer_name", null)
    .select()
    .single()

  if (error || !data) {
    return Response.json(
      { error: "처리할 수 없습니다. 이미 신청된 항목이거나 존재하지 않습니다." },
      { status: 400 }
    )
  }
  return Response.json(data)
}
