"use client"

import { useState, useEffect } from "react"
import { Eye } from "lucide-react"

export default function VisitorCounter() {
  const [stats, setStats] = useState<{ today: number; total: number } | null>(null)

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <div className="flex items-center justify-center gap-4 py-4 text-xs text-gray-400">
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" />
        <span>오늘</span>
        <span className="font-semibold text-gray-600">
          {stats ? stats.today.toLocaleString() : "-"}
        </span>
      </div>
      <span>·</span>
      <div className="flex items-center gap-1.5">
        <span>누적</span>
        <span className="font-semibold text-gray-600">
          {stats ? stats.total.toLocaleString() : "-"}
        </span>
      </div>
    </div>
  )
}
