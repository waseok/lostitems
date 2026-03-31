import { createClient } from "@/lib/supabase/server"
import { MessageSquare } from "lucide-react"

interface Suggestion {
  id: string
  grade: string
  class_name: string
  name: string
  content: string
  created_at: string
}

export default async function AdminFeedbackPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false })

  const suggestions = (data as Suggestion[]) ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">건의함</h1>
          <p className="text-sm text-gray-500">학생·학부모가 보낸 개선 건의입니다.</p>
        </div>
        <span className="ml-auto bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
          {suggestions.length}건
        </span>
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p>아직 건의가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">
                  {s.grade}학년 {s.class_name}반 {s.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(s.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{s.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
