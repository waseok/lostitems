"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Lightbulb } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-16 sm:h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/icon.png"
            alt="와석 보관함"
            width={44}
            height={44}
            className="rounded-full flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-extrabold text-gray-900 text-lg sm:text-xl leading-tight truncate">
              와석초 분실물 보관함
            </p>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-tight hidden sm:block">
              와석초등학교 분실물 센터
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 flex-shrink-0 ml-3">
          <Link
            href="/feedback"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors px-3 py-2 rounded-lg"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">건의하기</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors px-3 py-2 rounded-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">관리자</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
