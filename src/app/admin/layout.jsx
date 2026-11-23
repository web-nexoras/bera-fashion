import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { requireAdmin } from "@/lib/auth";
export default async function AdminLayout({ children }) {
    await requireAdmin("/admin");
    return (<div className="min-h-screen bg-canvas">
      <AdminSidebar />
      <div className="min-h-screen lg:pl-[268px]">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>);
}
