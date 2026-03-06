// ─── Scholarship Eligibility Rule Schema ─────────────────
export interface EligibilityRule {
  ruleType: "gpa" | "income" | "location" | "course" | "gender" | "category" | "education_level" | "year_of_study" | "first_gen" | "disability" | "other";
  operator: "gt" | "lt" | "eq" | "contains" | "in" | "gte" | "lte";
  value: string | number;
  description: string;
  isHardRequirement: boolean;
}

// ─── Scholarship with computed match ─────────────────────
export interface ScholarshipWithMatch {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  amount: string;
  amountType: string | null;
  deadline: Date | null;
  applicationUrl: string | null;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: string[];
  isActive: boolean;
  matchScore?: number;
  matchRationale?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────
export interface DashboardStats {
  activeMatches: number;
  savedApplications: number;
  underReview: number;
  wonScholarships: number;
  totalAwarded: string;
  profileCompletion: number;
}

// ─── Pipeline Extraction Result ──────────────────────────
export interface ExtractionResult {
  scholarshipName: string;
  provider: string;
  amount: string;
  amountType?: string;
  deadline: string | null;
  description?: string;
  applicationUrl?: string;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: string[];
}
