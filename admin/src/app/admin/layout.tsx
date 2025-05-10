import { AdminLayoutComponent } from "@/components/admin-layout"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayoutComponent>
            {children}
        </AdminLayoutComponent>
    )
}