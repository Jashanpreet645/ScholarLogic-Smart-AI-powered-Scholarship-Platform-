"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Copy,
  FileText,
  Download,
  Loader2,
  Trash2,
  Clock,
} from "lucide-react";
import { getUserMatches } from "@/lib/actions/match.actions";
import {
  saveSopDraft,
  getSopDrafts,
  deleteSopDraft,
} from "@/lib/actions/sop.actions";

interface MatchOption {
  id: string;
  label: string;
  scholarshipName: string;
  score: number;
}

interface Draft {
  id: string;
  scholarshipName: string;
  content: string;
  instructions: string | null;
  createdAt: Date;
}

export default function SOPGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSOP, setGeneratedSOP] = useState<string | null>(null);
  const [scholarships, setScholarships] = useState<MatchOption[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [matches, existingDrafts] = await Promise.all([
        getUserMatches(),
        getSopDrafts(),
      ]);
      setScholarships(
        (matches as { id: string; scholarship: { name: string }; score: number }[]).map((m) => ({
          id: m.id,
          label: `${m.scholarship.name} (${m.score}% Match)`,
          scholarshipName: m.scholarship.name,
          score: m.score,
        }))
      );
      setDrafts(existingDrafts as Draft[]);
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    setLoadingDrafts(false);
  }

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSOP(null);

    const formData = new FormData(e.currentTarget);
    const scholarshipVal = formData.get("scholarship") as string;
    const instructions = formData.get("instructions") as string;
    const match = scholarships.find((s) => s.id === scholarshipVal);

    const data = {
      scholarshipName: match?.scholarshipName || scholarshipVal,
      scholarshipDetails: `Scholarship match score: ${match?.score || "N/A"}%. Generate a personalized SOP.`,
      promptParams: instructions,
    };

    try {
      const res = await fetch("/api/generate-sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.text) {
        setGeneratedSOP(result.text);
        // Refresh drafts since the API saves the draft
        const updatedDrafts = await getSopDrafts();
        setDrafts(updatedDrafts as Draft[]);
      } else {
        alert(result.error || "Failed to generate SOP.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate SOP.");
    } finally {
      setIsGenerating(false);
    }
  };

  function handleCopyToClipboard() {
    if (!generatedSOP) return;
    navigator.clipboard.writeText(generatedSOP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExport() {
    if (!generatedSOP) return;
    const blob = new Blob([generatedSOP], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ScholarLogic_SOP_Draft.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDeleteDraft(draftId: string) {
    startTransition(async () => {
      try {
        await deleteSopDraft(draftId);
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      } catch (e) {
        console.error("Delete failed:", e);
      }
    });
  }

  function handleLoadDraft(draft: Draft) {
    setGeneratedSOP(draft.content);
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI SOP Generator
        </h1>
        <p className="text-muted-foreground">
          Instantly draft personalized Statements of Purpose tailored to your
          target scholarship.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Panel: Configuration */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <Card className="flex flex-col bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Generator Settings
              </CardTitle>
              <CardDescription>
                Select a matched scholarship and define custom instructions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="scholarship">Target Scholarship</Label>
                  <Select name="scholarship" required>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue
                        placeholder={
                          scholarships.length === 0
                            ? "No matched scholarships yet"
                            : "Select a scholarship"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {scholarships.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                      {scholarships.length === 0 && (
                        <SelectItem value="none" disabled>
                          Complete matching first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Additional Personal Instructions for AI
                  </Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    placeholder="E.g., Focus specifically on my journey overcoming financial constraints during my 10th-grade board exams..."
                    className="min-h-[150px] bg-input border-border resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border/40">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(123,92,250,0.3)] transition-all flex items-center gap-2"
                    disabled={isGenerating || scholarships.length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing profile & drafting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Draft with AI
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Saved Drafts */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Saved Drafts ({drafts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {loadingDrafts ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              ) : drafts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No saved drafts yet. Generate one above.
                </p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs"
                    >
                      <button
                        className="flex-1 text-left truncate mr-2 text-foreground"
                        onClick={() => handleLoadDraft(draft)}
                      >
                        <span className="font-medium">
                          {draft.scholarshipName}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(draft.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteDraft(draft.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Output */}
        <Card className="flex flex-col bg-card border-border shadow-lg relative h-full">
          <CardHeader className="border-b border-border/40 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg">Generated Draft</CardTitle>
            {generatedSOP && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />{" "}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 bg-background/50 m-2 rounded-md border border-border/50 relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Sparkles className="w-8 h-8 text-primary animate-spin" />
                <p>Gemini 2.0 Flash is writing your SOP...</p>
              </div>
            ) : generatedSOP ? (
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground selection:bg-primary/30">
                {generatedSOP}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm text-center px-8">
                Configure your settings on the left and click generate to create
                your personalized Statement of Purpose.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
