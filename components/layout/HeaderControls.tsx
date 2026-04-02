"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

interface HeaderControlsProps {
    isInline?: boolean;
}

export function HeaderControls({ isInline = false }: HeaderControlsProps) {
    const { theme } = useTheme()
    const { user, isLoaded } = useUser()
    const pathname = usePathname()

    // Hide on Auth Pages OR Marketing Pages where it's integrated into the Navbar
    const isMarketingPage = ["/", "/about", "/contact", "/pricing"].includes(pathname);
    if (!isLoaded || pathname.startsWith("/signin") || pathname.startsWith("/signup") || (isMarketingPage && !isInline)) return null

    const profileContent = (
        <div className="flex items-center gap-4 pr-6 pl-2 cursor-pointer group/profile">
            <div className="flex flex-col text-right">
                <span className="text-sm font-extrabold tracking-tight text-foreground leading-tight drop-shadow-sm">
                    {user?.fullName || "ScholarLogic"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/40 transition-all duration-300 group-hover/profile:text-muted-foreground leading-tight truncate max-w-[120px]">
                    {user?.primaryEmailAddress?.emailAddress || "ScholarLogic@gmail.com"}
                </span>
            </div>
            
            {/* Avatar Wrapper with halo visibility */}
            <div className="flex shrink-0 items-center justify-center p-0.5 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-inner group-hover:border-primary/50 group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-500 w-9 h-9">
                {user ? (
                    <UserButton 
                        afterSignOutUrl="/" 
                        appearance={{
                            baseTheme: theme === "dark" ? dark : undefined,
                            elements: {
                                userButtonBox: "justify-center",
                                userButtonAvatarBox: "border border-black/5 dark:border-white/20 w-8 h-8"
                            }
                        }}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );

    if (isInline) {
        return (
            <motion.div 
                className="group relative flex items-center gap-4 p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-black/10 dark:hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(123,92,250,0.15)]"
            >
                {/* Subtle internal glow that activates on group hover - more defined */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md pointer-events-none" />

                {/* Theme Toggle container */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                    <ThemeToggle />
                </div>
                
                {/* Refined Vertical Separator */}
                <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-black/10 dark:via-white/10 to-transparent mx-2 relative z-10" />

                {/* Profile Section */}
                <div className="relative z-10">
                    {user ? (
                        profileContent
                    ) : (
                        <Link href="/signin">
                            {profileContent}
                        </Link>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "fixed top-4 right-4 group",
                pathname === "/" ? "z-[60]" : "z-40"
            )}
        >
            {/* Sexy Glow Effect - Softer for Light Mode, Boosted for Dark */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 dark:from-violet-600/40 via-primary/10 dark:via-primary/40 to-blue-600/10 dark:to-blue-600/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Animated Border Background - Subtle in Light, Sharp in Dark */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-400/20 via-primary/30 to-blue-400/20 dark:from-violet-400 dark:via-primary dark:to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Main Bar with Adaptive Glassmorphism */}
            <div className="relative flex items-center gap-4 p-1.5 rounded-full backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-black/5 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:border-black/10 dark:group-hover:border-white/40">
                
                {/* Theme Toggle container */}
                <div className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors duration-300">
                    <ThemeToggle />
                </div>
                
                {/* Refined Vertical Separator */}
                <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-black/10 dark:via-white/10 to-transparent mx-2" />

                {/* Profile Section */}
                {user ? (
                    profileContent
                ) : (
                    <Link href="/signin">
                        {profileContent}
                    </Link>
                )}
            </div>
        </motion.div>
    )
}
