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

  async function handleClaim() {
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${itemId}/claim`, { method: "POST" })
      if (!res.ok) throw new Error("처리 실패")
      setDone(true)
      setTimeout(() => {
        onOpenChange(false)
        router.push("/")
        router.refresh()
      }, 1500)
    } catch {
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        {done ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <CheckCircle className="w-14 h-14 text-green-500" />
            <p className="text-lg font-bold text-gray-900">찾기 완료!</p>
            <p className="text-sm text-gray-500 text-center">
              분실물이 완료 목록으로 이동되었습니다.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg">
                찾기 완료 확인
              </DialogTitle>
              <DialogDescription className="text-center text-sm leading-relaxed pt-2">
                <span className="font-semibold text-gray-900">
                  &ldquo;{itemName}&rdquo;
                </span>
                을(를) 찾으셨나요?
                <br />
                <br />
                <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg inline-block text-xs">
                  ⚠️ 담임선생님께 확인 후 버튼을 눌러주세요
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleClaim}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "✅ 찾기 완료"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
