import Link from "next/link";
import { PlayCircle, UserPlus, Brain, FileText, CheckCircle2, FilterX, FileBadge, History } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import HeroSpline from "@/components/layout/HeroSpline";

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-[20px] md:pt-[20px] pb-10 md:pb-10 overflow-hidden bg-background dark:bg-background transition-colors duration-500">
                {/* Nebula Core - High-Contrast Centric Glow */}
                {/* Using z-0 for blobs and z-10 for content to fix stacking context issues */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[45%] left-0 w-full -translate-y-1/2 flex flex-col items-center">
                        {/* Outer Atmosphere - More Opaque Wide Horizon */}
                        <div className="w-full h-[300px] bg-primary/[0.22] dark:bg-primary/[0.35] blur-[100px] rounded-[100px] animate-pulse-slow"></div>
                        {/* Brilliant Core - More Opaque Wide Horizon Focus */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[180px] bg-primary/[0.35] dark:bg-primary/[0.5] blur-[60px] rounded-[60px]"></div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
                        {/* Left Side - Text Content */}
                        <div className="flex flex-col items-center text-center pt-0 pb-12 lg:py-0 lg:pr-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 dark:border-primary/30 text-primary dark:text-accent-light text-xs font-bold uppercase tracking-wider mb-8 transition-colors">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                AI-Powered Scholarship Matching
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black tracking-tighter text-foreground mb-6 leading-[1.1] transition-colors">
                                Find Scholarships You <br /> 
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:via-accent-light dark:to-info">
                                    Actually Qualify For
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed transition-colors">
                                Our AI engine scans thousands of databases to match you with opportunities tailored to your unique profile, effectively filtering out the noise.
                            </p>
                            <SignedOut>
                                <div className="flex flex-col items-center">
                                    <Link
                                        href="/signup"
                                        className="h-14 px-10 flex items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_rgba(123,92,250,0.5)] hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-[0_0_40px_rgba(123,92,250,0.7)] hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 ease-out mb-4"
                                    >
                                        Create Account
                                    </Link>
                                    <p className="text-sm text-muted-foreground text-center">
                                        Already have an account?{" "}
                                        <Link href="/signin" className="text-primary font-medium hover:underline transition-colors hover:text-primary-hover">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex flex-col items-center">
                                    <Link
                                        href="/dashboard"
                                        className="h-14 px-10 flex items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_rgba(123,92,250,0.5)] hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-[0_0_40px_rgba(123,92,250,0.7)] hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 ease-out mb-4"
                                    >
                                        Enter The Portal
                                    </Link>
                                </div>
                            </SignedIn>
                        </div>

                        {/* Right Side - Spline 3D */}
                        <HeroSpline />
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-20 md:py-32 bg-background relative" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-[38px] font-semibold text-foreground mb-4">Why Choose ScholarLogic?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">We go beyond traditional search aggregators. Our platform uses deep learning to match you effectively.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group relative flex flex-col gap-4 p-6 rounded-2xl glass-card glass-card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <FilterX className="h-6 w-6" />
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-foreground group-hover:text-primary transition-colors">Noise Elimination</h3>
                            <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">No more scrolling through dead links or expired scholarships. We only show what is active and what you actually qualify for.</p>
                        </div>
                        <div className="group relative flex flex-col gap-4 p-6 rounded-2xl glass-card glass-card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-foreground group-hover:text-primary transition-colors">Profile Matching</h3>
                            <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">Scholarships are matched based on your gender, ethnicity, GPA, location, and specific academic background.</p>
                        </div>
                        <div className="group relative flex flex-col gap-4 p-6 rounded-2xl glass-card glass-card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <FileBadge className="h-6 w-6" />
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-foreground group-hover:text-primary transition-colors">Auto-Generated SOPs</h3>
                            <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">Need an essay? Enter the prompt and our AI drafts a highly personalized statement of purpose referencing your unique profile.</p>
                        </div>
                        <div className="group relative flex flex-col gap-4 p-6 rounded-2xl glass-card glass-card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            <div className="relative z-10 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <History className="h-6 w-6" />
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-foreground group-hover:text-primary transition-colors">Application Tracking</h3>
                            <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">Keep all your upcoming deadlines, saved opportunities, and won amounts in one centralized dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 md:py-32 relative bg-background" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-[38px] font-semibold text-foreground mb-4">Precision Matching in Three Steps</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Stop wasting time on applications you won't win. Let our AI do the heavy lifting.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group relative glass-card glass-card-hover rounded-2xl p-8 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-15px] text-[80px] font-black text-primary/15 select-none z-0 group-hover:scale-110 transition-transform duration-500 group-hover:text-primary/25">01</div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-primary/20 group-hover:scale-110">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Build Your Student Profile</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Input your academic history, demographics, and extracurriculars once. We secure your data.</p>
                            </div>
                        </div>

                        <div className="group relative glass-card glass-card-hover rounded-2xl p-8 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-15px] text-[80px] font-black text-primary/15 select-none z-0 group-hover:scale-110 transition-transform duration-500 group-hover:text-primary/25">02</div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-primary/20 group-hover:scale-110">
                                    <Brain className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">AI Analyzes Eligibility</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Our engine cross-references 100+ data points against thousands of active scholarship criteria.</p>
                            </div>
                        </div>

                        <div className="group relative glass-card glass-card-hover rounded-2xl p-8 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-15px] text-[80px] font-black text-primary/15 select-none z-0 group-hover:scale-110 transition-transform duration-500 group-hover:text-primary/25">03</div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-primary/20 group-hover:scale-110">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Apply with AI-Written SOPs</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Generate personalized Statements of Purpose tailored to each specific scholarship's prompt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden bg-card border-t border-border/40">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-blob mix-blend-screen"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[400px] h-[400px] border border-white/20 rounded-full"></div>
                    <div className="absolute w-[600px] h-[600px] border border-white/20 rounded-full"></div>
                    <div className="absolute w-[800px] h-[800px] border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Start Matching Scholarships to Your Exact Profile</h2>
                    <p className="text-xl text-muted-foreground mb-10">Join thousands of students who have found their perfect scholarship matches with ScholarLogic.</p>
                    <SignedOut>
                        <Link
                            href="/signup"
                            className="inline-flex h-14 px-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold shadow-[0_0_20px_rgba(123,92,250,0.4)] hover:bg-primary-hover hover:scale-105 transition-all duration-300"
                        >
                            Get Started — It's Free
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
                    </SignedOut>
                    <SignedIn>
                        <Link
                            href="/dashboard"
                            className="inline-flex h-14 px-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold shadow-[0_0_20px_rgba(123,92,250,0.4)] hover:bg-primary-hover hover:scale-105 transition-all duration-300"
                        >
                            Enter The Portal
                        </Link>
                    </SignedIn>
                </div>
            </section>
        </div>
    );
}
