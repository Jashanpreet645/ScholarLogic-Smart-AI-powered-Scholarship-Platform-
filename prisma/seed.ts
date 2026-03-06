import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const scholarships = [
  {
    name: "Prime Minister's Scholarship Scheme (PMSS)",
    provider: "Ministry of Defence, Government of India",
    description:
      "Scholarship for wards of ex-servicemen/ex-coast guard personnel pursuing professional degree courses like engineering, medical, dental, MBA, etc.",
    amount: "₹2,500/month (boys), ₹3,000/month (girls)",
    amountType: "monthly",
    deadline: new Date("2025-10-31"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate"], label: "Must be in UG or PG program" },
      { ruleType: "gpa", operator: "gte", value: 6.0, label: "Minimum 60% or 6.0 CGPA in last qualifying exam" },
      { ruleType: "income", operator: "lte", value: 600000, label: "Annual family income below ₹6 LPA" },
    ],
    requiredDocuments: ["10th Marksheet", "12th Marksheet", "Income Certificate", "Ex-Serviceman Certificate", "Aadhar Card"],
  },
  {
    name: "Post Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    description:
      "Central government scholarship for Scheduled Caste students pursuing post-matriculation or post-secondary education in recognized institutions.",
    amount: "₹5,500/year + tuition fee reimbursement",
    amountType: "yearly",
    deadline: new Date("2025-11-30"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "category", operator: "eq", value: "SC", label: "Must belong to Scheduled Caste (SC)" },
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate", "diploma"], label: "Post-matric education" },
      { ruleType: "income", operator: "lte", value: 250000, label: "Annual family income below ₹2.5 LPA" },
    ],
    requiredDocuments: ["Caste Certificate", "Income Certificate", "Previous Year Marksheet", "Aadhar Card", "Bank Account Details"],
  },
  {
    name: "HDFC Bank Parivartan's ECS Scholarship",
    provider: "HDFC Bank CSR",
    description:
      "Support for meritorious students from economically weaker sections for school, undergraduate and postgraduate education across India.",
    amount: "Up to ₹75,000/year",
    amountType: "yearly",
    deadline: new Date("2025-09-30"),
    applicationUrl: "https://www.buddy4study.com/scholarship/hdfc-bank-parivartans-ecs-scholarship",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate"], label: "UG or PG students" },
      { ruleType: "gpa", operator: "gte", value: 5.5, label: "Minimum 55% in previous qualifying exam" },
      { ruleType: "income", operator: "lte", value: 800000, label: "Annual family income below ₹8 LPA" },
    ],
    requiredDocuments: ["Income Certificate", "Marksheets", "Fee Receipt", "Aadhar Card", "Bank Passbook"],
  },
  {
    name: "Central Sector Scheme of Scholarship (CSSS)",
    provider: "Ministry of Education, Government of India",
    description:
      "Merit-based scholarship for students who scored above 80th percentile in Class 12 board exams and are pursuing regular courses in recognized colleges.",
    amount: "₹12,000/year (UG), ₹20,000/year (PG)",
    amountType: "yearly",
    deadline: new Date("2025-12-31"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate"], label: "UG or PG education" },
      { ruleType: "gpa", operator: "gte", value: 8.0, label: "Above 80th percentile in Class 12" },
      { ruleType: "income", operator: "lte", value: 800000, label: "Annual family income below ₹8 LPA" },
    ],
    requiredDocuments: ["12th Marksheet", "Income Certificate", "College Admission Letter", "Aadhar Card"],
  },
  {
    name: "Pragati Scholarship for Girls (AICTE)",
    provider: "AICTE (All India Council for Technical Education)",
    description:
      "Scholarship for girl students admitted to AICTE-approved degree or diploma programs in technical education. Supports up to 2 girls per family.",
    amount: "₹50,000/year",
    amountType: "yearly",
    deadline: new Date("2025-11-30"),
    applicationUrl: "https://www.aicte-india.org/schemes/students-development-schemes/pragati-scheme",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "gender", operator: "eq", value: "Female", label: "Only for female students" },
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "diploma"], label: "Degree or Diploma in technical education" },
      { ruleType: "income", operator: "lte", value: 800000, label: "Annual family income below ₹8 LPA" },
    ],
    requiredDocuments: ["10th Marksheet", "12th Marksheet", "Income Certificate", "Aadhar Card", "AICTE Admission Letter"],
  },
  {
    name: "Begum Hazrat Mahal National Scholarship",
    provider: "Maulana Azad Education Foundation (MAEF), Ministry of Minority Affairs",
    description:
      "Scholarship for meritorious girls belonging to minority communities studying in Classes 9 to 12.",
    amount: "₹5,000 (Class 9-10), ₹6,000 (Class 11-12)",
    amountType: "one-time",
    deadline: new Date("2025-10-15"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "gender", operator: "eq", value: "Female", label: "Only for female students" },
      { ruleType: "category", operator: "in", value: ["Minority", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"], label: "Must belong to a minority community" },
      { ruleType: "income", operator: "lte", value: 200000, label: "Annual family income below ₹2 LPA" },
      { ruleType: "gpa", operator: "gte", value: 5.0, label: "Minimum 50% in previous exam" },
    ],
    requiredDocuments: ["Minority Certificate", "Income Certificate", "Marksheet", "Aadhar Card", "School Verification"],
  },
  {
    name: "National Means-cum-Merit Scholarship (NMMSS)",
    provider: "Ministry of Education, Department of School Education & Literacy",
    description:
      "Scholarship to meritorious students of economically weaker sections to arrest their drop out at class 8 and encourage them to continue education.",
    amount: "₹12,000/year",
    amountType: "yearly",
    deadline: new Date("2025-12-15"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["secondary"], label: "Students studying in Class 9 onwards" },
      { ruleType: "gpa", operator: "gte", value: 5.5, label: "Minimum 55% in Class 7 exam" },
      { ruleType: "income", operator: "lte", value: 350000, label: "Annual parental income below ₹3.5 LPA" },
    ],
    requiredDocuments: ["Income Certificate", "Marksheet", "Aadhar Card", "State Examination Scorecard"],
  },
  {
    name: "Tata Trusts Education Scholarship",
    provider: "Tata Trusts",
    description:
      "Need-based scholarship for students from low-income families pursuing professional courses (engineering, medical, law, management) from reputed institutions.",
    amount: "Up to ₹1,50,000/year",
    amountType: "yearly",
    deadline: new Date("2025-08-31"),
    applicationUrl: "https://www.buddy4study.com/scholarship/tata-trusts-education-assistance",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate"], label: "Professional UG or PG courses" },
      { ruleType: "income", operator: "lte", value: 400000, label: "Annual family income below ₹4 LPA" },
      { ruleType: "gpa", operator: "gte", value: 6.0, label: "Minimum 60% in last qualifying exam" },
    ],
    requiredDocuments: ["Income Certificate", "Fee Receipt", "Previous Year Marksheet", "Admission Letter", "Aadhar Card"],
  },
  {
    name: "Vidyasaarathi Scholarship (NSDL e-Governance)",
    provider: "NSDL e-Governance Infrastructure Limited",
    description:
      "Portal offering multiple scholarship schemes from corporates for students pursuing professional courses like B.E., B.Tech, MBA, M.Tech etc.",
    amount: "₹10,000 to ₹50,000/year",
    amountType: "yearly",
    deadline: new Date("2025-09-30"),
    applicationUrl: "https://www.vidyasaarathi.co.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "education_level", operator: "in", value: ["undergraduate", "postgraduate"], label: "Professional courses" },
      { ruleType: "income", operator: "lte", value: 600000, label: "Annual family income below ₹6 LPA" },
      { ruleType: "gpa", operator: "gte", value: 5.0, label: "Minimum 50% in previous qualifying exam" },
    ],
    requiredDocuments: ["Marksheets", "Income Certificate", "College Identity Card", "Aadhar Card"],
  },
  {
    name: "Pre-Matric Scholarship for OBC Students",
    provider: "Ministry of Social Justice & Empowerment",
    description:
      "Scholarship to OBC students with family income below ₹2.5 LPA to support pre-matric education (Class 1-10).",
    amount: "₹100-500/month + maintenance allowance",
    amountType: "monthly",
    deadline: new Date("2025-10-31"),
    applicationUrl: "https://scholarships.gov.in",
    sourceFile: "seed_data",
    eligibilityRules: [
      { ruleType: "category", operator: "eq", value: "OBC", label: "Must belong to OBC category" },
      { ruleType: "income", operator: "lte", value: 250000, label: "Annual family income below ₹2.5 LPA" },
    ],
    requiredDocuments: ["OBC Certificate", "Income Certificate", "Previous Year Marksheet", "Aadhar Card"],
  },
];

async function main() {
  console.log("🌱 Seeding database with scholarships...\n");

  for (const s of scholarships) {
    const existing = await prisma.scholarship.findFirst({
      where: { name: s.name },
    });

    if (existing) {
      console.log(`  ⏩ Skipping (already exists): ${s.name}`);
      continue;
    }

    await prisma.scholarship.create({
      data: {
        name: s.name,
        provider: s.provider,
        description: s.description,
        amount: s.amount,
        amountType: s.amountType,
        deadline: s.deadline,
        applicationUrl: s.applicationUrl,
        sourceFile: s.sourceFile,
        eligibilityRules: s.eligibilityRules,
        requiredDocuments: s.requiredDocuments,
      },
    });
    console.log(`  ✅ Created: ${s.name}`);
  }

  const count = await prisma.scholarship.count();
  console.log(`\n🎉 Done! Total scholarships in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
