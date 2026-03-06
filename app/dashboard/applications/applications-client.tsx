"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Send,
  Award,
  Trash2,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/actions/application.actions";

interface ApplicationData {
  id: string;
  status: string;
  notes: string | null;
  savedAt: string;
  appliedAt: string | null;
  wonAt: string | null;
  scholarship: {
    id: string;
    name: string;
    provider: string;
    amount: string;
    deadline: string | null;
  };
}

const statusConfig: Record<
  string,
  { label: string; color: string; borderColor: string }
> = {
  SAVED: {
    label: "Saved",
    color: "text-blue-400",
    borderColor: "border-blue-400/20",
  },
  APPLIED: {
    label: "Applied",
    color: "text-primary",
    borderColor: "border-primary/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-amber-400",
    borderColor: "border-amber-400/20",
  },
  WON: {
    label: "Won",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/20",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-destructive",
    borderColor: "border-destructive/20",
  },
};

export function ApplicationsClient({
  applications: initialApps,
  stats,
}: {
  applications: ApplicationData[];
  stats: { inProgress: number; submitted: number; won: number };
}) {
  const [applications, setApplications] = useState(initialApps);
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);

  const handleStatusChange = (
    appId: string,
    newStatus: "SAVED" | "APPLIED" | "UNDER_REVIEW" | "WON" | "REJECTED"
  ) => {
    setActionId(appId);
    startTransition(async () => {
      try {
        await updateApplicationStatus(appId, newStatus);
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      } catch (error) {
        console.error("Failed to update:", error);
      }
      setActionId(null);
    });
  };

  const handleDelete = (appId: string) => {
    setActionId(appId);
    startTransition(async () => {
      try {
        await deleteApplication(appId);
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      } catch (error) {
        console.error("Failed to delete:", error);
      }
      setActionId(null);
    });
  };

  const getNextStatus = (
    current: string
  ): "APPLIED" | "UNDER_REVIEW" | null => {
    if (current === "SAVED") return "APPLIED";
    if (current === "APPLIED") return "UNDER_REVIEW";
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track the status of your scholarship applications and upcoming
          deadlines.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-2">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Send className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won</CardTitle>
            <Award className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.won}</div>
            <p className="text-xs text-muted-foreground">Scholarships awarded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
          <CardDescription>
            Manage and track your scholarship applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">No applications yet.</p>
              <p className="text-sm">
                Save scholarships from your matches to start tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const config = statusConfig[app.status] || statusConfig.SAVED;
                const nextStatus = getNextStatus(app.status);

                return (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row justify-between p-4 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {app.scholarship.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${config.color} ${config.borderColor}`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {app.scholarship.provider} &middot;{" "}
                        {app.scholarship.amount}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {app.scholarship.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Due:{" "}
                            {new Date(
                              app.scholarship.deadline
                            ).toLocaleDateString("en-IN")}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          Saved:{" "}
                          {new Date(app.savedAt).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(app.id, nextStatus)}
                          disabled={isPending && actionId === app.id}
                        >
                          {isPending && actionId === app.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              Mark {statusConfig[nextStatus]?.label}
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(app.id)}
                        disabled={isPending && actionId === app.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
