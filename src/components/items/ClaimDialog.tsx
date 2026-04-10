"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2 } from "lucide-react"

interface ClaimDialogProps {
  itemId: string
  itemName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ClaimDialog({
  itemId,
  itemName,
  open,
  onOpenChange,
}: ClaimDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [grade, setGrade] = useState("")
  const [className, setClassName] = useState("")
  const [studentName, setStudentName] = useState("")

  const isValid = grade.trim() && className.trim() && studentName.trim()

  async function handleClaim() {
    if (!isValid) return
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${itemId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: grade.trim(),
          class_name: className.trim(),
          student_name: studentName.trim(),
        }),
      })
      if (!res.ok) throw new Error("처리 실패")
      setDone(true)
      setTimeout(() => {
        onOpenChange(false)
        router.push("/")
        router.refresh()
      }, 2000)
    } catch {
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  function handleClose(v: boolean) {
    if (!v) {
      setGrade("")
      setClassName("")
      setStudentName("")
      setDone(false)
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl border-sky-100">
        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">수령 신청 완료! 🎉</p>
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              선생님께서 확인 후 전달해 주실 거예요.
              <br />
              조금만 기다려 주세요!
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                🙋 내 물건이에요!
              </DialogTitle>
              <DialogDescription className="text-center text-sm leading-relaxed pt-1">
                <span className="font-semibold text-gray-800">
                  &ldquo;{itemName}&rdquo;
                </span>
                의 주인이 맞나요?
                <br />
                아래 정보를 입력하면 선생님께 전달돼요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="grade" className="text-sm font-medium text-gray-600">
                    학년
                  </Label>
                  <Input
                    id="grade"
                    placeholder="예: 3"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-12 rounded-xl text-center text-lg font-bold border-sky-100 focus-visible:ring-sky-200"
                    maxLength={1}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="className" className="text-sm font-medium text-gray-600">
                    반
                  </Label>
                  <Input
                    id="className"
                    placeholder="예: 2"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="h-12 rounded-xl text-center text-lg font-bold border-sky-100 focus-visible:ring-sky-200"
                    maxLength={2}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="studentName" className="text-sm font-medium text-gray-600">
                  이름
                </Label>
                <Input
                  id="studentName"
                  placeholder="이름을 입력해 주세요"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="h-12 rounded-xl text-center text-lg font-bold border-sky-100 focus-visible:ring-sky-200"
                  maxLength={10}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <p className="text-xs text-amber-700 text-center font-medium leading-relaxed">
                  ⚠️ 거짓 정보를 입력하면 안 돼요!
                  <br />
                  선생님께서 확인 후 물건을 전달해 주십니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl text-base btn-bounce"
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                className="flex-1 h-12 rounded-2xl text-base font-bold bg-sky-500 hover:bg-sky-600 text-white btn-bounce disabled:opacity-50"
                onClick={handleClaim}
                disabled={loading || !isValid}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "🙋 신청하기"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
