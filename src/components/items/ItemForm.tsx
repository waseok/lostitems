"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, X, Camera } from "lucide-react"
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type LostItem } from "@/types"

const schema = z.object({
  name: z.string().min(1, "분실물 이름을 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  location: z.string().min(1, "보관 장소를 입력해주세요."),
  finder_name: z.string().min(1, "발견자 이름을 입력해주세요."),
  found_date: z.string().min(1, "발견 날짜를 선택해주세요."),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ItemFormProps {
  item?: LostItem
  redirectTo?: string
}

export default function ItemForm({ item, redirectTo = "/admin" }: ItemFormProps) {
  const router = useRouter()
  const isEdit = !!item

  const [photoUrl, setPhotoUrl] = useState(item?.photo_url || "")
  const [photoPath, setPhotoPath] = useState(item?.photo_path || "")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "other",
      location: item?.location || "",
      finder_name: item?.finder_name || "",
      found_date: item?.found_date || new Date().toISOString().split("T")[0],
      description: item?.description || "",
    },
  })

  const watchCategory = watch("category")

  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const MAX = 900
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }) : file)
        }, "image/jpeg", 0.82)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append("file", compressed)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "업로드 실패")
        return
      }
      const data = await res.json()
      setPhotoUrl(data.url)
      setPhotoPath(data.path)
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: FormValues) {
    setSaving(true)
    try {
      const body = {
        ...values,
        photo_url: photoUrl || null,
        photo_path: photoPath || null,
      }
      const url = isEdit ? `/api/items/${item.id}` : "/api/items"
      const method = isEdit ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "저장 실패")
        return
      }
      const data = await res.json()
      router.push(redirectTo)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 사진 업로드 */}
      <div>
        <Label className="mb-2 block">분실물 사진</Label>
        <div className="flex gap-4 items-start">
          <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
            {photoUrl ? (
              <>
                <Image src={photoUrl} alt="preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => { setPhotoUrl(""); setPhotoPath("") }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                <Camera className="w-6 h-6" />
                <span className="text-xs">사진 없음</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="photo-input"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "업로드 중..." : "사진 선택"}
            </Label>
            <input
              id="photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePhotoUpload(file)
                e.target.value = ""
              }}
            />
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · 최대 5MB</p>
          </div>
        </div>
      </div>

      {/* 분실물 이름 */}
      <div>
        <Label htmlFor="name" className="mb-1.5 block">
          분실물 이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="예: 빨간색 운동화, 노란 우산..."
          {...register("name")}
          className="rounded-xl"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* 카테고리 */}
      <div>
        <Label className="mb-1.5 block">
          카테고리 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={watchCategory}
          onValueChange={(v) => v && setValue("category", v)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 보관 장소 */}
      <div>
        <Label htmlFor="location" className="mb-1.5 block">
          보관 장소 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          placeholder="예: 1학년 교무실, 행정실, 현관 분실물 보관함"
          {...register("location")}
          className="rounded-xl"
        />
        {errors.location && (
          <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
        )}
      </div>

      {/* 발견자 */}
      <div>
        <Label htmlFor="finder_name" className="mb-1.5 block">
          발견자 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="finder_name"
          placeholder="발견한 선생님 또는 학생 이름"
          {...register("finder_name")}
          className="rounded-xl"
        />
        {errors.finder_name && (
          <p className="text-xs text-red-500 mt-1">{errors.finder_name.message}</p>
        )}
      </div>

      {/* 발견 날짜 */}
      <div>
        <Label htmlFor="found_date" className="mb-1.5 block">
          발견 날짜 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="found_date"
          type="date"
          {...register("found_date")}
          className="rounded-xl"
        />
        {errors.found_date && (
          <p className="text-xs text-red-500 mt-1">{errors.found_date.message}</p>
        )}
      </div>

      {/* 상세 설명 */}
      <div>
        <Label htmlFor="description" className="mb-1.5 block">
          상세 설명 <span className="text-gray-400 text-xs">(선택)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="색상, 이름표, 특징 등 추가 설명..."
          rows={3}
          {...register("description")}
          className="rounded-xl resize-none"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => router.back()}
          disabled={saving}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
          disabled={saving || uploading}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEdit ? (
            "수정 저장"
          ) : (
            "등록"
          )}
        </Button>
      </div>
    </form>
  )
}
