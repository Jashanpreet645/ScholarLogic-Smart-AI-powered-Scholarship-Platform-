"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitOnboarding } from "./actions";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function SubmitButton({ currentStep }: { currentStep: number }) {
    const { pending } = useFormStatus();

    if (currentStep < 4) return null;

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving Profile..." : "Complete Profile"}
        </Button>
    );
}

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [state, formAction] = useActionState(submitOnboarding, null);

    const nextStep = () => setStep((s) => Math.min(4, s + 1));
    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <Card className="w-full max-w-2xl border-border bg-card/80 backdrop-blur-xl shadow-2xl relative z-10">
                <CardHeader className="text-center pb-8 border-b border-border/40">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Build Your Student Profile</CardTitle>
                    <CardDescription>
                        Step {step} of 4 &middot; We use this data to find your exact matches.
                    </CardDescription>

                    <div className="flex gap-2 mt-6 justify-center">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-16 rounded-full transition-colors ${i <= step ? "bg-primary shadow-[0_0_10px_rgba(123,92,250,0.5)]" : "bg-border"
                                    }`}
                            />
                        ))}
                    </div>
                </CardHeader>

                <form action={formAction}>
                    <CardContent className="pt-8 min-h-[300px]">
                        {/* Step 1: Personal info */}
                        <div className={step === 1 ? "block space-y-4" : "hidden"}>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" required placeholder="Priya Sharma" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" name="dateOfBirth" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender">
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Education */}
                        <div className={step === 2 ? "block space-y-4" : "hidden"}>
                            <div className="space-y-2">
                                <Label htmlFor="educationLevel">Current Level</Label>
                                <Select name="educationLevel" required>
                                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high_school">High School (10-12)</SelectItem>
                                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                                        <SelectItem value="phd">PhD / Research</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course">Course / Major</Label>
                                <Input id="course" name="course" placeholder="Computer Science, Medical, Commerce..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="yearOfStudy">Year of Study</Label>
                                    <Select name="yearOfStudy">
                                        <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year / Final</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gpa">GPA or Percentage</Label>
                                    <Input id="gpa" name="gpa" placeholder="e.g. 85%" />
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Demographics */}
                        <div className={step === 3 ? "block space-y-4" : "hidden"}>
                            <div className="space-y-2">
                                <Label htmlFor="state">State of Domicile</Label>
                                <Input id="state" name="state" placeholder="Maharashtra, Karnataka, etc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category">
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="obc">OBC</SelectItem>
                                        <SelectItem value="sc">SC</SelectItem>
                                        <SelectItem value="st">ST</SelectItem>
                                        <SelectItem value="ews">EWS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="firstGen" name="firstGen" value="on" />
                                    <Label htmlFor="firstGen" className="font-normal cursor-pointer text-muted-foreground">I am a first-generation college student.</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="disability" name="disability" value="on" />
                                    <Label htmlFor="disability" className="font-normal cursor-pointer text-muted-foreground">I have a recognized disability status.</Label>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Financial */}
                        <div className={step === 4 ? "block space-y-4" : "hidden"}>
                            <div className="space-y-2">
                                <Label htmlFor="incomeBracket">Annual Household Income</Label>
                                <Select name="incomeBracket" required>
                                    <SelectTrigger><SelectValue placeholder="Select bracket" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="below_1l">Below ₹1 Lakh</SelectItem>
                                        <SelectItem value="1l_to_2.5l">₹1 Lakh - ₹2.5 Lakhs</SelectItem>
                                        <SelectItem value="2.5l_to_5l">₹2.5 Lakhs - ₹5 Lakhs</SelectItem>
                                        <SelectItem value="5l_to_8l">₹5 Lakhs - ₹8 Lakhs</SelectItem>
                                        <SelectItem value="above_8l">Above ₹8 Lakhs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-4 p-4 rounded-lg bg-secondary/50 border border-border mt-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    <strong>Why we ask this:</strong> Financial details are the #1 highest-weighted factor for government and NGO scholarship eligibility. Your data is strictly encrypted.
                                </p>
                            </div>

                            {state?.message && (
                                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm font-medium space-y-1">
                                    <p>{state.message}</p>
                                    {state.errors && (
                                        <ul className="list-disc pl-5 text-xs opacity-80">
                                            {Object.entries(state.errors).map(([key, msgs]) => (
                                                <li key={key}>{(msgs as string[])[0]}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t border-border/40 pt-6">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <div></div> // Empty div for flex spacing
                        )}

                        {step < 4 ? (
                            <Button type="button" onClick={nextStep}>
                                Continue <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <SubmitButton currentStep={step} />
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
