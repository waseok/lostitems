import type { Database } from "./database.types"

export type LostItem = Database["public"]["Tables"]["lost_items"]["Row"]
export type LostItemInsert = Database["public"]["Tables"]["lost_items"]["Insert"]
export type LostItemUpdate = Database["public"]["Tables"]["lost_items"]["Update"]
export type ItemCategory = Database["public"]["Enums"]["item_category"]
export type ItemStatus = Database["public"]["Enums"]["item_status"]

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
  bottle: "🍶",
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
