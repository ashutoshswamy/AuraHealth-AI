"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveProgressLog } from "@/app/actions";

const weightLogSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  weight: z.coerce
    .number()
    .min(1, "Weight must be a positive number.")
    .max(1000, "Weight seems too high."),
});

type WeightLogFormData = z.infer<typeof weightLogSchema>;

export function WeightLogForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WeightLogFormData>({
    resolver: zodResolver(weightLogSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Default to today's date
      weight: undefined,
    },
  });

  const onSubmit: SubmitHandler<WeightLogFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await saveProgressLog(data);
      if (result.success) {
        toast({
          title: "Progress Logged!",
          description: result.message,
        });
        reset({
          date: new Date().toISOString().split("T")[0], // Reset date to today
          weight: undefined, // Clear weight
        });
      } else {
        toast({
          title: "Error Logging Progress",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "An unexpected error occurred while logging progress.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <CalendarPlus className="mr-2 h-5 w-5 text-primary" />
          Log Your Weight
        </CardTitle>
        <CardDescription>
          Enter the date and your weight to track your progress.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="e.g., 70.5"
              {...register("weight")}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">
                {errors.weight.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Log
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
