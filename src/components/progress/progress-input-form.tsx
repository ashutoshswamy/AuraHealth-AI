"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProgressSummary } from "@/app/actions"; // Assuming this action exists

const progressReportSchema = z.object({
  report: z
    .string()
    .min(
      10,
      "Please provide a brief report of your progress (at least 10 characters)."
    ),
});

type ProgressReportFormData = z.infer<typeof progressReportSchema>;

export function ProgressInputForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryResult, setSummaryResult] = useState<{
    summary: string;
    encouragement: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgressReportFormData>({
    resolver: zodResolver(progressReportSchema),
  });

  const onSubmit: SubmitHandler<ProgressReportFormData> = async (data) => {
    setIsSubmitting(true);
    setSummaryResult(null);
    try {
      const result = await getProgressSummary(data.report);
      if ("error" in result) {
        toast({
          title: "Error Summarizing",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setSummaryResult(result);
        toast({
          title: "Summary Generated!",
          description: "AI coach's feedback is ready.",
        });
        reset(); // Clear the form
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating summary.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI Progress Coach
          </CardTitle>
          <CardDescription>
            Share your progress, and let our AI coach provide a summary and
            encouragement. For example: &quot;This week I lost 0.5kg, stuck to
            my diet 5 out of 7 days, and completed all my workouts. Feeling a
            bit tired but motivated.&quot;
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="report">Your Progress Update</Label>
              <Textarea
                id="report"
                rows={5}
                placeholder="Tell us about your week..."
                {...register("report")}
              />
              {errors.report && (
                <p className="text-sm text-destructive">
                  {errors.report.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get AI Feedback
            </Button>
          </CardFooter>
        </form>
      </Card>

      {summaryResult && (
        <Card className="w-full bg-accent/10 border-accent">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-primary">
              AI Coach Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Summary:</h4>
              <p className="text-sm text-muted-foreground">
                {summaryResult.summary}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Encouragement:</h4>
              <p className="text-sm text-muted-foreground">
                {summaryResult.encouragement}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
