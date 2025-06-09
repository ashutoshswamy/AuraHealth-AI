import type { Metadata } from "next";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { ProgressInputForm } from "@/components/progress/progress-input-form";
import { LogEntryForm } from "@/components/progress/log-entry-form";
import { getProgressLogs } from "@/app/actions";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Track Progress - Aura Health AI",
  description:
    "Log your fitness progress, weight, and measurements. Visualize your journey with Aura Health AI.",
  robots: {
    index: false, // Do not index app-internal pages
    follow: true,
  },
};

export default async function ProgressPage() {
  const progressLogs = await getProgressLogs();

  return (
    <div className="container mx-auto py-8 px-4 space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Log your weight, muscle measurements, workout completion, and
          visualize your journey.
        </p>
      </div>

      <LogEntryForm />

      <Separator />

      <ProgressCharts data={progressLogs} />

      <Separator />

      <ProgressInputForm />
    </div>
  );
}

export const dynamic = "force-dynamic";
