import { createClient } from "@/lib/supabase/server"

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const today = new Date().toISOString().split("T")[0]
  const { data: todayRow } = await supabase.from("daily_views").select("count").eq("date", today).single()
  const { data: allRows } = await supabase.from("daily_views").select("count")
  const total = (allRows ?? []).reduce((s: number, r: { count: number }) => s + r.count, 0)
  return { today: todayRow?.count ?? 0, total }
}

export async function GET() {
  const supabase = await createClient()
  return Response.json(await getStats(supabase))
}

export async function POST() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: existing } = await supabase.from("daily_views").select("count").eq("date", today).single()
  if (existing) {
    await supabase.from("daily_views").update({ count: existing.count + 1 }).eq("date", today)
  } else {
    await supabase.from("daily_views").insert({ date: today, count: 1 })
  }

  return Response.json(await getStats(supabase))
}
