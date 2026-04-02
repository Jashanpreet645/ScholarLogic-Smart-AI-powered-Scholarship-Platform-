export default function CookiePolicyPage() {
    return (
        <div className="flex flex-col min-h-[60vh] py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Cookie Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p className="text-muted-foreground leading-relaxed">
                        This cookie policy explains what cookies are and how ScholarLogic uses them to ensure you get the best experience on our website.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">What Are Cookies?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Cookies are minimal text files stored locally on your computer or mobile device when you visit a website. They allow the site to recognize your device and maintain continuity, such as keeping you securely logged in across routing events.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">How We Use Cookies</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Essential Session Cookies:</strong> We utilize clerk.dev and Supabase authentication tokens stored via secure HTTP-only cookies to verify your identity and protect your application dashboard.</li>
                        <li><strong>Preference Cookies:</strong> Used to remember UI state choices like whether you prefer our Light or Dark mode UI themes.</li>
                        <li><strong>Performance Analytics:</strong> Aggregation tracking for our marketing funnels to understand which pages load too slowly or how students discover ScholarLogic.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Managing Disabling</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        You can selectively disable tracking cookies in your browser settings. However, disabling the strictly necessary session cookies will prevent the core dashboard and matching engine from functioning.
                    </p>
                </div>
            </div>
        </div>
    );
}
