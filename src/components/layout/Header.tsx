"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="와석 보관함"
            width={48}
            height={48}
            className="rounded-full shadow-sm flex-shrink-0"
          />
          <div>
            <p className="font-extrabold text-gray-900 leading-tight text-lg sm:text-2xl tracking-tight">
              와석초 분실물 보관함
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-400 leading-tight">
              와석초등학교 분실물 센터
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/feedback"
            className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors px-2 sm:px-3 py-1.5 rounded-xl hover:bg-blue-50 flex items-center gap-1"
          >
            💡 <span className="hidden sm:inline">건의하기</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-indigo-600 transition-colors px-2 sm:px-3 py-1.5 rounded-xl hover:bg-indigo-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">관리자</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
