"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function FeedbackPage() {
  const [form, setForm] = useState({ grade: "", class_name: "", name: "", content: "" })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "전송 실패")
        return
      }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">건의가 접수되었습니다!</h2>
          <p className="text-sm text-gray-500 mb-6">선생님이 확인 후 반영하겠습니다.</p>
          <Link href="/">
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">페이지 개선 건의</h1>
            <p className="text-sm text-gray-500">불편한 점이나 개선 아이디어를 알려주세요.</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
          💡 건의 내용은 선생님만 볼 수 있습니다. 자유롭게 작성해주세요!
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="grade" className="mb-1.5 block text-sm">학년 <span className="text-red-500">*</span></Label>
              <Input
                id="grade"
                placeholder="예: 3"
                value={form.grade}
                onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="class_name" className="mb-1.5 block text-sm">반 <span className="text-red-500">*</span></Label>
              <Input
                id="class_name"
                placeholder="예: 2"
                value={form.class_name}
                onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="name" className="mb-1.5 block text-sm">이름 <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="mb-1.5 block text-sm">건의 내용 <span className="text-red-500">*</span></Label>
            <Textarea
              id="content"
              placeholder="이 웹페이지를 이렇게 개선해주세요! 예) 검색 기능을 더 쉽게 만들어주세요."
              rows={5}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="rounded-xl resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
            disabled={loading || !form.grade || !form.class_name || !form.name || !form.content}
          >
            <Send className="w-4 h-4" />
            {loading ? "전송 중..." : "건의하기"}
          </Button>
        </form>
      </div>
    </div>
  )
}
