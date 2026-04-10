"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Lightbulb } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-100">
      <div className="max-w-5xl mx-auto px-4 h-16 sm:h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/icon.png"
            alt="와석 보관함"
            width={44}
            height={44}
            className="rounded-full flex-shrink-0 ring-2 ring-sky-100"
          />
          <div className="min-w-0">
            <p className="font-extrabold text-gray-800 text-lg sm:text-xl leading-tight truncate">
              와석초 분실물 보관함
            </p>
            <p className="text-[11px] sm:text-xs text-sky-400 leading-tight hidden sm:block">
              와석초등학교 분실물 센터
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 flex-shrink-0 ml-3">
          <Link
            href="/feedback"
            className="touch-target btn-bounce flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors px-3 py-2 rounded-xl"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">건의하기</span>
          </Link>
          <Link
            href="/admin"
            className="touch-target btn-bounce flex items-center gap-1.5 text-xs text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-colors px-3 py-2 rounded-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">관리자</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
