"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, User, Tag, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import ClaimDialog from "@/components/items/ClaimDialog"
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  getDisplayStatus,
  STATUS_CONFIG,
  type LostItem,
} from "@/types"
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/utils"

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<LostItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimOpen, setClaimOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.replace("/")
        else setItem(data)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-sky-400 text-lg font-medium">불러오는 중...</div>
      </div>
    )
  }

  if (!item) return null

  const displayStatus = getDisplayStatus(item)
  const statusCfg = STATUS_CONFIG[displayStatus]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="touch-target p-2 rounded-xl hover:bg-sky-50 transition-colors btn-bounce"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-800 flex-1 truncate">{item.name}</h1>
          <Link
            href="/"
            className="touch-target p-2 rounded-xl hover:bg-sky-50 transition-colors text-gray-500 hover:text-sky-600 btn-bounce"
            title="홈으로"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-32">
        {/* 사진 */}
        <div className="relative aspect-video sm:aspect-square max-h-96 w-full bg-gradient-to-br from-sky-100/50 to-amber-50/50">
          {item.photo_url ? (
            <Image
              src={item.photo_url}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-8xl">{CATEGORY_EMOJIS[item.category]}</span>
              <span className="text-sm text-gray-400">사진 없음</span>
            </div>
          )}

          {/* 상태 배지 */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 text-sm font-bold px-3.5 py-1.5 rounded-full shadow-lg ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border}`}
            >
              {displayStatus === "completed" && "✅ "}
              {displayStatus === "claiming" && "🙋 "}
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* 정보 카드 */}
        <div className="mx-4 mt-4 bg-white rounded-3xl shadow-sm border border-sky-50 overflow-hidden">
          <div className="p-5">
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 mb-2">
                {CATEGORY_EMOJIS[item.category]} {CATEGORY_LABELS[item.category]}
              </span>
              <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
            </div>

            {item.description && (
              <p className="text-gray-600 text-sm mb-4 bg-sky-50/50 rounded-2xl p-3.5 border border-sky-50">
                {item.description}
              </p>
            )}

            <div className="space-y-3 pt-3 border-t border-sky-50">
              <InfoRow icon={<MapPin className="w-4 h-4 text-sky-500" />} label="보관 장소" value={item.location} bgColor="bg-sky-100" />
              <InfoRow icon={<Calendar className="w-4 h-4 text-amber-500" />} label="발견 날짜" value={formatKoreanDate(item.found_date)} bgColor="bg-amber-100" />
              <InfoRow icon={<User className="w-4 h-4 text-violet-500" />} label="발견자" value={item.finder_name} bgColor="bg-violet-100" />
              {item.status === "completed" && item.completed_at && (
                <InfoRow
                  icon={<Tag className="w-4 h-4 text-emerald-500" />}
                  label="찾아간 날짜"
                  value={formatKoreanDateTime(item.completed_at)}
                  bgColor="bg-emerald-100"
                  valueColor="text-emerald-700"
                />
              )}
            </div>

            {/* 수령 신청자 정보 표시 */}
            {item.claimer_name && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-4">
                <p className="text-sm font-bold text-orange-700 mb-1">🙋 수령 신청 정보</p>
                <p className="text-sm text-orange-600">
                  {item.claimer_grade}학년 {item.claimer_class}반 {item.claimer_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 요약 배너 */}
        <div className="mx-4 mt-3 px-4 py-3 bg-sky-50 rounded-2xl border border-sky-100">
          <p className="text-center text-sm text-sky-700 font-medium">
            📦 {item.name} &nbsp;—&nbsp; 📍 {item.location}
          </p>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      {item.status === "active" && !item.claimer_name && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-sky-100">
          <div className="max-w-2xl mx-auto">
            <Button
              className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-2xl shadow-lg shadow-sky-200 btn-bounce transition-all"
              onClick={() => setClaimOpen(true)}
            >
              🙋 내 물건이에요!
            </Button>
          </div>
        </div>
      )}

      {item.status === "active" && item.claimer_name && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-orange-100">
          <div className="max-w-2xl mx-auto">
            <div className="w-full h-14 flex items-center justify-center text-lg font-bold text-orange-600 bg-orange-50 rounded-2xl border-2 border-orange-200">
              🙋 수령 대기 중 — 선생님 확인을 기다리고 있어요
            </div>
          </div>
        </div>
      )}

      <ClaimDialog
        itemId={item.id}
        itemName={item.name}
        open={claimOpen}
        onOpenChange={setClaimOpen}
      />
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  bgColor,
  valueColor = "text-gray-800",
}: {
  icon: React.ReactNode
  label: string
  value: string
  bgColor: string
  valueColor?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  )
}
