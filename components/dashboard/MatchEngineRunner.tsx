"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { runMatchingEngine } from "@/lib/actions/match.actions";
import { useRouter } from "next/navigation";

export function MatchEngineRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function runEngine() {
      if (hasRun || isRunning) return;
      setIsRunning(true);
      try {
        await runMatchingEngine();
        if (mounted) {
          setHasRun(true);
          router.refresh();
        }
      } catch (error) {
        console.error("Match engine failed", error);
        if (mounted) {
          setHasRun(true);
        }
      } finally {
        if (mounted) setIsRunning(false);
      }
    }

    runEngine();

    return () => {
      mounted = false;
    };
  }, [hasRun, isRunning, router]);

  if (isRunning || !hasRun) {
    return (
      <Card className="bg-card border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <CardContent className="pt-8 pb-8 text-center relative z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">🤖 AI is analyzing scholarships...</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while our matching engine finds the best opportunities based on your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 text-center">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-semibold mb-1">No Matches Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Scholarships need to be added to the database first, or you may not match current ones. Ask an admin
          to upload scholarship PDFs via the Pipeline Monitor.
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin">Go to Admin Pipeline</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
