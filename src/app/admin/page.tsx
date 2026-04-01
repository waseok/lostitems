import { createClient } from "@/lib/supabase/server"
import AdminItemList from "@/components/admin/AdminItemList"
import StatsDashboard from "@/components/admin/StatsDashboard"
import type { LostItem } from "@/types"

export default async function AdminPage() {
  const supabase = await createClient()

  // 찾기 완료 후 90일 지난 항목 자동 삭제
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  await supabase
    .from("lost_items")
    .delete()
    .eq("status", "completed")
    .lt("completed_at", ninetyDaysAgo.toISOString())

  const { data: allItems } = await supabase
    .from("lost_items")
    .select("*")
    .order("created_at", { ascending: false })

  const items = (allItems as LostItem[]) || []
  const pendingItems = items.filter((i) => i.status === "pending")
  const activeItems = items.filter((i) => i.status === "active")
  const completedItems = items.filter((i) => i.status === "completed")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">분실물 현황을 확인하고 관리하세요.</p>
      </div>

      <StatsDashboard items={items} />

      <AdminItemList
        pendingItems={pendingItems}
        activeItems={activeItems}
        completedItems={completedItems}
      />
    </div>
  )
}
