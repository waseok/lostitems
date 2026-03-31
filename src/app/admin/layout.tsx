import { checkAdminSession } from "@/lib/auth"
import AdminHeader from "@/components/layout/AdminHeader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await checkAdminSession()

  if (!isAdmin) {
    // 로그인 페이지: 헤더 없이 그대로 렌더
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
