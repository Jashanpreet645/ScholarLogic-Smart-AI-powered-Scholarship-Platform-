import { AppSidebar } from "@/components/layout/AppSidebar"

// Since admin needs same layout style as dashboard, we just use the Dashboard layout or export separately.
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <main className="flex-1 w-full bg-background overflow-x-hidden p-4 md:p-8">
                {children}
            </main>
        </>
    )
}
