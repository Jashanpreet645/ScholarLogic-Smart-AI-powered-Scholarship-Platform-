export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-[60vh] py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p>At ScholarLogic, we take your privacy extremely seriously. We collect the minimum amount of data required to match you with appropriate scholarships and generate accurate Statements of Purpose.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Account Information:</strong> Name, email address, and authentication data provided by our secure authentication provider.</li>
                        <li><strong>Student Profile Metadata:</strong> Demographic data, academic history (GPA, majors), geographical location, and extracurricular statements.</li>
                        <li><strong>Usage Data:</strong> Basic analytics on application flow to improve our intelligent matching engine.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Data</h2>
                    <p className="text-muted-foreground">
                        Your profile data is strictly utilized to parameterize our matching algorithms and power the AI document generation tools.
                        We do <strong>not</strong> sell, rent, or lease your personal identifiers to third-party marketers or data brokers. Data shared with our large language models (such as Gemini) for SOP generation is anonymized where possible.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
                    <p className="text-muted-foreground">
                        We implement strict, industry-standard Postgres row-level security policies (RLS) to ensure your data is isolated at the tenant level. Transport layer security encrypts data during transmission to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}
