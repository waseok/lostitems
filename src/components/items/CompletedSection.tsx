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

  if (items.length === 0) return null

  return (
    <div className="mt-8 border-t border-sky-100 pt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="touch-target w-full flex items-center justify-between py-3 px-4 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl transition-colors btn-bounce border border-emerald-100"
      >
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold text-sm">
            ✅ 찾아간 물건
          </span>
          <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {items.length}개
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-emerald-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-emerald-500" />
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
