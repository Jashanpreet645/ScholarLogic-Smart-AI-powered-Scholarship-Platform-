"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

export async function submitOnboarding(prevState: unknown, formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const email =
    user?.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  const rawData = {
    fullName: formData.get("fullName")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    dateOfBirth: formData.get("dateOfBirth")?.toString() || "",
    gender: formData.get("gender")?.toString() || "",
    educationLevel: formData.get("educationLevel")?.toString() || "",
    course: formData.get("course")?.toString() || "",
    yearOfStudy: formData.get("yearOfStudy")?.toString() || "",
    gpa: formData.get("gpa")?.toString() || "",
    institution: formData.get("institution")?.toString() || "",
    state: formData.get("state")?.toString() || "",
    firstGen: formData.get("firstGen") === "on",
    disability: formData.get("disability") === "on",
    category: formData.get("category")?.toString() || "",
    incomeBracket: formData.get("incomeBracket")?.toString() || "",
  };

  const parsed = profileSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.flatten().fieldErrors);
    return {
      message: "Invalid form data. Please check all required fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Upsert the User record
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        profileCompletion: 100,
      },
      create: {
        clerkId: userId,
        email,
        profileCompletion: 100,
      },
    });

    // 2. Upsert the StudentProfile with all fields
    await prisma.studentProfile.upsert({
      where: { clerkId: userId },
      update: {
        fullName: parsed.data.fullName,
        dateOfBirth: parsed.data.dateOfBirth || null,
        gender: parsed.data.gender || null,
        phone: parsed.data.phone || null,
        educationLevel: parsed.data.educationLevel,
        course: parsed.data.course,
        yearOfStudy: parsed.data.yearOfStudy,
        gpa: parsed.data.gpa || null,
        institution: parsed.data.institution || null,
        state: parsed.data.state,
        category: parsed.data.category,
        firstGen: parsed.data.firstGen,
        disability: parsed.data.disability,
        incomeBracket: parsed.data.incomeBracket,
      },
      create: {
        clerkId: userId,
        fullName: parsed.data.fullName,
        dateOfBirth: parsed.data.dateOfBirth || null,
        gender: parsed.data.gender || null,
        phone: parsed.data.phone || null,
        educationLevel: parsed.data.educationLevel,
        course: parsed.data.course,
        yearOfStudy: parsed.data.yearOfStudy,
        gpa: parsed.data.gpa || null,
        institution: parsed.data.institution || null,
        state: parsed.data.state,
        category: parsed.data.category,
        firstGen: parsed.data.firstGen,
        disability: parsed.data.disability,
        incomeBracket: parsed.data.incomeBracket,
      },
    });

    // 3. Trigger matching engine in background (non-blocking)
    // We don't await this - it runs after redirect
    import("@/lib/actions/match.actions")
      .then(({ runMatchingEngine }) => runMatchingEngine())
      .catch(console.error);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Database error:", msg);
    return { message: "Database error: " + msg };
  }

  redirect("/dashboard");
}

