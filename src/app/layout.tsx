import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "분실물 찾기 | 우리 학교",
  description: "학교 분실물 조회 및 찾기 서비스",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-gray-50 antialiased font-sans">{children}</body>
    </html>
  )
}
