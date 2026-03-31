"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ClaimDialog from "@/components/items/ClaimDialog"
import { CATEGORY_LABELS, CATEGORY_EMOJIS, type LostItem } from "@/types"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">불러오는 중...</div>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 flex-1 truncate">{item.name}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-32">
        {/* 사진 */}
        <div className="relative aspect-video sm:aspect-square max-h-96 w-full bg-gradient-to-br from-blue-50 to-indigo-50">
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
          {item.status === "completed" && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                ✅ 찾기 완료
              </Badge>
            </div>
          )}
        </div>

        {/* 정보 카드 */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5">
            <div className="mb-3">
              <Badge variant="secondary" className="mb-2">
                {CATEGORY_EMOJIS[item.category]} {CATEGORY_LABELS[item.category]}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            </div>

            {item.description && (
              <p className="text-gray-600 text-sm mb-4 bg-gray-50 rounded-xl p-3">
                {item.description}
              </p>
            )}

            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">보관 장소</p>
                  <p className="font-semibold text-gray-900">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">발견 날짜</p>
                  <p className="font-semibold text-gray-900">{formatKoreanDate(item.found_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">발견자</p>
                  <p className="font-semibold text-gray-900">{item.finder_name}</p>
                </div>
              </div>
              {item.status === "completed" && item.completed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">찾아간 날짜</p>
                    <p className="font-semibold text-green-700">{formatKoreanDateTime(item.completed_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 제목 - 분실물 이름 / 보관장소 표기 */}
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-center text-sm text-blue-700 font-medium">
            📦 {item.name} &nbsp;—&nbsp; 📍 {item.location}
          </p>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      {item.status === "active" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <Button
              className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-md"
              onClick={() => setClaimOpen(true)}
            >
              ✅ 내 물건이에요! 찾기 완료
            </Button>
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
