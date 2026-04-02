"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Send, Phone, Globe } from "lucide-react";

export default function ContactPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-background pt-20 pb-32">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse decoration-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div 
                    {...fadeIn}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6">
                        Get in <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions about our AI matching engine? Our team is standing by to help you unlock your educational future.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">Email Support</h3>
                                    <p className="text-muted-foreground text-sm mb-2">Typically responds within 2 hours</p>
                                    <span className="text-primary font-medium">help@scholarlogic.com</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-3xl bg-card border border-border/50 hover:border-violet-500/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">AI Assistant</h3>
                                    <p className="text-muted-foreground text-sm mb-2">24/7 automated support</p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-500 uppercase tracking-wider">
                                        <span className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                                        Dashboard Exclusive
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-3xl bg-card border border-border/50 hover:border-emerald-500/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-1">Office</h3>
                                    <p className="text-muted-foreground text-sm mb-2">Our office</p>
                                    <span className="text-emerald-500 font-medium text-xs">Thapar Institute of Engineering and Technology, Patiala, Punjab, India</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links Section */}
                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.4 }}
                            className="pt-4"
                        >
                            <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-[0.2em] mb-4 ml-2">Connect Digitally</h4>
                            <div className="flex gap-4">
                                {[
                                    { icon: <Globe className="w-5 h-5" />, label: "LinkedIn", color: "hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/20" },
                                    { icon: <MessageSquare className="w-5 h-5" />, label: "Twitter", color: "hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500/20" },
                                    { icon: <Send className="w-5 h-5" />, label: "GitHub", color: "hover:bg-slate-800/10 hover:text-slate-900 dark:hover:text-white hover:border-slate-800/20" }
                                ].map((social, i) => (
                                    <button 
                                        key={i}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-300",
                                            social.color
                                        )}
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-8 p-1 rounded-[32px] bg-gradient-to-br from-primary/20 via-border/50 to-violet-500/20 shadow-2xl"
                    >
                        <div className="p-8 md:p-12 rounded-[30px] bg-card/80 backdrop-blur-xl h-full">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/80 ml-1 uppercase tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/80 ml-1 uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/80 ml-1 uppercase tracking-wider">Subject</label>
                                    <select className="w-full h-14 px-6 rounded-2xl bg-background/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                                        <option>Partnership Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Billing Question</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/80 ml-1 uppercase tracking-wider">Message</label>
                                    <textarea 
                                        rows={4} 
                                        placeholder="How can we help you today?" 
                                        className="w-full p-6 rounded-2xl bg-background/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>
                                <button type="button" className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Send Neural Message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section with Minimalist Transition */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-32 relative"
                >
                    {/* Minimalist Glow Divider */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent"></div>
                    
                    <div className="text-center mb-16 pt-12">
                        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">Common Questions</h2>
                        <p className="text-muted-foreground">Quick answers to frequently asked questions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { q: "How does AI matching work?", a: "Our engine uses neural networks to correlate your unique student profile with thousands of niche criteria, ensuring 99.9% eligibility accuracy." },
                            { q: "Is my data secure?", a: "Absolutely. We use bank-grade encryption and never sell your personal identification to third-party marketers." },
                            { q: "How do I list a scholarship?", a: "If you're an organization, simply contact our partnership team via the form above to join our database." }
                        ].map((faq, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-card/40 border border-border/50 hover:bg-card transition-colors duration-500">
                                <h3 className="font-bold text-lg text-foreground mb-4">{faq.q}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// In HeaderControls.tsx and other places you might use 'cn', make sure to import it correctly.
// Since this is a simple component and might be used in multiple places, we'll assume 'cn' is globally available or imported if needed.
// However, since we are using 'cn' in social color logic, we'll import it here too.
import { cn } from "@/lib/utils";
