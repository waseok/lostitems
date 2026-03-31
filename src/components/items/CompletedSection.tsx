"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import ItemGrid from "./ItemGrid"
import type { LostItem } from "@/types"

interface CompletedSectionProps {
  items: LostItem[]
}

export default function CompletedSection({ items }: CompletedSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-150 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">
            ✅ 찾은 물건
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {items.length}개
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="mt-4">
          <ItemGrid
            items={items}
            emptyMessage="찾아간 분실물이 없습니다."
          />
        </div>
      )}
    </div>
  )
}
