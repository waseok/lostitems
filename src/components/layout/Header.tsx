"use client"

import Link from "next/link"
import { Search, ShieldCheck } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <div>
            <p className="font-bold text-gray-900 leading-tight text-sm sm:text-base">
              분실물 찾기
            </p>
            <p className="text-xs text-gray-500 leading-tight hidden sm:block">
              우리 학교 분실물 센터
            </p>
          </div>
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">관리자</span>
        </Link>
      </div>
    </header>
  )
}
