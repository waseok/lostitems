import type { Database } from "./database.types"

export type LostItem = Database["public"]["Tables"]["lost_items"]["Row"]
export type LostItemInsert = Database["public"]["Tables"]["lost_items"]["Insert"]
export type LostItemUpdate = Database["public"]["Tables"]["lost_items"]["Update"]
export type ItemCategory = Database["public"]["Enums"]["item_category"]
export type ItemStatus = Database["public"]["Enums"]["item_status"]

export type DisplayStatus = "active" | "claiming" | "completed" | "pending"

export function getDisplayStatus(item: LostItem): DisplayStatus {
  if (item.status === "completed") return "completed"
  if (item.status === "pending") return "pending"
  if (item.status === "active" && item.claimer_name) return "claiming"
  return "active"
}

export const STATUS_CONFIG: Record<DisplayStatus, { label: string; color: string; bg: string; border: string }> = {
  active:    { label: "보관 중",  color: "text-sky-700",    bg: "bg-sky-50",     border: "border-sky-200" },
  claiming:  { label: "수령 대기", color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-200" },
  completed: { label: "반환 완료", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  pending:   { label: "승인 대기", color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200" },
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  clothing: "의류",
  bag: "가방",
  stationery: "문구류",
  electronics: "전자기기",
  shoes: "신발",
  bottle: "물통/도시락",
  book: "책/공책",
  toy: "장난감/체육용품",
  other: "기타",
}

export const CATEGORY_EMOJIS: Record<ItemCategory, string> = {
  clothing: "👕",
  bag: "🎒",
  stationery: "✏️",
  electronics: "🎧",
  shoes: "👟",
  bottle: "💧",
  book: "📚",
  toy: "⚽",
  other: "📦",
}

export const ALL_CATEGORIES: ItemCategory[] = [
  "clothing",
  "bag",
  "stationery",
  "electronics",
  "shoes",
  "bottle",
  "book",
  "toy",
  "other",
]
