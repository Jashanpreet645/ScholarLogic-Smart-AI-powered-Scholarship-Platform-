"use client";

import { useState, useTransition } from "react";
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
import { BookmarkIcon, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { saveApplication } from "@/lib/actions/application.actions";
import { runMatchingEngine } from "@/lib/actions/match.actions";

interface MatchData {
  id: string;
  score: number;
  rationale: string;
  scholarship: {
    id: string;
    name: string;
    provider: string;
    amount: string;
    amountType: string | null;
    deadline: string | null;
    applicationUrl: string | null;
    requiredDocuments: string[];
  };
  applicationStatus: string | null;
}

export function MatchesClient({ matches }: { matches: MatchData[] }) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(
      matches
        .filter((m) => m.applicationStatus)
        .map((m) => m.scholarship.id)
    )
  );
  const [isRefreshing, startRefreshTransition] = useTransition();

  const handleSave = async (scholarshipId: string) => {
    setSavingId(scholarshipId);
    try {
      await saveApplication(scholarshipId);
      setSavedIds((prev) => new Set([...prev, scholarshipId]));
    } catch (error) {
      console.error("Failed to save:", error);
    }
    setSavingId(null);
  };

  const handleRefreshMatches = () => {
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
    if (score >= 90) return "#7B5CFA";
    if (score >= 70) return "#3b82f6";
    if (score >= 50) return "#60a5fa";
    return "#9CA3AF";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            My Matches
          </h1>
          <p className="text-muted-foreground">
            {matches.length > 0
              ? `We found ${matches.length} scholarships that match your profile.`
              : "No matches found yet. Add scholarships via the admin pipeline."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border"
            onClick={handleRefreshMatches}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Refresh Matches
          </Button>
        </div>
      </div>

      {matches.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center py-12">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your matches will appear here once scholarships are
              added to the database. Use the Admin Pipeline to upload
              scholarship PDFs.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <Card
            key={match.id}
            className="flex flex-col bg-card border-border hover:border-primary/40 transition-all overflow-hidden relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${
                  savedIds.has(match.scholarship.id)
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
                onClick={() => handleSave(match.scholarship.id)}
                disabled={
                  savingId === match.scholarship.id ||
                  savedIds.has(match.scholarship.id)
                }
              >
                {savingId === match.scholarship.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkIcon
                    className={`h-4 w-4 ${
                      savedIds.has(match.scholarship.id) ? "fill-primary" : ""
                    }`}
                  />
                )}
              </Button>
            </div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-foreground"
                  style={{
                    background: `conic-gradient(${getScoreColor(match.score)} ${match.score}%, #2A2840 0)`,
                  }}
                >
                  <div className="absolute inset-1 bg-card rounded-full flex items-center justify-center text-sm">
                    {match.score}%
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {match.scholarship.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1 text-sm">
                    {match.scholarship.provider}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-2 mb-4 flex-wrap">
                {match.scholarship.amountType && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary hover:bg-primary/20"
                  >
                    {match.scholarship.amountType}
                  </Badge>
                )}
                {match.scholarship.deadline && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-500/15 text-amber-400"
                  >
                    Due{" "}
                    {new Date(match.scholarship.deadline).toLocaleDateString(
                      "en-IN",
                      { month: "short", day: "numeric" }
                    )}
                  </Badge>
                )}
              </div>
              <div className="bg-secondary/30 p-3 rounded-md border border-border flex gap-2 items-start">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Why you matched:</strong>{" "}
                  {match.rationale}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-border bg-secondary/10 pt-4">
              <div>
                <div className="text-lg font-bold text-foreground">
                  {match.scholarship.amount}
                </div>
                {match.scholarship.deadline && (
                  <div className="text-xs text-muted-foreground">
                    Deadline:{" "}
                    {new Date(match.scholarship.deadline).toLocaleDateString(
                      "en-IN"
                    )}
                  </div>
                )}
              </div>
              {match.scholarship.applicationUrl ? (
                <a
                  href={match.scholarship.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(123,92,250,0.3)]">
                    Apply Now <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
              ) : (
                <Button
                  onClick={() => handleSave(match.scholarship.id)}
                  variant={
                    savedIds.has(match.scholarship.id)
                      ? "secondary"
                      : "default"
                  }
                  disabled={savedIds.has(match.scholarship.id)}
                >
                  {savedIds.has(match.scholarship.id) ? "Saved" : "Save"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
