"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  Server,
  Upload,
  Loader2,
} from "lucide-react";
import {
  processPipelineDocument,
  getPipelineJobs,
  getPipelineStats,
} from "@/lib/actions/extraction.actions";

interface PipelineJob {
  id: string;
  fileName: string;
  status: string;
  extractedCount: number | null;
  duration: string | null;
  error: string | null;
  scholarshipId: string | null;
  createdAt: Date;
}

interface PipelineStats {
  totalProcessed: number;
  completed: number;
  failed: number;
  successRate: number;
  scholarshipsInDb: number;
}

export default function AdminPipelinePage() {
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [jobData, statsData] = await Promise.all([
        getPipelineJobs(),
        getPipelineStats(),
      ]);
      setJobs(jobData as PipelineJob[]);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load pipeline data:", error);
    }
    setIsLoading(false);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await processPipelineDocument(formData);

      if (!data.success) {
        throw new Error(data.error || "Extraction failed");
      }

      // Reload data
      await loadData();

      alert(
        `Extracted ${(data.data as { eligibilityRules?: unknown[] })?.eligibilityRules?.length || 0} rules successfully!`
      );
    } catch (error: unknown) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to process document"
      );
      await loadData();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Admin Pipeline Monitor
          </h1>
          <p className="text-muted-foreground">
            Monitor the extraction of scholarship rules via Gemini 2.0 LLM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-[250px] cursor-pointer"
          />
          <Button disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Ingesting..." : "Ingest PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Processed
            </CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.totalProcessed ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">PDFs ingested</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scholarships in DB
            </CardTitle>
            <Server className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.scholarshipsInDb ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Active records</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed / Failed
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : `${stats?.completed ?? 0} / ${stats?.failed ?? 0}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Jobs breakdown
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${stats?.successRate ?? 100}%`}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Ingestion Jobs</CardTitle>
          <CardDescription>
            Live feed of document parsing via LLM extraction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              No pipeline jobs yet. Upload a PDF to start extracting scholarship
              rules.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-border">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Job ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Source File
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Extracted Rules
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border transition-colors hover:bg-secondary/20"
                    >
                      <td className="p-4 align-middle font-mono text-xs">
                        {job.id.slice(0, 8)}...
                      </td>
                      <td
                        className="p-4 align-middle max-w-[200px] truncate"
                        title={job.fileName}
                      >
                        {job.fileName}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {job.status === "completed" && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                          {job.status === "processing" && (
                            <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                          )}
                          {job.status === "failed" && (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          )}
                          <span
                            className={
                              job.status === "failed"
                                ? "text-destructive"
                                : job.status === "completed"
                                  ? "text-emerald-400"
                                  : "text-blue-400"
                            }
                          >
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </span>
                        </div>
                        {job.error && (
                          <p className="text-xs text-destructive mt-1">
                            {job.error}
                          </p>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        {job.extractedCount ?? "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {job.duration ?? "-"}
                      </td>
                      <td className="p-4 align-middle text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
