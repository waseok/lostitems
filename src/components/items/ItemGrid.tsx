import ItemCard from "./ItemCard"
import type { LostItem } from "@/types"

interface ItemGridProps {
  items: LostItem[]
  emptyMessage?: string
  isSearch?: boolean
}

export default function ItemGrid({
  items,
  emptyMessage,
  isSearch = false,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-7xl mb-4">
          {isSearch ? "🔍" : "🎉"}
        </div>
        <p className="text-lg font-bold text-gray-700 text-center">
          {emptyMessage || (isSearch
            ? "검색 결과가 없어요"
            : "현재 보관 중인 분실물이 없어요!")}
        </p>
        <p className="text-sm text-gray-400 mt-1.5 text-center">
          {isSearch
            ? "다른 키워드로 검색해 보세요"
            : "다행이네요 😊 모두 잘 챙기고 있나 봐요!"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
