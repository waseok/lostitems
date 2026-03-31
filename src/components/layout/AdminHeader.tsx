"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Plus, List, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-bold text-gray-900 text-sm sm:text-base">
            분실물 관리
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/admin/items/new">
            <Button size="sm" className="gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 h-8 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 분실물 등록</span>
              <span className="sm:hidden">등록</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5">
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">공개 목록</span>
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
