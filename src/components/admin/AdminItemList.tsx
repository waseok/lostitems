"use client"

import { useState, useCallback } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Edit2,
  Trash2,
  QrCode,
  ChevronDown,
  ChevronUp,
  Download,
  CheckSquare,
  Square,
  XCircle,
  Loader2,
  UserCheck,
} from "lucide-react"
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  getDisplayStatus,
  STATUS_CONFIG,
  type LostItem,
  type DisplayStatus,
} from "@/types"
import { formatKoreanDate } from "@/lib/utils"

interface AdminItemListProps {
  pendingItems: LostItem[]
  activeItems: LostItem[]
  completedItems: LostItem[]
}

function StatusDropdown({ item, onRefresh }: { item: LostItem; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)
  const displayStatus = getDisplayStatus(item)

  async function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return
    if (newStatus === "claim_approve") {
      setLoading(true)
      try {
        const res = await fetch(`/api/items/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "completed",
            completed_at: new Date().toISOString(),
          }),
        })
        if (!res.ok) { alert("처리 실패"); return }
        onRefresh()
      } finally { setLoading(false) }
      return
    }

    if (newStatus === "claim_reject") {
      setLoading(true)
      try {
        const res = await fetch(`/api/items/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claimer_grade: null,
            claimer_class: null,
            claimer_name: null,
          }),
        })
        if (!res.ok) { alert("처리 실패"); return }
        onRefresh()
      } finally { setLoading(false) }
      return
    }

    if (newStatus === item.status) return
    setLoading(true)
    try {
      const updateData: Record<string, unknown> = { status: newStatus }
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString()
      }
      if (newStatus === "active") {
        updateData.completed_at = null
        updateData.claimer_grade = null
        updateData.claimer_class = null
        updateData.claimer_name = null
      }
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
      if (!res.ok) { alert("상태 변경 실패"); return }
      onRefresh()
    } finally { setLoading(false) }
  }

  const statusColor: Record<DisplayStatus, string> = {
    active: "text-sky-600",
    claiming: "text-orange-600",
    completed: "text-emerald-600",
    pending: "text-amber-600",
  }

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
  }

  return (
    <Select value={displayStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className={`w-[120px] h-8 rounded-lg text-xs font-semibold ${statusColor[displayStatus]} border-gray-200`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">🔵 보관 중</SelectItem>
        <SelectItem value="completed">✅ 반환 완료</SelectItem>
        <SelectItem value="pending">⏳ 승인 대기</SelectItem>
        {displayStatus === "claiming" && (
          <>
            <SelectItem value="claiming" disabled>🟠 수령 대기</SelectItem>
            <SelectItem value="claim_approve">✅ 수령 승인</SelectItem>
            <SelectItem value="claim_reject">❌ 수령 거절</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  )
}

function ItemRow({
  item,
  onRefresh,
  selected,
  onToggle,
}: {
  item: LostItem
  onRefresh: () => void
  selected: boolean
  onToggle: () => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const displayStatus = getDisplayStatus(item)

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

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-sky-50/30 transition-colors">
        <td className="px-3 py-3">
          <button onClick={onToggle} className="touch-target p-1">
            {selected ? (
              <CheckSquare className="w-5 h-5 text-sky-500" />
            ) : (
              <Square className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </td>
        <td className="px-3 py-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
            {item.photo_url ? (
              <Image
                src={item.photo_url}
                alt={item.name}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">
                {CATEGORY_EMOJIS[item.category]}
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
          <Badge variant="secondary" className="text-[10px] mt-0.5 rounded-md">
            {CATEGORY_LABELS[item.category]}
          </Badge>
          {displayStatus === "claiming" && item.claimer_name && (
            <div className="flex items-center gap-1 mt-1">
              <UserCheck className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] text-orange-600 font-medium">
                {item.claimer_grade}학년 {item.claimer_class}반 {item.claimer_name}
              </span>
            </div>
          )}
        </td>
        <td className="px-3 py-3 text-sm text-sky-600 font-medium hidden sm:table-cell">
          {item.location}
        </td>
        <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
          {formatKoreanDate(item.found_date)}
        </td>
        <td className="px-3 py-3">
          <StatusDropdown item={item} onRefresh={onRefresh} />
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1">
            <Link href={`/admin/items/${item.id}/edit`} title="수정">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg">
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href={`/admin/items/${item.id}/qr`} target="_blank" title="QR 라벨">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg">
                <QrCode className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              title="삭제"
              className="h-7 w-7 p-0 rounded-lg text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => setDeleteOpen(true)}
              disabled={loading}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </td>
      </tr>

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
    </>
  )
}

function BulkActions({
  selectedIds,
  onRefresh,
  onClear,
}: {
  selectedIds: string[]
  onRefresh: () => void
  onClear: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleBulk(action: string, extra?: Record<string, string>) {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds, ...extra }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "작업 실패")
        return
      }
      onClear()
      onRefresh()
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <>
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-sky-700">
          {selectedIds.length}개 선택됨
        </span>
        <div className="flex gap-2 flex-wrap ml-auto">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl text-xs"
            onClick={() => handleBulk("status", { status: "completed" })}
            disabled={loading}
          >
            ✅ 일괄 완료처리
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl text-xs"
            onClick={() => handleBulk("status", { status: "active" })}
            disabled={loading}
          >
            🔄 일괄 보관중
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl text-xs text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
          >
            🗑️ 일괄 삭제
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-xl text-xs"
            onClick={onClear}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            선택 해제
          </Button>
        </div>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>일괄 삭제 확인</DialogTitle>
            <DialogDescription>
              선택한 {selectedIds.length}개 항목을 삭제하시겠어요?
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => handleBulk("delete")}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "삭제 확인"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function exportCSV(items: LostItem[]) {
  const BOM = "\uFEFF"
  const header = "이름,카테고리,보관장소,발견자,발견일,상태,수령신청자,등록일\n"
  const rows = items.map((item) => {
    const ds = getDisplayStatus(item)
    const statusLabel = STATUS_CONFIG[ds].label
    const claimer = item.claimer_name
      ? `${item.claimer_grade}학년 ${item.claimer_class}반 ${item.claimer_name}`
      : ""
    return [
      `"${item.name}"`,
      CATEGORY_LABELS[item.category],
      `"${item.location}"`,
      `"${item.finder_name}"`,
      item.found_date,
      statusLabel,
      `"${claimer}"`,
      item.created_at.split("T")[0],
    ].join(",")
  })

  const csv = BOM + header + rows.join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `분실물목록_${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminItemList({ pendingItems, activeItems, completedItems }: AdminItemListProps) {
  const router = useRouter()
  const [showCompleted, setShowCompleted] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const allItems = [...pendingItems, ...activeItems, ...completedItems]

  function refresh() {
    setSelectedIds([])
    router.refresh()
  }

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  function toggleAll(items: LostItem[]) {
    const ids = items.map((i) => i.id)
    const allSelected = ids.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])])
    }
  }

  function ItemTable({ items }: { items: LostItem[] }) {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 text-sm">
          항목이 없습니다.
        </div>
      )
    }

    const allSelected = items.every((i) => selectedIds.includes(i.id))

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="px-3 py-3 w-10">
                <button onClick={() => toggleAll(items)} className="p-1">
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-sky-500" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500 w-14">사진</th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500">분실물</th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">장소</th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">날짜</th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500">상태</th>
              <th className="px-3 py-3 text-xs font-semibold text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onRefresh={refresh}
                selected={selectedIds.includes(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const claimingItems = activeItems.filter((i) => i.claimer_name)

  return (
    <div className="space-y-4">
      {/* 일괄 처리 바 */}
      <BulkActions selectedIds={selectedIds} onRefresh={refresh} onClear={() => setSelectedIds([])} />

      {/* CSV 내보내기 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-xl text-xs gap-1.5"
          onClick={() => exportCSV(allItems)}
        >
          <Download className="w-3.5 h-3.5" />
          CSV 내보내기
        </Button>
      </div>

      {/* 수령 대기 알림 */}
      {claimingItems.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-orange-800">수령 신청 {claimingItems.length}건</h3>
          </div>
          <div className="space-y-2">
            {claimingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-orange-100">
                <div>
                  <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                  <span className="text-xs text-orange-600 ml-2">
                    ← {item.claimer_grade}학년 {item.claimer_class}반 {item.claimer_name}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    onClick={async () => {
                      await fetch(`/api/items/${item.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "completed", completed_at: new Date().toISOString() }),
                      })
                      refresh()
                    }}
                  >
                    ✅ 승인
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 rounded-lg text-red-500 border-red-200 hover:bg-red-50 text-xs"
                    onClick={async () => {
                      await fetch(`/api/items/${item.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ claimer_grade: null, claimer_class: null, claimer_name: null }),
                      })
                      refresh()
                    }}
                  >
                    ❌ 거절
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 승인 대기 */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-amber-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
            <h2 className="font-bold text-gray-900">⏳ 승인 대기</h2>
            <span className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingItems.length}개
            </span>
            <span className="text-xs text-amber-700 ml-1">공개 신고된 항목 — 승인하면 목록에 표시됩니다</span>
          </div>
          <ItemTable items={pendingItems} />
        </div>
      )}

      {/* 보관 중 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">📦 보관 중인 분실물</h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeItems.length}개
            </span>
          </div>
          <Link href="/admin/items/new">
            <Button size="sm" className="rounded-xl bg-sky-500 hover:bg-sky-600 h-8 text-xs btn-bounce">
              + 새 등록
            </Button>
          </Link>
        </div>
        <ItemTable items={activeItems} />
      </div>

      {/* 완료 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowCompleted((v) => !v)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">✅ 찾기 완료</h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
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
