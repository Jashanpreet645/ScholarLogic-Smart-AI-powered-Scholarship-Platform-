export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-[60vh] py-20 md:py-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center">The ScholarLogic Blog</h1>
                <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto text-center">
                    Tips, strategies, and AI updates for maximizing your financial aid.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    {/* Placeholder Articles */}
                    <div className="group cursor-pointer">
                        <div className="w-full h-64 bg-secondary rounded-2xl mb-6 overflow-hidden border border-border relative">
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors"></div>
                        </div>
                        <div className="text-sm font-semibold text-primary mb-3">FINANCIAL AID STRATEGY</div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">How to Write a Winning Statement of Purpose with AI Assistance</h3>
                        <p className="text-muted-foreground">Discover the fine line between utilizing AI tools for brainstorming and ensuring your personal voice shines through in your application essay.</p>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="w-full h-64 bg-secondary rounded-2xl mb-6 overflow-hidden border border-border relative">
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                        </div>
                        <div className="text-sm font-semibold text-blue-400 mb-3">PLATFORM UPDATES</div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-blue-400 transition-colors">Our New Application Tracker Dashboard is Live</h3>
                        <p className="text-muted-foreground">We've entirely revamped how you track deadlines, manage documents, and monitor your scholarship pipeline in real-time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
