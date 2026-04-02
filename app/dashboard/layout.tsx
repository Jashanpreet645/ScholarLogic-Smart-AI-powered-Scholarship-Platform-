import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import ScholarBot from "@/components/dashboard/ScholarBot"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="flex-1 w-full bg-background overflow-x-hidden p-4 md:p-8">
                {children}
            </main>
            <ScholarBot />
        </SidebarProvider>
    )
}
