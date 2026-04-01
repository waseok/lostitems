"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Plus, Home, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 bg-indigo-900 border-b border-indigo-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-700 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
          </div>
          <div>
            <span className="font-bold text-white text-sm sm:text-base">
              와석초 분실물 관리
            </span>
            <span className="ml-2 text-xs bg-indigo-600 text-indigo-200 px-2 py-0.5 rounded-full hidden sm:inline">
              관리자 모드
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/admin/items/new">
            <Button size="sm" className="gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 h-8 text-xs text-white">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 분실물 등록</span>
              <span className="sm:hidden">등록</span>
            </Button>
          </Link>
          <Link href="/admin/feedback">
            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5 border-indigo-600 text-indigo-200 hover:bg-indigo-800 bg-transparent">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">건의함</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5 border-indigo-600 text-indigo-200 hover:bg-indigo-800 bg-transparent">
              <Home className="w-3.5 h-3.5" />
              <span>홈</span>
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            title="로그아웃"
            className="p-2 rounded-xl hover:bg-indigo-800 text-indigo-300 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
