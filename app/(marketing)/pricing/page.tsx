import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Essential tools to find scholarships and apply manually.",
            features: [
                "Base AI Matching (Top 10 daily)",
                "Student Profile Builder",
                "Save & Track Applications",
                "Public Scholarships Database",
            ],
            missing: [
                "AI SOP Generator",
                "Unlimited Matches",
                "Secure Document Vault",
                "Early Deadline Alerts",
            ],
            cta: "Get Started",
            link: "/signup",
            popular: false,
        },
        {
            name: "Pro",
            price: "₹499/mo",
            description: "Everything you need to automate your applications and win more.",
            features: [
                "Unlimited AI Matching",
                "AI SOP Generator (20 drafts/mo)",
                "Secure Document Vault (5GB)",
                "Early Deadline Alerts",
                "Priority Support",
            ],
            missing: [],
            cta: "Upgrade to Pro",
            link: "/signup",
            popular: true,
        }
    ];

    return (
        <div className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Invest in your future. Let our AI do the hard work of finding and writing applications so you can focus on studying.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`relative bg-card border ${plan.popular ? 'border-primary/50 shadow-[0_0_30px_rgba(123,92,250,0.15)]' : 'border-border'} flex flex-col`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="mt-4 mb-2">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                </div>
                                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.missing.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 opacity-50">
                                            <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                            <span className="text-sm text-muted-foreground line-through">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary-hover shadow-[0_0_15px_rgba(123,92,250,0.3)] text-white' : 'bg-secondary hover:bg-secondary/80 text-foreground'}`}>
                                    <Link href={plan.link}>{plan.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
