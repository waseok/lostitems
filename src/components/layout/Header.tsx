"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🔍</span>
          <div>
            <p className="font-extrabold text-gray-900 leading-tight text-base sm:text-lg">
              와석초 분실물 보관함
            </p>
            <p className="text-xs font-medium text-gray-500 leading-tight hidden sm:block">
              와석초등학교 분실물 센터
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/feedback"
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            💡 <span className="hidden sm:inline">건의하기</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">관리자</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
