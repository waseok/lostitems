"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/types"
import { useDebouncedCallback } from "use-debounce"
import { cn } from "@/lib/utils"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || ""

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams("q", value)
  }, 300)

  function handleCategory(cat: string) {
    updateParams("category", cat === currentCategory ? "" : cat)
  }

  return (
    <div className="space-y-3">
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="분실물 이름으로 검색해 보세요..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-12 rounded-2xl border-sky-100 bg-white text-base placeholder:text-gray-300 focus-visible:ring-sky-200 focus-visible:border-sky-300"
        />
      </div>

      {/* 카테고리 칩 */}
      <div className="flex flex-wrap gap-2">
        <CategoryChip
          emoji="🔍"
          label="전체"
          active={!currentCategory}
          onClick={() => handleCategory("")}
        />
        {ALL_CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            emoji={CATEGORY_EMOJIS[cat]}
            label={CATEGORY_LABELS[cat]}
            active={currentCategory === cat}
            onClick={() => handleCategory(cat)}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryChip({
  emoji,
  label,
  active,
  onClick,
}: {
  emoji: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "touch-target btn-bounce flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all border",
        active
          ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200"
          : "bg-white text-gray-600 border-gray-100 hover:border-sky-200 hover:bg-sky-50"
      )}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}
