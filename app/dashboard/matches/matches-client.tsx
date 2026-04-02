"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  Heart,
  Sparkles,
  ExternalLink,
  Loader2,
  Search,
  ArrowUpDown,
  Target,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertTriangle,
  RefreshCw,
  Shield,
  ShieldX,
  Sparkle,
  CreditCard,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toggleSaveApplication } from "@/lib/actions/application.actions";
import { runMatchingEngine, analyzeScholarship } from "@/lib/actions/match.actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScholarshipData {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  amount: string;
  amountType: string | null;
  deadline: string | null;
  applicationUrl: string | null;
  requiredDocuments: string[];
  deterministicScore: number;
  failedRules: string[];
  aiScore: number | null;
  aiRationale: string | null;
  aiMatchedRules: unknown[] | null;
  applicationStatus: string | null;
}

type SortOption = "score" | "deadline" | "amount" | "name";

export function MatchesClient({
  eligible,
  notEligible,
  hasProfile,
}: {
  eligible: ScholarshipData[];
  notEligible: ScholarshipData[];
  hasProfile: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"eligible" | "not-eligible">("eligible");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set([
      ...eligible.filter((s) => s.applicationStatus).map((s) => s.id),
      ...notEligible.filter((s) => s.applicationStatus).map((s) => s.id),
    ])
  );

  // On-demand AI analysis state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, { score: number; rationale: string; matchedRules: { rule: string; met: boolean; reason: string }[] }>>(
    // Pre-fill with existing AI results
    Object.fromEntries(
      [...eligible, ...notEligible]
        .filter((s) => s.aiRationale !== null && !s.aiRationale.includes("PENDING_NEURAL_ANALYSIS") && !s.aiRationale.includes("matching temporarily unavailable"))
        .map((s) => [s.id, { score: s.aiScore!, rationale: s.aiRationale!, matchedRules: (s.aiMatchedRules || []) as { rule: string; met: boolean; reason: string }[] }])
    )
  );
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Refresh matches
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);

  const handleSave = async (scholarshipId: string) => {
    setSavingId(scholarshipId);
    try {
      const result = await toggleSaveApplication(scholarshipId);
      if (result.saved) {
        setSavedIds((prev) => new Set([...prev, scholarshipId]));
      } else {
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(scholarshipId);
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
    setSavingId(null);
  };

  const handleViewDetails = (scholarship: ScholarshipData) => {
    setSelectedScholarship(scholarship);
    setIsSheetOpen(true);
  };

  const handleTriggerAnalysis = async (scholarshipId: string) => {
    setAnalyzingId(scholarshipId);
    try {
      const result = await analyzeScholarship(scholarshipId);
      setAiResults((prev) => ({
        ...prev,
        [scholarshipId]: {
          score: result.score,
          rationale: result.rationale,
          matchedRules: result.matchedRules as { rule: string; met: boolean; reason: string }[],
        },
      }));
    } catch (error) {
      console.error("Failed to analyze:", error);
    }
    setAnalyzingId(null);
  };

  const handleRefreshMatches = () => {
    setShowRefreshConfirm(false);
    startRefreshTransition(async () => {
      try {
        await runMatchingEngine();
        window.location.reload();
      } catch (error) {
        console.error("Failed to refresh matches:", error);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981"; // Emerald Green for high matches
    if (score >= 70) return "#3b82f6"; // Blue
    if (score >= 50) return "#f59e0b"; // Amber
    if (score >= 30) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Low";
  };

  const getDeadlineUrgency = (deadline: string | null) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: "Expired", color: "text-red-400 bg-red-400/10" };
    if (days <= 7) return { label: `${days}d left`, color: "text-red-400 bg-red-400/10" };
    if (days <= 30) return { label: `${days}d left`, color: "text-amber-400 bg-amber-400/10" };
    return { label: `${days}d left`, color: "text-emerald-400 bg-emerald-400/10" };
  };

  // Filter and sort
  const filterScholarships = (list: ScholarshipData[]) => {
    let filtered = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.aiScore ?? b.deterministicScore) - (a.aiScore ?? a.deterministicScore);
        case "deadline": {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        case "amount": {
          const extractNum = (s: string) => {
            const match = s.replace(/,/g, "").match(/[\d.]+/);
            return match ? parseFloat(match[0]) : 0;
          };
          return extractNum(b.amount) - extractNum(a.amount);
        }
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

    const currentList = activeTab === "eligible" ? filterScholarships(eligible) : filterScholarships(notEligible);

    const currentAiResult = selectedScholarship ? (aiResults[selectedScholarship.id] || (selectedScholarship.aiRationale && !selectedScholarship.aiRationale.includes("PENDING_NEURAL_ANALYSIS") && !selectedScholarship.aiRationale.includes("matching temporarily unavailable") ? {
        score: selectedScholarship.aiScore!,
        rationale: selectedScholarship.aiRationale!,
        matchedRules: (selectedScholarship.aiMatchedRules || []) as { rule: string; met: boolean; reason: string }[]
    } : null)) : null;

    return (
        <div className="flex flex-col gap-6 w-full">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-[700px] border-l border-white/10 glass-card bg-zinc-950/90 p-0 overflow-y-auto">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-600 via-primary to-blue-600 z-50 shadow-[0_0_30px_rgba(123,92,250,0.6)]" />

                    {selectedScholarship && (
                        <div className="flex flex-col gap-10 py-12 px-8 sm:px-12 relative min-h-screen">
                            {/* Animated Background Mesh */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(123,92,250,0.1),transparent_50%)] -z-10 pointer-events-none" />
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                    <SheetHeader className="text-left space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="px-4 py-1.5 bg-primary/15 border border-primary/25 rounded-full flex items-center gap-2.5 backdrop-blur-sm">
                                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-primary">Neural Insights</span>
                                            </div>
                                        </div>
                                        <SheetTitle className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-primary dark:from-white dark:via-white/90 dark:to-primary/40 leading-[1.05] drop-shadow-2xl">
                                            {selectedScholarship.name}
                                        </SheetTitle>
                                        
                                        {/* Cinematic Quick Stats Row */}
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md transition-all hover:bg-white/[0.06]">
                                                <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                                    <CreditCard className="w-4 h-4 text-violet-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 dark:text-zinc-500">Amount</div>
                                                    <div className="text-sm font-bold text-zinc-900 dark:text-white">{selectedScholarship.amount}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md transition-all hover:bg-white/[0.06]">
                                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 dark:text-zinc-500">Deadline</div>
                                                    <div className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">
                                                        {selectedScholarship.deadline ? new Date(selectedScholarship.deadline).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }) : "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md transition-all hover:bg-white/[0.06]">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 dark:text-zinc-500">Region</div>
                                                    <div className="text-sm font-bold text-zinc-900 dark:text-white">National</div>
                                                </div>
                                            </div>
                                        </div>

                                         <SheetDescription className="text-xl font-semibold text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-white/5">
                                             {selectedScholarship.provider}
                                         </SheetDescription>
                                    </SheetHeader>
                            </motion.div>

                             {/* Holographic Marks Core */}
                             <motion.div 
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: 0.2, duration: 0.6 }}
                                 className="relative group"
                             >
                                 <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-violet-500/30 rounded-[3rem] blur-2xl opacity-20" />
                                 <div className="relative flex items-center gap-10 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                     
                                     <div className="relative shrink-0">
                                         {currentAiResult ? (
                                             <>
                                                <motion.div 
                                                    animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
                                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    className="w-24 h-24 rounded-full flex items-center justify-center p-1.5 bg-zinc-900 border border-white/10 shadow-[0_0_40px_rgba(123,92,250,0.3)] relative z-10"
                                                >
                                                    <div
                                                        className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                                                        style={{
                                                            background: `conic-gradient(#10b981 ${currentAiResult.score}%, transparent 0)`,
                                                        }}
                                                    >
                                                        <div className="absolute inset-[8px] bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center">
                                                            <span className="text-3xl font-black text-zinc-900 dark:text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                                {currentAiResult.score}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                                <div className="absolute -inset-6 bg-emerald-500/10 blur-3xl rounded-full z-0 animate-pulse" />
                                             </>
                                         ) : (
                                             <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/[0.02]">
                                                 <Brain className="w-10 h-10 text-white/10" />
                                             </div>
                                         )}
                                     </div>
 
                                     <div className="flex-1 space-y-1">
                                         <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Match Marks</h4>
                                         <p className="text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic pr-4">
                                             {currentAiResult ? (
                                                 `"${currentAiResult.score >= 90 ? "A prestigious opportunity tailored for you." : 
                                                   currentAiResult.score >= 70 ? "Strong alignment found in your profile." : 
                                                   "Meets baseline; selective entry expected."}"`
                                             ) : (
                                                 "Analysis pending. Run Neural AI for a personalized match score."
                                             )}
                                         </p>
                                     </div>
                                 </div>
                             </motion.div>
 
                             {/* Rationale Section */}
                             <motion.div 
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: 0.4, duration: 0.6 }}
                                 className="space-y-4"
                             >
                                 <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3 text-sm font-black text-zinc-600 dark:text-white tracking-widest uppercase opacity-80">
                                         <div className="w-1 h-4 bg-primary rounded-full" /> AI Consultancy Rationale
                                     </div>
                                 </div>
                                 <div className="group relative">
                                     {currentAiResult ? (
                                         <>
                                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-violet-500/10 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                            <div className="relative text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-200 font-medium bg-white/[0.02] p-10 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl backdrop-blur-3xl transition-transform duration-500 group-hover:scale-[1.01]">
                                                <Brain className="w-10 h-10 text-primary/40 absolute top-6 right-8" />
                                                {currentAiResult.rationale}
                                            </div>
                                         </>
                                     ) : (
                                         <div className="relative p-12 rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
                                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,92,250,0.05),transparent_70%)]" />
                                             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                                                 <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                             </div>
                                             <div className="space-y-2 relative z-10">
                                                 <h5 className="text-xl font-bold text-zinc-900 dark:text-white">Neural Analysis Required</h5>
                                                 <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                                                     Unlock deep insights and personal eligibility matches with our Gemini-powered engine.
                                                 </p>
                                             </div>
                                             <Button 
                                                 onClick={() => handleTriggerAnalysis(selectedScholarship.id)}
                                                 disabled={analyzingId === selectedScholarship.id}
                                                 className="relative z-10 h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(123,92,250,0.3)] shadow-primary/20 disabled:opacity-50"
                                             >
                                                 {analyzingId === selectedScholarship.id ? (
                                                     <>
                                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                        Analyzing Profile...
                                                     </>
                                                 ) : (
                                                     <>
                                                        <Brain className="w-5 h-5 mr-3" />
                                                        Analyze with AI
                                                     </>
                                                 )}
                                             </Button>
                                         </div>
                                     )}
                                 </div>
                             </motion.div>
 
                             {/* Detailed Analysis */}
                             <motion.div 
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: 0.6, duration: 0.6 }}
                                 className="space-y-4 pb-10"
                             >
                                 <div className="flex items-center gap-3 text-sm font-black text-zinc-600 dark:text-white tracking-widest uppercase opacity-80 mb-6">
                                     <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" /> Detailed Eligibility Verification
                                 </div>
                                 <div className="grid gap-5">
                                     {currentAiResult ? (
                                         currentAiResult.matchedRules.map((rule, i) => (
                                            <div key={i} className={cn(
                                                "group p-6 rounded-[2rem] border transition-all duration-700 relative overflow-hidden backdrop-blur-sm",
                                                rule.met 
                                                    ? "bg-emerald-500/[0.02] border-emerald-500/15 hover:border-emerald-500/30" 
                                                    : "bg-red-500/[0.02] border-red-500/15 hover:border-red-500/30"
                                            )}>
                                                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 dark:opacity-[0.03] transition-opacity duration-700 pointer-events-none">
                                                    {rule.met ? <CheckCircle2 className="w-full h-full text-emerald-500" /> : <XCircle className="w-full h-full text-red-500" />}
                                                </div>
                                                <div className="flex items-center gap-6 relative z-10">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110",
                                                        rule.met ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    )}>
                                                        {rule.met ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[16px] font-black text-zinc-900 dark:text-white mb-1.5 tracking-tight">{rule.rule}</div>
                                                        <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                                            {rule.reason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                         ))
                                     ) : (
                                         <div className="p-8 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.01] text-center">
                                             <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
                                                 Checklist will be generated upon analysis.
                                             </p>
                                         </div>
                                     )}
                                 </div>
                             </motion.div>

                             {/* High-Impact Footer CTA (Moved to Flow) */}
                             <div className="mt-12 mb-20 group/cta relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur-2xl opacity-10 group-hover/cta:opacity-30 transition-opacity duration-500" />
                                {selectedScholarship.applicationUrl ? (
                                    <a href={selectedScholarship.applicationUrl} target="_blank" rel="noopener noreferrer" className="block relative z-10">
                                        <Button className="w-full h-16 rounded-[1.8rem] text-xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl border border-white/10 transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] overflow-hidden group/btn">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                Launch Application Portal <ExternalLink className="w-6 h-6 animate-bounce-x" />
                                            </span>
                                        </Button>
                                    </a>
                                ) : (
                                    <Button 
                                        onClick={() => handleSave(selectedScholarship.id)}
                                        className="w-full h-16 rounded-[1.8rem] text-xl font-black bg-zinc-900 border border-white/10 text-white transition-all hover:bg-zinc-800 relative z-10"
                                    >
                                        <Heart className={cn("w-6 h-6 mr-3", savedIds.has(selectedScholarship.id) && "fill-red-500 stroke-red-500")} />
                                        {savedIds.has(selectedScholarship.id) ? "Scholarship Saved" : "Save for Later"}
                                    </Button>
                                )}
                             </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
      {/* ── Header with Stats ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">
            Scholarship Matches
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {hasProfile
              ? "Scholarships matched against your profile using our deterministic eligibility engine. Click \"Analyze with AI\" for detailed insights."
              : "Complete your profile to see personalized scholarship matches."}
          </p>

          {/* Stats Row */}
          {/* Premium Stats Grid */}
          <div className="relative mt-8">
             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
                {/* Eligible Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card glass-card-hover p-5 lg:p-6 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-emerald-500/5">
                            <Shield className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none drop-shadow-sm">
                                {eligible.length}
                            </div>
                            <div className="text-[10px] lg:text-[11px] uppercase font-black tracking-[0.2em] text-emerald-500/80 antialiased">
                                Eligible
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Not Eligible Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card glass-card-hover p-5 lg:p-6 group relative overflow-hidden border-red-500/5 hover:border-red-500/20"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-red-500/20 transition-colors duration-700" />
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-red-500/5">
                            <ShieldX className="w-7 h-7 text-red-400" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none drop-shadow-sm">
                                {notEligible.length}
                            </div>
                            <div className="text-[10px] lg:text-[11px] uppercase font-black tracking-[0.2em] text-red-500/80 antialiased">
                                Not Eligible
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Saved Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card glass-card-hover p-5 lg:p-6 group relative overflow-hidden border-primary/5 hover:border-primary/20"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary/5">
                            <Heart className={cn("w-7 h-7 text-primary", savedIds.size > 0 && "fill-primary")} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none drop-shadow-sm">
                                {savedIds.size}
                            </div>
                            <div className="text-[10px] lg:text-[11px] uppercase font-black tracking-[0.2em] text-primary antialiased">
                                Saved
                            </div>
                        </div>
                    </div>
                </motion.div>
             </div>

            {/* Floating Refresh Actions */}
             <div className="absolute top-0 right-0 -translate-y-[120%] flex items-center">
                {showRefreshConfirm ? (
                    <div className="flex items-center gap-3 bg-zinc-950/80 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl px-5 py-3 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-300">
                        <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-emerald-100/90 tracking-wide">Update matches based on profile?</span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                className="h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all"
                                onClick={handleRefreshMatches}
                                disabled={isRefreshing}
                            >
                                {isRefreshing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                Refresh Now
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-4 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-bold text-[11px]"
                                onClick={() => setShowRefreshConfirm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            className="bg-card/40 backdrop-blur-md border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all rounded-full px-6 h-11"
                            onClick={() => setShowRefreshConfirm(true)}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                            )}
                            <span className="font-bold text-[13px] tracking-tight text-zinc-900 dark:text-zinc-100">Refresh Matches</span>
                        </Button>
                    </motion.div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* ── Tabs + Search/Sort ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Tabs */}
        <div className="flex bg-card/60 border border-border/50 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("eligible")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "eligible"
                ? "bg-primary text-white shadow-[0_0_20px_rgba(123,92,250,0.3)]"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Eligible ({eligible.length})
          </button>
          <button
            onClick={() => setActiveTab("not-eligible")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "not-eligible"
                ? "bg-red-500/80 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <XCircle className="w-4 h-4" />
            Not Eligible ({notEligible.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-card/60 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="score">Match Score</option>
            <option value="deadline">Deadline (Soonest)</option>
            <option value="amount">Amount (Highest)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ── Scholarship Grid ─────────────────────────── */}
      {currentList.length === 0 ? (
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6 text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {activeTab === "eligible" ? (
                <Target className="w-8 h-8 text-primary opacity-50" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 opacity-50" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery
                ? "No results found"
                : activeTab === "eligible"
                ? "No Eligible Scholarships"
                : "No Ineligible Scholarships"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              {searchQuery
                ? `No scholarships match "${searchQuery}". Try a different search.`
                : activeTab === "eligible"
                ? "Upload scholarships via the Admin Pipeline to see matches here."
                : "Great news! You're eligible for all available scholarships."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {currentList.map((scholarship) => {
            const displayScore = aiResults[scholarship.id]?.score ?? scholarship.aiScore ?? scholarship.deterministicScore;
            const hasAiResult = !!aiResults[scholarship.id] || (scholarship.aiRationale !== null && !scholarship.aiRationale.includes("PENDING_NEURAL_ANALYSIS"));
            const isAnalyzing = analyzingId === scholarship.id;
            const urgency = getDeadlineUrgency(scholarship.deadline);
            const isNotEligible = activeTab === "not-eligible";

            return (
              <Card
                key={scholarship.id}
                className={cn(
                  "flex flex-col overflow-hidden transition-all duration-500 group relative backdrop-blur-xl",
                  isNotEligible
                    ? "bg-red-500/5 border-red-500/10 hover:border-red-500/30"
                    : "bg-white/40 dark:bg-black/40 border border-white/10 dark:border-white/5 hover:border-primary/40 hover:shadow-[0_0_50px_rgba(123,92,250,0.15)]"
                )}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary blur-[100px] rounded-full" />
                </div>

                {/* Heart Toggle */}
                <div className="absolute top-4 right-4 z-10">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                        "rounded-full h-9 w-9 flex items-center justify-center transition-all duration-300",
                        savedIds.has(scholarship.id)
                          ? "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : "bg-black/10 dark:bg-white/10 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleSave(scholarship.id)}
                    disabled={savingId === scholarship.id}
                  >
                    {savingId === scholarship.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={savedIds.has(scholarship.id) ? "saved" : "unsaved"}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Heart
                                    className={cn(
                                        "h-5 w-5",
                                        savedIds.has(scholarship.id) ? "fill-red-500 stroke-red-500" : "stroke-current fill-none"
                                    )}
                                />
                            </motion.div>
                        </AnimatePresence>
                    )}
                  </motion.button>
                </div>

                <CardHeader className="pb-3 pt-6">
                  <div className="flex items-start gap-4">
                    {/* Holographic Score Ring */}
                    <div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                      style={{
                        background: isNotEligible
                          ? "conic-gradient(#ef4444 0%, #2A2840 0)"
                          : `conic-gradient(${getScoreColor(displayScore)} ${displayScore}%, rgba(123,92,250,0.1) 0)`,
                      }}
                    >
                      <div className="absolute inset-[4px] bg-card/60 backdrop-blur-md rounded-full flex items-center justify-center">
                        <span
                          className="text-sm font-black tracking-tight"
                          style={{ color: isNotEligible ? "#ef4444" : getScoreColor(displayScore) }}
                        >
                          {isNotEligible ? "N/A" : `${displayScore}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                      <CardTitle className="text-lg font-bold leading-[1.2] tracking-tight line-clamp-2 dark:text-white">
                        {scholarship.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground mt-1 text-sm font-medium">
                        {scholarship.provider}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pt-0">
                  {/* Badges */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {scholarship.amountType && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium px-2 py-0.5"
                      >
                        {scholarship.amountType}
                      </Badge>
                    )}
                    {urgency && (
                      <Badge
                        variant="secondary"
                        className={`${urgency.color} border-current/20 text-[10px] font-medium px-2 py-0.5`}
                      >
                        {urgency.label}
                      </Badge>
                    )}
                    {!isNotEligible && displayScore >= 70 && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-medium px-2 py-0.5"
                      >
                        {getScoreLabel(displayScore)}
                      </Badge>
                    )}
                  </div>

                  {/* Not Eligible: Show failed rules */}
                  {isNotEligible && scholarship.failedRules.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-400">Why not eligible</span>
                      </div>
                      <ul className="space-y-1">
                        {scholarship.failedRules.map((rule, i) => (
                          <li key={i} className="text-xs text-red-300/70 flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Unified AI Analysis Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "w-full mb-4 h-11 rounded-xl border-primary/20 text-primary transition-all duration-300 font-bold text-[13px] tracking-tight relative overflow-hidden group/ai-btn",
                        hasAiResult 
                            ? "bg-primary/5 hover:bg-primary/10 border-primary/30" 
                            : "bg-transparent hover:bg-primary/5"
                    )}
                    onClick={() => handleViewDetails(scholarship)}
                    disabled={isAnalyzing}
                  >
                    {/* Pulsing Back Glow while analyzing */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    )}
                    
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : hasAiResult ? (
                            <>
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                <span>Review AI Report</span>
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4" />
                                <span>Analyze with AI</span>
                            </>
                        )}
                    </div>
                  </Button>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex justify-between items-center border-t border-border/50 bg-foreground/[0.02] pt-4">
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {scholarship.amount}
                    </div>
                    {scholarship.deadline && (
                      <div className="text-[10px] text-muted-foreground">
                        Deadline:{" "}
                        {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }) : "No deadline"}
                      </div>
                    )}
                  </div>
                  {scholarship.applicationUrl ? (
                    <a
                      href={scholarship.applicationUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(123,92,250,0.25)] hover:shadow-[0_0_25px_rgba(123,92,250,0.4)] transition-all text-xs h-9"
                      >
                        Apply Now <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleSave(scholarship.id)}
                      variant={savedIds.has(scholarship.id) ? "secondary" : "default"}
                      disabled={savedIds.has(scholarship.id)}
                      className="text-xs h-9"
                    >
                      {savedIds.has(scholarship.id) ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1.5" /> Saved
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
