import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, GraduationCap, Award, Sparkles, ArrowRight } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { runMatchingEngine } from "@/lib/actions/match.actions";

export default async function DashboardOverview() {
  const user = await currentUser();
  const { userId } = await auth();
  const firstName = user?.firstName || "Scholar";

  // Get real stats from DB
  const [
    profile,
    matchCount,
    savedCount,
    reviewCount,
    wonCount,
    topMatches,
  ] = await Promise.all([
    userId
      ? prisma.studentProfile.findUnique({ where: { clerkId: userId } })
      : null,
    userId
      ? prisma.matchScore.count({
          where: { clerkId: userId, score: { gt: 0 } },
        })
      : 0,
    userId
      ? prisma.application.count({
          where: { clerkId: userId, status: "SAVED" },
        })
      : 0,
    userId
      ? prisma.application.count({
          where: { clerkId: userId, status: "UNDER_REVIEW" },
        })
      : 0,
    userId
      ? prisma.application.count({
          where: { clerkId: userId, status: "WON" },
        })
      : 0,
    userId
      ? prisma.matchScore.findMany({
          where: { clerkId: userId, score: { gt: 0 } },
          include: { scholarship: true },
          orderBy: { score: "desc" },
          take: 3,
        })
      : [],
  ]);

  const profileComplete = !!profile;

  // If profile exists but no matches, try running the matching engine
  if (profileComplete && matchCount === 0) {
    try {
      await runMatchingEngine();
    } catch {
      // Silently ignore - matches will be computed on next page load
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome Back, {firstName}
        </h1>
        <p className="text-muted-foreground">
          {profileComplete
            ? `Your profile is complete. You have ${matchCount} scholarship matches.`
            : "Complete your profile to start matching with scholarships."}
        </p>
      </div>

      {!profileComplete && (
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill out your student profile to get AI-matched scholarships.
                </p>
              </div>
              <Button asChild>
                <Link href="/onboarding">
                  Build Profile <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Matches
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchCount}</div>
            <p className="text-xs text-muted-foreground">
              AI-matched scholarships
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Applications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedCount}</div>
            <p className="text-xs text-muted-foreground">Bookmarked to apply</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scholarships Won
            </CardTitle>
            <Award className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonCount}</div>
            <p className="text-xs text-muted-foreground">Congratulations!</p>
          </CardContent>
        </Card>
      </div>

      {topMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Top Recommended For You
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topMatches.map((match) => (
              <Link href="/dashboard/matches" key={match.id}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer bg-card overflow-hidden">
                  <div
                    className="h-2"
                    style={{
                      backgroundColor:
                        match.score >= 90
                          ? "#7B5CFA"
                          : match.score >= 70
                            ? "#3b82f6"
                            : "#60a5fa",
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor:
                            match.score >= 90
                              ? "rgba(123,92,250,0.2)"
                              : "rgba(59,130,246,0.2)",
                          color:
                            match.score >= 90 ? "#7B5CFA" : "#60a5fa",
                        }}
                      >
                        {match.score}% Match
                      </div>
                      {match.scholarship.deadline && (
                        <span className="text-xs text-muted-foreground">
                          Deadline:{" "}
                          {new Date(
                            match.scholarship.deadline
                          ).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-lg">
                      {match.scholarship.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {match.scholarship.provider}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {match.scholarship.amount}
                    </div>
                    {match.scholarship.amountType && (
                      <div className="text-xs font-mono text-primary bg-primary/10 inline-block px-2 py-1 rounded">
                        {match.scholarship.amountType}
                      </div>
                    )}
                    <div className="mt-3 flex items-start gap-2 bg-secondary/30 p-2 rounded border border-border">
                      <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {match.rationale}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {topMatches.length === 0 && profileComplete && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No Matches Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Scholarships need to be added to the database first. Ask an admin
              to upload scholarship PDFs via the Pipeline Monitor.
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin">Go to Admin Pipeline</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

