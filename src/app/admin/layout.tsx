import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Not authenticated → show login form directly (no redirect)
  if (!session) {
    return <AdminAuthGuard />;
  }

  return (
    <div className="flex h-screen bg-hormadi-dark">
      {/* Sidebar */}
      <AdminSidebar user={session} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
