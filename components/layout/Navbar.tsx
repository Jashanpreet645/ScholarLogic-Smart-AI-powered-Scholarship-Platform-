import { HeaderControls } from "@/components/layout/HeaderControls";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export async function Navbar() {
    return (
        <header className="sticky top-6 z-50 px-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-center">
                <div className="flex items-center justify-between gap-8 h-16 px-8 rounded-full border border-black/5 dark:border-white/10 bg-background/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-foreground">
                            Scholar<span className="text-primary">Logic</span>
                        </span>
                    </Link>

                    {/* Nav Links - Spaced Out */}
                    <nav className="hidden lg:flex items-center gap-8 border-x border-black/5 dark:border-white/10 px-8 h-8">
                        <Link href="/about" className="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">About</Link>
                        <Link href="/#features" className="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Features</Link>
                        <Link href="/pricing" className="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
                        <Link href="/contact" className="text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                    </nav>

                    {/* Integrated User & Theme Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        <HeaderControls isInline={true} />
                    </div>
                </div>
            </div>
        </header>
    );
}
