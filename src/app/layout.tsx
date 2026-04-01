import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "와석초 분실물 보관함",
  description: "와석초등학교 분실물 조회 및 찾기 서비스",
  openGraph: {
    title: "와석초 분실물 보관함",
    description: "와석초등학교 분실물 조회 및 찾기 서비스",
    siteName: "와석초 분실물 보관함",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
