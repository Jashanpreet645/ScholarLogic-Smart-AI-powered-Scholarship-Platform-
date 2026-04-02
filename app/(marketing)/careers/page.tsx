import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-[60vh] py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">Careers</h1>
                <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
                    Help us build the smartest AI application pipeline and make education accessible for everyone.
                </p>
                
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12 mt-8">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">No open positions right now.</h3>
                    <p className="text-muted-foreground mb-8">
                        We are a small, dedicated team currently heads-down building our core platform. We are not actively hiring, but we are always looking to connect with passionate AI engineers and product designers.
                    </p>
                    <Link href="mailto:careers@scholarlogic.com" className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border hover:bg-secondary transition-colors rounded-lg font-medium text-foreground">
                        Send us your resume
                    </Link>
                </div>
            </div>
        </div>
    );
}
