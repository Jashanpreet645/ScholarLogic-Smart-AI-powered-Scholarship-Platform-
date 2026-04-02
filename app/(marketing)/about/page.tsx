"use client";

import { motion } from "framer-motion";
import { Brain, Target, Flag, Rocket, ShieldCheck, Heart, Globe, Github } from "lucide-react";

export default function AboutUsPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggering = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-background pt-20 pb-32">
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-primary/[0.05] dark:bg-primary/[0.1] blur-[130px] rounded-full mix-blend-screen animate-blob" />
                <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/[0.05] dark:bg-emerald-500/[0.1] blur-[130px] rounded-full mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Seamless Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero section */}
                <motion.div 
                    {...fadeIn}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                        <Rocket className="w-3 h-3" /> Our Mission
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-8">
                        Democratizing <span className="text-gradient">Higher Education</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        ScholarLogic was built with a simple mission: to make the scholarship discovery and application process as friction-less, intelligent, and transparent as possible.
                    </p>
                </motion.div>

                {/* Grid of mission cards */}
                <motion.div 
                    variants={staggering}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
                >
                    <motion.div 
                        variants={fadeIn}
                        className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">The Problem</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Every year, billions of dollars in scholarship money go unclaimed simply because students couldn't find them. Traditional aggregators are filled with expired links and impossible criteria. Students waste hundreds of hours applying to opportunities they statistically have zero chance of winning.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={fadeIn}
                        className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-emerald-500/50 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">The Solution</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By leveraging advanced AI, ScholarLogic precisely correlates student demographic data with thousands of niche scholarships. By cutting through the noise, we ensure you only see what you uniquely qualify for—increasing match probability by over 300%.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Commitment Section */}
                <motion.div 
                    {...fadeIn}
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="relative p-12 rounded-[40px] bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 text-primary mb-4">
                                <ShieldCheck className="w-6 h-6" />
                                <span className="font-bold text-sm uppercase tracking-widest">Our Commitment</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">Your Privacy, Guaranteed.</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                We never sell your data to external marketers. Your profile is only used to compute your eligibility scores. We believe higher education should be accessible to anyone, and our technology exists to break down financial barriers.
                            </p>
                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="font-bold">Student First</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Flag className="w-5 h-5 text-primary" />
                                    <span className="font-bold">Mission Driven</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full aspect-square rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Brain className="w-24 h-24 text-primary relative animate-pulse" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Team Section with Minimalist Transition */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-32 relative"
                >
                    {/* Minimalist Glow Divider */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/40 to-transparent"></div>
                    
                    <div className="text-center mb-16 pt-12">
                        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 underline decoration-primary/30 underline-offset-8 decoration-4">The Brains Behind ScholarLogic</h2>
                        <p className="text-muted-foreground">Meet the visionaries building the future of educational access.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Jashanpreet Singh", role: "AI Architect & Lead Dev", color: "from-violet-500/20", githubUrl: "https://github.com/Jashanpreet645" },
                            { name: "Gursharen Kaur Suri", role: "UI/UX & Product Design", color: "from-blue-500/20", githubUrl: "https://github.com/" },
                            { name: "Gautam Garg", role: "Backend Systems Lead", color: "from-emerald-500/20", githubUrl: "https://github.com/" },
                            { name: "Sehaj Juneja", role: "Full Stack Developer", color: "from-amber-500/20", githubUrl: "https://github.com/" }
                        ].map((member, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
                            >
                                {/* Photo Container - Floating effect */}
                                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${member.color} to-transparent border border-white/5 mb-6 overflow-hidden relative group-hover:scale-[1.02] transition-all duration-500`}>
                                    <div className="absolute inset-0 flex items-center justify-center text-foreground/20 italic text-xs">
                                        Upload Photo Here
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                        <a 
                                            href={member.githubUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-300 backdrop-blur-md mb-2 border border-white/20 hover:scale-110"
                                            title="GitHub Profile"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium mb-4">{member.role}</p>
                                    
                                    <div className="h-[1px] w-12 bg-primary/20 mx-auto mb-4 group-hover:w-full transition-all duration-500" />
                                    
                                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">ScholarLogic Core Team</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
