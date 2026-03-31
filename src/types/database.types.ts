export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lost_items: {
        Row: {
          category: Database["public"]["Enums"]["item_category"]
          completed_at: string | null
          created_at: string
          description: string | null
          finder_name: string
          found_date: string
          id: string
          location: string
          name: string
          photo_path: string | null
          photo_url: string | null
          status: Database["public"]["Enums"]["item_status"]
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["item_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          finder_name: string
          found_date?: string
          id?: string
          location: string
          name: string
          photo_path?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["item_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["item_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          finder_name?: string
          found_date?: string
          id?: string
          location?: string
          name?: string
          photo_path?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["item_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      item_category:
        | "clothing"
        | "bag"
        | "stationery"
        | "electronics"
        | "shoes"
        | "bottle"
        | "book"
        | "toy"
        | "other"
      item_status: "active" | "completed"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
