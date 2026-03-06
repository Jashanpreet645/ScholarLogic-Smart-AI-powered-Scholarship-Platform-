import Link from "next/link";
import { PlayCircle, UserPlus, Brain, FileText, CheckCircle2, FilterX, FileBadge, History } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-background">
                {/* Background Decorative Element */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                    <svg className="opacity-[0.06]" fill="none" height="1000" viewBox="0 0 1000 1000" width="1000" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="500" cy="500" r="300" stroke="#7B5CFA" strokeWidth="1.5"></circle>
                        <circle cx="500" cy="500" r="450" stroke="#7B5CFA" strokeWidth="1.5"></circle>
                    </svg>
                </div>

                <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-accent-light text-xs font-semibold uppercase tracking-wider mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        AI-Powered Scholarship Matching
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-[56px] font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        Find Scholarships You <br className="hidden md:block" /> Actually Qualify For
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Our AI engine scans thousands of databases to match you with opportunities tailored to your unique profile, effectively filtering out the noise.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/signup"
                            className="h-12 px-8 flex items-center justify-center rounded-xl bg-primary text-white font-semibold shadow-[0_0_20px_rgba(123,92,250,0.5)] hover:shadow-[0_0_30px_rgba(123,92,250,0.6)] hover:bg-primary-hover transition-all duration-300"
                        >
                            Build My Profile
                        </Link>
                        <button className="h-12 px-8 rounded-xl bg-transparent border border-border text-white font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex items-center gap-2">
                            <PlayCircle className="h-5 w-5" />
                            See How It Works
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border/40 bg-background relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
                        <div className="py-10 md:px-8 flex flex-col items-center justify-center text-center">
                            <p className="text-4xl font-bold text-accent-light mb-2">12,000+</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Scholarships Indexed</p>
                        </div>
                        <div className="py-10 md:px-8 flex flex-col items-center justify-center text-center">
                            <p className="text-4xl font-bold text-accent-light mb-2">94%</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Match Accuracy</p>
                        </div>
                        <div className="py-10 md:px-8 flex flex-col items-center justify-center text-center">
                            <p className="text-4xl font-bold text-accent-light mb-2">3 min</p>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Setup Time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 md:py-32 relative bg-background" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-[38px] font-semibold text-foreground mb-4">Precision Matching in Three Steps</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Stop wasting time on applications you won't win. Let our AI do the heavy lifting.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-[64px] font-bold text-secondary select-none opacity-50 z-0">01</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Build Your Student Profile</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Input your academic history, demographics, and extracurriculars once. We secure your data.</p>
                            </div>
                        </div>

                        <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-[64px] font-bold text-secondary select-none opacity-50 z-0">02</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
                                    <Brain className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">AI Analyzes Eligibility</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Our engine cross-references 100+ data points against thousands of active scholarship criteria.</p>
                            </div>
                        </div>

                        <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-[64px] font-bold text-secondary select-none opacity-50 z-0">03</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Apply with AI-Written SOPs</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">Generate personalized Statements of Purpose tailored to each specific scholarship's prompt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden bg-card border-t border-border/40">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[400px] h-[400px] border border-white/20 rounded-full"></div>
                    <div className="absolute w-[600px] h-[600px] border border-white/20 rounded-full"></div>
                    <div className="absolute w-[800px] h-[800px] border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Start Matching Scholarships to Your Exact Profile</h2>
                    <p className="text-xl text-muted-foreground mb-10">Join thousands of students who have found their perfect scholarship matches with ScholarLogic.</p>
                    <Link
                        href="/signup"
                        className="inline-flex h-14 px-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold shadow-[0_0_20px_rgba(123,92,250,0.4)] hover:bg-primary-hover hover:scale-105 transition-all duration-300"
                    >
                        Get Started — It's Free
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
                </div>
            </section>
        </div>
    );
}
