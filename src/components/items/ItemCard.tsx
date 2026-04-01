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
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square bg-gray-50">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <span className="text-5xl opacity-70">{CATEGORY_EMOJIS[item.category]}</span>
          </div>
        )}

        {/* 찾기 완료 오버레이 */}
        {item.status === "completed" && (
          <div className="absolute inset-0 bg-gray-900/55 flex items-center justify-center">
            <Badge className="bg-green-500 text-white text-xs px-2.5 py-1 shadow">찾기 완료</Badge>
          </div>
        )}

        {/* 장기보관 뱃지 */}
        {isLongTerm && item.status === "active" && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              ⚠ 장기보관
            </span>
          </div>
        )}

        {/* 발견일 뱃지 */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="px-3 py-2.5">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 mb-0.5">
          {item.name}
        </h3>
        <p className="text-[11px] text-blue-500 font-medium line-clamp-1">
          📍 {item.location}
        </p>
      </div>
    </Link>
  )
}
