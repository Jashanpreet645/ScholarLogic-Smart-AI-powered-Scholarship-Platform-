import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <SignUp
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "bg-card border border-border shadow-2xl",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-secondary text-foreground border-border hover:bg-secondary/80",
                    formFieldLabel: "text-foreground",
                    formFieldInput: "bg-input border-border text-foreground",
                    formButtonPrimary: "bg-primary hover:bg-primary-hover text-white",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary-hover",
                }
            }}
        />
    );
}
