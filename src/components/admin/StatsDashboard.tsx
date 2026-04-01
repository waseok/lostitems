import { Package, CheckCircle, Clock, TrendingUp, AlertTriangle, Hourglass } from "lucide-react"
import type { LostItem, ItemCategory } from "@/types"
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/types"

interface StatsDashboardProps {
  items: LostItem[]
}

export default function StatsDashboard({ items }: StatsDashboardProps) {
  const active = items.filter((i) => i.status === "active").length
  const completed = items.filter((i) => i.status === "completed").length
  const pending = items.filter((i) => i.status === "pending").length
  const total = items.length

  const claimRate = active + completed > 0
    ? Math.round((completed / (active + completed)) * 100)
    : 0

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recent = items.filter((i) => new Date(i.created_at) >= thirtyDaysAgo).length

  const longTerm = items.filter((i) => {
    if (i.status !== "active") return false
    const days = Math.floor((Date.now() - new Date(i.found_date).getTime()) / (1000 * 60 * 60 * 24))
    return days >= 30
  }).length

  const activeItems = items.filter((i) => i.status === "active")
  const catCount: Partial<Record<ItemCategory, number>> = {}
  for (const item of activeItems) {
    catCount[item.category] = (catCount[item.category] || 0) + 1
  }
  const topCategories = Object.entries(catCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) as [ItemCategory, number][]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-orange-100 p-4 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">보관 중</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{active}</p>
          <p className="text-xs text-gray-400">찾아가길 기다리는 중</p>
        </div>

        <div className="bg-white rounded-2xl border border-green-100 p-4 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">찾기 완료율</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{claimRate}%</p>
          <p className="text-xs text-gray-400">완료 {completed}건 / 전체 {active + completed}건</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-4 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">장기 보관</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{longTerm}</p>
          <p className="text-xs text-gray-400">30일 이상 미수령</p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-100 p-4 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">최근 30일 등록</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{recent}</p>
          <p className="text-xs text-gray-400">전체 {total}건 누적</p>
        </div>
      </div>

      {pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 flex items-center gap-3">
          <Hourglass className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800 font-medium">
            승인 대기 중인 신고가 <strong>{pending}건</strong> 있습니다. 확인 후 승인해주세요.
          </p>
        </div>
      )}

      {topCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">카테고리별 보관 현황</h3>
          <div className="space-y-2">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-base w-6">{CATEGORY_EMOJIS[cat]}</span>
                <span className="text-sm text-gray-700 w-24">{CATEGORY_LABELS[cat]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all"
                    style={{ width: `${Math.max(8, (count / (active || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
