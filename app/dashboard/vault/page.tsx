"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  File,
  ShieldCheck,
  Download,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  uploadDocument,
  getUserDocuments,
  getDocumentData,
  deleteDocument,
} from "@/lib/actions/document.actions";

interface DocMeta {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  status: string;
  uploadedAt: Date;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<DocMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await getUserDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
    setIsLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadDocument(formData);
      if (result.success) {
        await loadDocuments();
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDownload(docId: string) {
    setActionId(docId);
    try {
      const data = await getDocumentData(docId);
      const byteString = atob(data.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: data.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
    setActionId(null);
  }

  function handleDelete(docId: string) {
    setActionId(docId);
    startTransition(async () => {
      try {
        await deleteDocument(docId);
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      } catch (error) {
        console.error("Delete error:", error);
      }
      setActionId(null);
    });
  }

  const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Secure Document Vault
          </h1>
          <p className="text-muted-foreground">
            Store and manage your application documents. All files are encrypted
            at rest.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleUpload}
            className="hidden"
            id="vault-upload"
          />
          <Button
            className="bg-primary text-white hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(123,92,250,0.3)]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileUp className="w-4 h-4" />
            )}
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Storage Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Used: {formatFileSize(totalSize)}
              </span>
              <span className="text-muted-foreground">Total: 50 MB</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${Math.min((totalSize / (50 * 1024 * 1024)) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Your documents are encrypted using AES-256 and stored securely.
              They will only be attached to applications you explicitly approve.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
              uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">My Documents</CardTitle>
            <CardDescription>
              Upload PDFs, JPEGs, and PNGs (max 5MB each).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                No documents uploaded yet. Click &quot;Upload Document&quot; to
                get started.
              </div>
            ) : (
              <div className="rounded-md border border-border/50 divide-y divide-border/50">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                        {doc.fileType.startsWith("image") ? (
                          <ImageIcon className="w-5 h-5" />
                        ) : (
                          <File className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            &bull;
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={
                          doc.status === "verified"
                            ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
                            : "text-amber-400 border-amber-400/20 bg-amber-400/10"
                        }
                      >
                        {doc.status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleDownload(doc.id)}
                          disabled={actionId === doc.id}
                        >
                          {actionId === doc.id && !isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(doc.id)}
                          disabled={isPending && actionId === doc.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

