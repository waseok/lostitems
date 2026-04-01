import Image from "next/image"
import Link from "next/link"
import { CATEGORY_EMOJIS, type LostItem } from "@/types"
import { Badge } from "@/components/ui/badge"

interface ItemCardProps {
  item: LostItem
}

export default function ItemCard({ item }: ItemCardProps) {
  const daysSinceFound = Math.floor(
    (Date.now() - new Date(item.found_date).getTime()) / (1000 * 60 * 60 * 24)
  )
  const isLongTerm = daysSinceFound >= 30

  const formattedDate = new Date(item.found_date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  })

  return (
    <Link
      href={`/items/${item.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 active:scale-95 transition-all duration-150"
    >
      <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-indigo-50">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">{CATEGORY_EMOJIS[item.category]}</span>
          </div>
        )}
        {item.status === "completed" && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">찾기 완료</Badge>
          </div>
        )}
        {isLongTerm && item.status === "active" && (
          <div className="absolute top-1.5 left-1.5">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              ⚠️ 장기보관
            </span>
          </div>
        )}
        {/* 날짜 배지 */}
        <div className="absolute bottom-1.5 right-1.5">
          <span className="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-blue-600 font-medium line-clamp-1">
          📍 {item.location}
        </p>
      </div>
    </Link>
  )
}
