import ItemCard from "./ItemCard"
import type { LostItem } from "@/types"
import { PackageSearch } from "lucide-react"

interface ItemGridProps {
  items: LostItem[]
  emptyMessage?: string
}

export default function ItemGrid({
  items,
  emptyMessage = "등록된 분실물이 없습니다.",
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <PackageSearch className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-base font-medium text-gray-500">{emptyMessage}</p>
        <p className="text-sm mt-1">검색 조건을 바꿔보세요</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
