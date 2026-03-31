import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ItemForm from "@/components/items/ItemForm"
import type { LostItem } from "@/types"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: EditPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) notFound()

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
          <h1 className="text-xl font-bold text-gray-900">분실물 수정</h1>
          <p className="text-sm text-gray-500">{data.name}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <ItemForm item={data as LostItem} />
      </div>
    </div>
  )
}
