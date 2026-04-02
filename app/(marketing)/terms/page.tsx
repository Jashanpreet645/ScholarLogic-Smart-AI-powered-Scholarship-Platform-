export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col min-h-[60vh] py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Terms of Service</h1>
                <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to ScholarLogic. By accessing our platform, you agree to be bound by the following terms and conditions.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Platform Services</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        ScholarLogic provides AI-assisted tools to aggregate public scholarship data and facilitate document drafting. We do not distribute direct educational funding, nor do we guarantee the awarding of any scholarship, grant, or financial aid to any user. 
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. User Conduct & Accuracy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        You agree to provide perfectly accurate, current, and complete information when constructing your student profile. Misrepresenting academic standing, financial need, or demographics not only violates these terms but constitutes academic fraud and may disqualify you from institutional funding.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. AI Generated Content</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The AI-generated Statements of Purpose and essays drafted by our platform serve as accelerated starting points and structural frameworks. Users are strictly responsible for reviewing, modifying, and finalizing their own work before submission. ScholarLogic holds no liability for rejections due to AI-detection systems or improperly reviewed essays.
                    </p>
                </div>
            </div>
        </div>
    );
}
