"use client";

import type { Tables } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Utensils, Dumbbell } from "lucide-react";

interface PlanDisplayProps {
  plan: Tables<"generated_plans">;
}

function formatTextToHtml(text: string) {
  if (!text) return "";
  // Simple formatting: replace newlines with <br> and bold markdown with <strong>
  // You might want a more robust markdown parser here for complex formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold: **text**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics: *text*
    .replace(/### (.*?)\n/g, "<h3>$1</h3>") // H3: ### Heading
    .replace(/## (.*?)\n/g, "<h2>$1</h2>") // H2: ## Heading
    .replace(/# (.*?)\n/g, "<h1>$1</h1>") // H1: # Heading
    .replace(/^- (.*?)\n/gm, "<li>$1</li>") // List items: - item
    .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>") // Wrap list items in <ul>
    .replace(/\n/g, "<br />");
}

export function PlanDisplay({ plan }: PlanDisplayProps) {
  const generatedDateTime = new Date(plan.created_at).toLocaleString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          Your Personalized Plan
        </CardTitle>
        <CardDescription>
          Generated on {generatedDateTime}. Based on your profile inputs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          defaultValue="diet-plan"
          className="w-full"
        >
          <AccordionItem value="diet-plan">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              <div className="flex items-center">
                <Utensils className="mr-3 h-6 w-6 text-primary" />
                Diet Plan
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none dark:prose-invert text-foreground/90 p-4 bg-muted/30 rounded-md">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatTextToHtml(plan.diet_plan),
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="workout-plan">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              <div className="flex items-center">
                <Dumbbell className="mr-3 h-6 w-6 text-primary" />
                Workout Plan
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none dark:prose-invert text-foreground/90 p-4 bg-muted/30 rounded-md">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatTextToHtml(plan.workout_plan),
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <details className="mt-6 p-4 border rounded-lg bg-muted/20">
          <summary className="cursor-pointer font-medium text-foreground/80 hover:text-foreground">
            View Inputs for this Plan
          </summary>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Age:</strong> {plan.inputs.age}
            </p>
            <p>
              <strong>Height:</strong> {plan.inputs.height} cm
            </p>
            <p>
              <strong>Weight:</strong> {plan.inputs.weight} kg
            </p>
            <p>
              <strong>Gender:</strong> {plan.inputs.gender}
            </p>
            <p>
              <strong>Activity Level:</strong> {plan.inputs.activityLevel}
            </p>
            <p>
              <strong>Preferred Cuisine:</strong> {plan.inputs.preferredCuisine}
            </p>
            <p>
              <strong>Diet Preferences:</strong> {plan.inputs.dietPreferences}
            </p>
            <p>
              <strong>Health Goals:</strong> {plan.inputs.healthGoals}
            </p>
            {plan.inputs.healthIssues && (
              <p>
                <strong>Health Issues:</strong> {plan.inputs.healthIssues}
              </p>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
