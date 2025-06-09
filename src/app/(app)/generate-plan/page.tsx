import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms/profile-form";
import { getLatestProfile } from "@/app/actions";

export const metadata: Metadata = {
  title: "Generate Plan - Aura Health AI",
  description:
    "Provide your details to generate a personalized diet and workout plan with Aura Health AI.",
  robots: {
    index: false, // Do not index app-internal pages
    follow: true,
  },
};

export default async function GeneratePlanPage() {
  const initialData = await getLatestProfile();

  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileForm initialData={initialData} />
    </div>
  );
}

export const dynamic = "force-dynamic"; // Ensure fresh data on each load
