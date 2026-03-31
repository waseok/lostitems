import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: todayRow } = await supabase
    .from("daily_views")
    .select("count")
    .eq("date", today)
    .single()

  const { data: totalRow } = await supabase
    .from("daily_views")
    .select("count")

  const todayCount = todayRow?.count ?? 0
  const totalCount = (totalRow ?? []).reduce((sum: number, r: { count: number }) => sum + r.count, 0)

  return Response.json({ today: todayCount, total: totalCount })
}

export async function POST() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  await supabase.rpc("increment_daily_view", { view_date: today })

  const { data: todayRow } = await supabase
    .from("daily_views")
    .select("count")
    .eq("date", today)
    .single()

  const { data: totalRow } = await supabase
    .from("daily_views")
    .select("count")

  const todayCount = todayRow?.count ?? 0
  const totalCount = (totalRow ?? []).reduce((sum: number, r: { count: number }) => sum + r.count, 0)

  return Response.json({ today: todayCount, total: totalCount })
}
