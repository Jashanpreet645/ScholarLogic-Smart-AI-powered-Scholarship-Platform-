"use client"

import * as React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    GraduationCap, 
    LayoutDashboard, 
    Target, 
    Layers, 
    FolderLock, 
    FileText, 
    Settings,
    ChevronLeft
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const items = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Matches",
        url: "/dashboard/matches",
        icon: Target,
    },
    {
        title: "Applications",
        url: "/dashboard/applications",
        icon: Layers,
    },
    {
        title: "Document Vault",
        url: "/dashboard/vault",
        icon: FolderLock,
    },
]

const aiTools = [
    {
        title: "SOP Generator",
        url: "/dashboard/sop",
        icon: FileText,
    },
]

const adminItems = [
    {
        title: "Pipeline Monitor",
        url: "/dashboard/admin",
        icon: Settings,
    }
]

export function AppSidebar() {
    const pathname = usePathname()
    const { setOpen, open, toggleSidebar } = useSidebar()
    const [isHoverExpanded, setIsHoverExpanded] = useState(false)
    const wasOpenBeforeHover = useRef(open)

    const handleMouseEnter = () => {
        wasOpenBeforeHover.current = open
        if (!open) {
            setOpen(true)
            setIsHoverExpanded(true)
        }
    }

    const handleMouseLeave = () => {
        if (isHoverExpanded) {
            setOpen(false)
            setIsHoverExpanded(false)
        }
    }

    return (
        <Sidebar 
            variant="inset" 
            collapsible="icon"
            className="border-r-0 backdrop-blur-md bg-background/60 dark:bg-black/20 transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Sexy background glow for the sidebar */}
            <div className="absolute inset-0 z-[-1] opacity-50 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-violet-500/5 blur-[80px] rounded-full" />
            </div>

            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            className="hover:bg-transparent group/header-btn relative"
                            onClick={() => toggleSidebar()}
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover/header-btn:scale-110">
                                <GraduationCap className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
                                <span className="truncate font-bold text-foreground">ScholarLogic</span>
                                <span className="truncate text-xs font-medium text-muted-foreground">AI Platform</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-4">
                        Main Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {(() => {
                                        const isActive = pathname === item.url
                                        return (
                                            <SidebarMenuButton 
                                                asChild 
                                                className={cn(
                                                    "relative group/menu-btn overflow-hidden transition-all duration-300 hover:text-primary active:scale-95",
                                                    isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <div className={cn(
                                                        "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent transition-opacity",
                                                        isActive ? "opacity-100" : "opacity-0 group-hover/menu-btn:opacity-100"
                                                    )} />
                                                    <div className={cn(
                                                        "absolute left-0 top-1/2 -translate-y-1/2 w-[2px] bg-primary transition-all duration-300",
                                                        isActive ? "h-1/2" : "h-0 group-hover/menu-btn:h-1/2"
                                                    )} />
                                                    <item.icon className={cn(
                                                        "transition-all duration-300",
                                                        isActive ? "scale-110 text-primary" : "group-hover/menu-btn:scale-110 group-hover/menu-btn:text-primary"
                                                    )} />
                                                    <span className={cn(
                                                        "font-semibold transition-all duration-300",
                                                        isActive ? "translate-x-1" : "group-hover/menu-btn:translate-x-1"
                                                    )}>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )
                                    })()}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-4">
                        AI Tools
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {aiTools.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {(() => {
                                        const isActive = pathname === item.url
                                        return (
                                            <SidebarMenuButton 
                                                asChild 
                                                className={cn(
                                                    "relative group/menu-btn overflow-hidden transition-all duration-300 hover:text-primary active:scale-95",
                                                    isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <div className={cn(
                                                        "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent transition-opacity",
                                                        isActive ? "opacity-100" : "opacity-0 group-hover/menu-btn:opacity-100"
                                                    )} />
                                                    <div className={cn(
                                                        "absolute left-0 top-1/2 -translate-y-1/2 w-[2px] bg-primary transition-all duration-300",
                                                        isActive ? "h-1/2" : "h-0 group-hover/menu-btn:h-1/2"
                                                    )} />
                                                    <item.icon className={cn(
                                                        "transition-all duration-300",
                                                        isActive ? "scale-110 text-primary" : "group-hover/menu-btn:scale-110 group-hover/menu-btn:text-primary"
                                                    )} />
                                                    <span className={cn(
                                                        "font-semibold transition-all duration-300",
                                                        isActive ? "translate-x-1" : "group-hover/menu-btn:translate-x-1"
                                                    )}>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )
                                    })()}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-4">
                        Admin
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {(() => {
                                        const isActive = pathname === item.url
                                        return (
                                            <SidebarMenuButton 
                                                asChild 
                                                className={cn(
                                                    "relative group/menu-btn overflow-hidden transition-all duration-300 hover:text-primary active:scale-95",
                                                    isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <div className={cn(
                                                        "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent transition-opacity",
                                                        isActive ? "opacity-100" : "opacity-0 group-hover/menu-btn:opacity-100"
                                                    )} />
                                                    <div className={cn(
                                                        "absolute left-0 top-1/2 -translate-y-1/2 w-[2px] bg-primary transition-all duration-300",
                                                        isActive ? "h-1/2" : "h-0 group-hover/menu-btn:h-1/2"
                                                    )} />
                                                    <item.icon className={cn(
                                                        "transition-all duration-300",
                                                        isActive ? "scale-110 text-primary" : "group-hover/menu-btn:scale-110 group-hover/menu-btn:text-primary"
                                                    )} />
                                                    <span className={cn(
                                                        "font-semibold transition-all duration-300",
                                                        isActive ? "translate-x-1" : "group-hover/menu-btn:translate-x-1"
                                                    )}>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )
                                    })()}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* Profile Controls Moved to Top Right Corner */}
            </SidebarFooter>
        </Sidebar>
    )
}
