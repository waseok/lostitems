import Image from "next/image"
import Link from "next/link"
import { CATEGORY_EMOJIS, getDisplayStatus, STATUS_CONFIG, type LostItem } from "@/types"

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

  const displayStatus = getDisplayStatus(item)
  const statusCfg = STATUS_CONFIG[displayStatus]

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block bg-white rounded-3xl border border-sky-50 overflow-hidden hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 btn-bounce"
    >
      <div className="relative aspect-square bg-gradient-to-br from-sky-50 to-amber-50/30">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform">
              {CATEGORY_EMOJIS[item.category]}
            </span>
          </div>
        )}

        {/* 상태 오버레이 */}
        {displayStatus === "completed" && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✅ 반환 완료
            </span>
          </div>
        )}

        {displayStatus === "claiming" && (
          <div className="absolute top-2 left-2">
            <span className="bg-orange-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow animate-pulse">
              🙋 수령 대기
            </span>
          </div>
        )}

        {isLongTerm && displayStatus === "active" && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
              ⏰ 장기보관
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2">
          <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="px-3 py-3">
        <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-1 mb-1">
          {item.name}
        </h3>
        <p className="text-[11px] text-sky-500 font-medium line-clamp-1">
          📍 {item.location}
        </p>
      </div>
    </Link>
  )
}
