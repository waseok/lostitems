"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { CATEGORY_LABELS, CATEGORY_EMOJIS, type LostItem } from "@/types"
import { formatKoreanDate } from "@/lib/utils"

interface QrLabelPrintProps {
  item: LostItem
}

export default function QrLabelPrint({ item }: QrLabelPrintProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const itemUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/items/${item.id}`
      : `/items/${item.id}`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, itemUrl, {
        width: 180,
        margin: 1,
        color: { dark: "#1e3a5f", light: "#ffffff" },
      })
    }
  }, [itemUrl])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 print:bg-white print:p-0">
      <div className="mb-4 print:hidden flex gap-3">
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          🖨️ 인쇄
        </button>
        <button
          onClick={() => window.close()}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          닫기
        </button>
      </div>

      {/* QR 라벨 카드 */}
      <div
        id="qr-label"
        className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden print:shadow-none print:border print:rounded-none"
        style={{ width: 340 }}
      >
        {/* 헤더 */}
        <div className="bg-blue-700 text-white px-5 py-3 text-center">
          <p className="text-xs font-semibold tracking-widest opacity-80">
            분실물 보관 라벨
          </p>
          <p className="text-lg font-bold">우리 학교 분실물 센터</p>
        </div>

        {/* 분실물 정보 */}
        <div className="px-5 py-4">
          <div className="text-center mb-4">
            <span className="text-4xl block mb-1">{CATEGORY_EMOJIS[item.category]}</span>
            <h2 className="text-xl font-extrabold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-500">{CATEGORY_LABELS[item.category]}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <span className="text-base">📍</span>
              <div>
                <p className="text-xs text-blue-500 font-medium">보관 장소</p>
                <p className="font-bold text-blue-900 text-sm">{item.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">발견 날짜</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {formatKoreanDate(item.found_date)}
                </p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">발견자</p>
                <p className="font-semibold text-gray-800 text-sm">{item.finder_name}</p>
              </div>
            </div>
          </div>

          {/* QR 코드 */}
          <div className="flex flex-col items-center gap-2">
            <canvas ref={canvasRef} className="rounded-xl" />
            <p className="text-xs text-gray-400 text-center">
              QR코드로 분실물 정보 확인
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="bg-yellow-50 border-t border-yellow-200 px-5 py-3 text-center">
          <p className="text-xs text-yellow-700 font-medium">
            📱 스마트폰으로 QR 스캔 후<br />담임선생님 확인 → 찾기 완료
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          #qr-label { margin: 20px auto; }
        }
      `}</style>
    </div>
  )
}
