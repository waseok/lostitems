import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import QrLabelPrint from "@/components/admin/QrLabelPrint"
import type { LostItem } from "@/types"

interface QrPageProps {
  params: Promise<{ id: string }>
}

export default async function QrPage({ params }: QrPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) notFound()

  return <QrLabelPrint item={data as LostItem} />
}
