import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/layout/Header"
import ItemGrid from "@/components/items/ItemGrid"
import SearchBar from "@/components/search/SearchBar"
import CompletedSection from "@/components/items/CompletedSection"
import VisitorCounter from "@/components/VisitorCounter"
import type { LostItem, ItemCategory } from "@/types"

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function ItemsContent({ searchParams }: PageProps) {
  try {
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

    const { data: activeItems, error: activeError } = await activeQuery
    if (activeError) throw activeError

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
  } catch (error) {
    console.error("[ItemsContent] 데이터 로드 오류:", error)
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">데이터를 불러올 수 없습니다.</p>
        <p className="text-sm mt-1">잠시 후 다시 시도해주세요.</p>
      </div>
    )
  }
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* 히어로 배너 */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                분실물 목록
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-1">
                내 물건을 찾으셨나요? 아래 목록에서 확인하세요.
              </p>
            </div>
            <Link
              href="/report"
              className="flex-shrink-0 px-4 sm:px-5 py-2.5 bg-white text-blue-600 text-sm sm:text-base font-bold rounded-2xl shadow hover:bg-blue-50 transition-colors"
            >
              분실물 신고
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5">
        <div className="mb-5">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ItemsContent searchParams={searchParams} />
        </Suspense>
      </main>

      <footer className="max-w-5xl w-full mx-auto px-4 pb-5 mt-6 border-t border-gray-200 pt-4">
        <VisitorCounter />
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-1">
          <Link href="/feedback" className="hover:text-blue-600 transition-colors">
            💡 페이지 개선 건의
          </Link>
          <span>·</span>
          <span>와석초등학교 분실물 보관함</span>
        </div>
      </footer>
    </div>
  )
}
