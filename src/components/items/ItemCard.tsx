import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"
import { CATEGORY_LABELS, CATEGORY_EMOJIS, type LostItem } from "@/types"
import { formatKoreanDate } from "@/lib/utils"

interface ItemCardProps {
  item: LostItem
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 active:scale-95 transition-all duration-150"
    >
      {/* 사진 영역 */}
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
            <span className="text-5xl">
              {CATEGORY_EMOJIS[item.category]}
            </span>
          </div>
        )}
        {item.status === "completed" && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
              찾기 완료
            </Badge>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        <div className="mb-1.5">
          <Badge variant="secondary" className="text-xs mb-1.5">
            {CATEGORY_EMOJIS[item.category]} {CATEGORY_LABELS[item.category]}
          </Badge>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
            {item.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{formatKoreanDate(item.found_date)}</span>
        </div>
      </div>
    </Link>
  )
}
