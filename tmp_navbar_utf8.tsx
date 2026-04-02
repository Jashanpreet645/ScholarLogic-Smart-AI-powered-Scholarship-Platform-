import Link from "next/link";
import { GraduationCap, PlayCircle, UserPlus, Brain, FileText } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            Scholar<span className="text-primary">Logic</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            How It Works
                        </Link>
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/signin" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:bg-primary-hover shadow-[0_0_15px_rgba(123,92,250,0.3)]"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
