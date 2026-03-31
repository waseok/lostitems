import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ItemForm from "@/components/items/ItemForm"

export default function NewItemPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin"
          className="p-2 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">새 분실물 등록</h1>
          <p className="text-sm text-gray-500">발견된 분실물 정보를 입력해주세요.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <ItemForm />
      </div>
    </div>
  )
}
