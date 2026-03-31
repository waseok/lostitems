"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/types"
import { useDebouncedCallback } from "use-debounce"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="분실물 이름으로 검색..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 rounded-xl border-gray-200 bg-white"
        />
      </div>
      <Select
        value={searchParams.get("category") || "all"}
        onValueChange={(v) => updateParams("category", !v || v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-full sm:w-44 rounded-xl border-gray-200 bg-white">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 카테고리</SelectItem>
          {ALL_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
