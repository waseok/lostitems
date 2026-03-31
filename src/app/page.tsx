import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/layout/Header"
import ItemGrid from "@/components/items/ItemGrid"
import SearchBar from "@/components/search/SearchBar"
import CompletedSection from "@/components/items/CompletedSection"
import type { LostItem, ItemCategory } from "@/types"

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function ItemsContent({ searchParams }: PageProps) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  let activeQuery = supabase
    .from("lost_items")
    .select("*")
    .eq("status", "active")
    .order("found_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (q) activeQuery = activeQuery.ilike("name", `%${q}%`)
  if (category) activeQuery = activeQuery.eq("category", category as ItemCategory)

  const { data: activeItems } = await activeQuery

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
  const { data: completedItems } = await supabase
    .from("lost_items")
    .select("*")
    .eq("status", "completed")
    .gte("completed_at", sixtyDaysAgo.toISOString())
    .order("completed_at", { ascending: false })
    .limit(50)

  return (
    <>
      <ItemGrid
        items={(activeItems as LostItem[]) || []}
        emptyMessage={q || category ? "검색 결과가 없습니다." : "현재 등록된 분실물이 없습니다."}
      />
      <CompletedSection items={(completedItems as LostItem[]) || []} />
    </>
  )
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">분실물 목록</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            물건을 찾으셨나요? 아래 목록에서 확인해보세요.
          </p>
        </div>

        <div className="mb-5">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ItemsContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}
