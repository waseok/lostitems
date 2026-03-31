"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit2,
  Trash2,
  CheckCircle,
  QrCode,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { CATEGORY_LABELS, CATEGORY_EMOJIS, type LostItem } from "@/types"
import { formatKoreanDate } from "@/lib/utils"

interface AdminItemListProps {
  pendingItems: LostItem[]
  activeItems: LostItem[]
  completedItems: LostItem[]
}

function ItemRow({ item, onRefresh }: { item: LostItem; onRefresh: () => void }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [claimOpen, setClaimOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "삭제 실패")
        return
      }
      setDeleteOpen(false)
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleClaim() {
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}/claim`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "처리 실패")
        return
      }
      setClaimOpen(false)
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleRestore() {
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", completed_at: null }),
      })
      if (!res.ok) {
        alert("복구 실패")
        return
      }
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    setLoading(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
      if (!res.ok) { alert("승인 실패"); return }
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
            {item.photo_url ? (
              <Image
                src={item.photo_url}
                alt={item.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">
                {CATEGORY_EMOJIS[item.category]}
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
          <Badge variant="secondary" className="text-xs mt-0.5">
            {CATEGORY_LABELS[item.category]}
          </Badge>
        </td>
        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
          {item.location}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {item.finder_name}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
          {formatKoreanDate(item.found_date)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            {item.status === "pending" ? (
              <>
                <Button
                  size="sm"
                  className="h-7 px-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  승인
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 rounded-lg text-red-500 border-red-200 hover:bg-red-50 text-xs"
                  onClick={() => setDeleteOpen(true)}
                  disabled={loading}
                >
                  거절
                </Button>
              </>
            ) : (
              <>
                <Link href={`/admin/items/${item.id}/edit`}>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href={`/admin/items/${item.id}/qr`} target="_blank">
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg">
                    <QrCode className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                {item.status === "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => setClaimOpen(true)}
                    disabled={loading}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={handleRestore}
                    disabled={loading}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-lg text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteOpen(true)}
                  disabled={loading}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* 삭제 확인 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>삭제 확인</DialogTitle>
            <DialogDescription>
              &ldquo;{item.name}&rdquo;을(를) 삭제하시겠어요?
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>
              취소
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={loading}
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 찾기 완료 확인 */}
      <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>찾기 완료 처리</DialogTitle>
            <DialogDescription>
              &ldquo;{item.name}&rdquo;을(를) 완료 처리하시겠어요?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setClaimOpen(false)}>
              취소
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleClaim}
              disabled={loading}
            >
              ✅ 완료 처리
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function AdminItemList({ pendingItems, activeItems, completedItems }: AdminItemListProps) {
  const router = useRouter()
  const [showCompleted, setShowCompleted] = useState(false)

  function refresh() {
    router.refresh()
  }

  function ItemTable({ items }: { items: LostItem[] }) {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 text-sm">
          항목이 없습니다.
        </div>
      )
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 w-16">사진</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">분실물</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">보관 장소</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">발견자</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">날짜</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} onRefresh={refresh} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 승인 대기 */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-yellow-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-yellow-100 bg-yellow-50 flex items-center gap-2">
            <h2 className="font-bold text-gray-900">승인 대기</h2>
            <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingItems.length}개
            </span>
            <span className="text-xs text-yellow-700 ml-1">공개 신고된 항목 — 승인하면 목록에 표시됩니다</span>
          </div>
          <ItemTable items={pendingItems} />
        </div>
      )}

      {/* 활성 분실물 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">보관 중인 분실물</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeItems.length}개
            </span>
          </div>
          <Link href="/admin/items/new">
            <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 h-8 text-xs">
              + 새 등록
            </Button>
          </Link>
        </div>
        <ItemTable items={activeItems} />
      </div>

      {/* 완료된 분실물 (접힘) */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowCompleted((v) => !v)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">찾기 완료</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {completedItems.length}개
            </span>
          </div>
          {showCompleted ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {showCompleted && (
          <div className="border-t border-gray-100">
            <ItemTable items={completedItems} />
          </div>
        )}
      </div>
    </div>
  )
}
