import type { LostItem } from "@/types"
import { CATEGORY_LABELS } from "@/types"

export async function sendNewItemNotification(item: LostItem) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL
  if (!webhookUrl) return // 환경변수 없으면 무시

  const itemUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lostitems-three.vercel.app"}/items/${item.id}`

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        category: CATEGORY_LABELS[item.category],
        location: item.location,
        finder_name: item.finder_name,
        found_date: item.found_date,
        photo_url: item.photo_url ?? null,
        item_url: itemUrl,
        // Make에서 카카오 메시지용 포맷
        message: `📦 새 분실물이 등록되었습니다!\n\n` +
          `이름: ${item.name}\n` +
          `보관장소: ${item.location}\n` +
          `발견날짜: ${item.found_date}\n\n` +
          `▶ 자세히 보기: ${itemUrl}`,
      }),
    })
  } catch {
    // 알림 실패해도 메인 기능에 영향 없게
    console.warn("[notification] webhook 전송 실패")
  }
}
