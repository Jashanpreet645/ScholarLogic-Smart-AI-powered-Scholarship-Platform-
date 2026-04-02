import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SuccessStoriesPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <section className="py-20 md:py-32 bg-primary/5 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">Success Stories</h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        See how students are using ScholarLogic's AI engine to win thousands in college funding without the stress.
                    </p>
                </div>
            </section>
            
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Placeholder Story Cards */}
                        <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Sarah Jenkins</h3>
                            <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">Won $15,000 in Grants</p>
                            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                                "I spent hours writing essays that went nowhere. ScholarLogic matched me to 15 specialized grants I didn't even know existed and the AI helped me draft my SOPs in minutes."
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Michael Torres</h3>
                            <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">First Gen Scholar</p>
                            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                                "Being the first in my family to go to college, the financial barrier was huge. ScholarLogic's precise filtering found obscure local diversity scholarships that funded my first year."
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Aisha Patel</h3>
                            <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">Fully Funded STEM Major</p>
                            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                                "The application tracker is a lifesaver. I applied to 20 different foundation tech scholarships and tracked all deadlines in the dashboard. I ended up winning 3 of them."
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-20 text-center">
                        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-[0_0_20px_rgba(123,92,250,0.5)] hover:bg-primary-hover hover:scale-105 transition-all">
                            Start Your Success Story <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
