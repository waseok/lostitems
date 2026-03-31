import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKoreanDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    return format(date, "M월 d일 (E)", { locale: ko })
  } catch {
    return dateStr
  }
}

export function formatKoreanDateTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    return format(date, "yyyy년 M월 d일 HH:mm", { locale: ko })
  } catch {
    return dateStr
  }
}

export function formatKoreanDateShort(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    return format(date, "M/d", { locale: ko })
  } catch {
    return dateStr
  }
}
