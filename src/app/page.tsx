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

    const isSearch = !!(q || category)

    return (
      <>
        <ItemGrid
          items={(activeItems as LostItem[]) || []}
          isSearch={isSearch}
        />
        <CompletedSection items={(completedItems as LostItem[]) || []} />
      </>
    )
  } catch (error) {
    console.error("[ItemsContent] 데이터 로드 오류:", error)
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">😥</div>
        <p className="text-lg font-medium text-gray-600">데이터를 불러올 수 없습니다.</p>
        <p className="text-sm mt-1 text-gray-400">잠시 후 다시 시도해주세요.</p>
      </div>
    )
  }
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 to-amber-50/20 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 pb-10">
        {/* 타이틀 + 신고 버튼 */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              분실물 목록
            </h1>
            <Link
              href="/report"
              className="touch-target btn-bounce flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm sm:text-base font-bold rounded-2xl shadow-md shadow-amber-200 transition-all"
            >
              📢 분실물 신고
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            내 물건을 찾으셨나요? 아래 목록에서 확인하세요.
          </p>
        </div>

        {/* 검색 + 카테고리 필터 */}
        <div className="mb-6">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        {/* 아이템 목록 */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-sky-50 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gradient-to-br from-sky-50 to-amber-50/30" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-sky-50 rounded-lg w-3/4" />
                    <div className="h-3 bg-sky-50 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ItemsContent searchParams={searchParams} />
        </Suspense>
      </main>

      <footer className="border-t border-sky-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col items-center gap-1">
          <VisitorCounter />
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Link href="/feedback" className="hover:text-amber-500 transition-colors">
              💡 개선 건의
            </Link>
            <span>·</span>
            <span>와석초등학교 분실물 보관함</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
