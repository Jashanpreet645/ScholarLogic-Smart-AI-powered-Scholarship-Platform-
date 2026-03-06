import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full bg-background overflow-x-hidden p-4 md:p-8">
                <SidebarTrigger className="mb-4" />
                {children}
            </main>
        </SidebarProvider>
    )
}
