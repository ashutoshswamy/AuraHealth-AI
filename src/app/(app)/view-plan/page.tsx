import type { Metadata } from "next";
import { getGeneratedPlans, getPlanById } from "@/app/actions";
import { PlanDisplay } from "@/components/plan/plan-display";
import { HistoricalPlanItem } from "@/components/plan/historical-plan-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "View Plans - Aura Health AI",
  description:
    "Review your current and past AI-generated diet and workout plans.",
  robots: {
    index: false, // Do not index app-internal pages
    follow: true,
  },
};

interface ViewPlanPageProps {
  searchParams?: {
    planId?: string;
  };
}

export default async function ViewPlanPage({
  searchParams,
}: ViewPlanPageProps) {
  const planId = searchParams?.planId;
  let planToDisplay;
  let historicalPlans = await getGeneratedPlans();

  if (planId) {
    planToDisplay = await getPlanById(planId);
    // Filter out the currently displayed plan from historical list if it exists
    if (planToDisplay) {
      historicalPlans = historicalPlans.filter(
        (p) => p.id !== planToDisplay!.id
      );
    }
  } else if (historicalPlans.length > 0) {
    planToDisplay = historicalPlans[0]; // Display the latest plan by default
    historicalPlans = historicalPlans.slice(1); // Remove the latest from historical list
  }

  if (!planToDisplay && historicalPlans.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">No Plans Yet</CardTitle>
            <CardDescription>
              You haven&apos;t generated any fitness plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/generate-plan">Generate Your First Plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {planToDisplay && <PlanDisplay plan={planToDisplay} />}

      {historicalPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Past Plans</CardTitle>
            <CardDescription>
              Review your previously generated plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {historicalPlans.map((plan) => (
                <HistoricalPlanItem key={plan.id} plan={plan} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!planToDisplay && historicalPlans.length > 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">
            Select a plan from your history to view details.
          </p>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
