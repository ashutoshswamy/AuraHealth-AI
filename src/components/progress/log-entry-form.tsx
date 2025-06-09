"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
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
import { Loader2, CalendarPlus, Dumbbell, Ruler, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  saveProgressLog,
  getProgressLogByDate,
  deleteProgressLogByDate,
} from "@/app/actions";
import type { ProgressLogInsertData, Tables } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const logEntrySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  weight: z.coerce
    .number()
    .positive("Weight must be positive.")
    .optional()
    .nullable(),
  workout_completed: z.boolean().default(false).optional(),
  arm_circumference: z.coerce
    .number()
    .positive("Arm circumference must be positive.")
    .optional()
    .nullable(),
  chest_circumference: z.coerce
    .number()
    .positive("Chest circumference must be positive.")
    .optional()
    .nullable(),
  waist_circumference: z.coerce
    .number()
    .positive("Waist circumference must be positive.")
    .optional()
    .nullable(),
});

type LogEntryFormData = z.infer<typeof logEntrySchema>;
type ProgressLogRow = Tables<"progress_logs">;

const defaultFormValues: LogEntryFormData = {
  date: new Date().toISOString().split("T")[0],
  weight: null,
  workout_completed: false,
  arm_circumference: null,
  chest_circumference: null,
  waist_circumference: null,
};

export function LogEntryForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingLog, setIsFetchingLog] = useState(false);
  const [loadedLogData, setLoadedLogData] = useState<ProgressLogRow | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LogEntryFormData>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: defaultFormValues,
  });

  const selectedDate = watch("date");

  const fetchLogForDate = useCallback(
    async (dateString: string) => {
      if (!dateString) return;
      setIsFetchingLog(true);
      setLoadedLogData(null); // Clear previous loaded data
      try {
        const log = await getProgressLogByDate(dateString);
        if (log) {
          setLoadedLogData(log);
          reset({
            date: log.date, // keep the selected date
            weight: log.weight ?? null,
            workout_completed: log.workout_completed ?? false,
            arm_circumference: log.arm_circumference ?? null,
            chest_circumference: log.chest_circumference ?? null,
            waist_circumference: log.waist_circumference ?? null,
          });
        } else {
          // If no log found, reset form but keep the selected date
          reset({
            ...defaultFormValues,
            date: dateString,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch log data.",
          variant: "destructive",
        });
        reset({ ...defaultFormValues, date: dateString }); // Reset but keep date on error
      } finally {
        setIsFetchingLog(false);
      }
    },
    [reset, toast]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchLogForDate(selectedDate);
    }
  }, [selectedDate, fetchLogForDate]);

  const onSubmit: SubmitHandler<LogEntryFormData> = async (data) => {
    setIsSubmitting(true);
    const dataToSave: ProgressLogInsertData = {
      date: data.date,
      weight: data.weight || null,
      workout_completed: data.workout_completed || false,
      arm_circumference: data.arm_circumference || null,
      chest_circumference: data.chest_circumference || null,
      waist_circumference: data.waist_circumference || null,
    };

    try {
      const result = await saveProgressLog(dataToSave);
      if (result.success) {
        toast({
          title: loadedLogData ? "Progress Updated!" : "Progress Logged!",
          description: result.message,
        });
        // Re-fetch to update loadedLogData state after save/update
        fetchLogForDate(data.date);
      } else {
        toast({
          title: "Error Saving Progress",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "An unexpected error occurred while saving progress.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async () => {
    if (!loadedLogData || !selectedDate) return;
    setIsDeleting(true);
    try {
      const result = await deleteProgressLogByDate(selectedDate);
      if (result.success) {
        toast({
          title: "Log Deleted",
          description: result.message,
        });
        setLoadedLogData(null);
        reset({ ...defaultFormValues, date: selectedDate }); // Reset form but keep the date for potential new entry
      } else {
        toast({
          title: "Error Deleting Log",
          description: result.error || "Could not delete log entry.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An unexpected error occurred while deleting.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <CalendarPlus className="mr-2 h-5 w-5 text-primary" />
          Log Your Daily Progress
        </CardTitle>
        <CardDescription>
          Select a date to log new progress or edit an existing entry.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              disabled={isFetchingLog || isSubmitting || isDeleting}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
            {isFetchingLog && (
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                data...
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70.5"
                {...register("weight")}
                disabled={isSubmitting || isDeleting}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="hidden md:block invisible text-sm font-medium leading-none">
                Workout Status
              </Label>
              <Controller
                name="workout_completed"
                control={control}
                disabled={isSubmitting || isDeleting}
                render={({ field }) => (
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox
                      id="workout_completed_checkbox"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      ref={field.ref}
                      disabled={isSubmitting || isDeleting}
                    />
                    <Label
                      htmlFor="workout_completed_checkbox"
                      className="font-normal flex items-center cursor-pointer"
                    >
                      <Dumbbell className="mr-2 h-4 w-4 text-primary" /> Workout
                      Completed?
                    </Label>
                  </div>
                )}
              />
              {errors.workout_completed && (
                <p className="text-sm text-destructive">
                  {errors.workout_completed.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="flex items-center text-lg font-semibold mt-2">
              <Ruler className="mr-2 h-5 w-5 text-primary" />
              Muscle Measurements
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Enter your body measurements in centimeters. These are optional.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arm_circumference">Arm (cm)</Label>
            <Input
              id="arm_circumference"
              type="number"
              step="0.1"
              placeholder="e.g., 35.5"
              {...register("arm_circumference")}
              disabled={isSubmitting || isDeleting}
            />
            {errors.arm_circumference && (
              <p className="text-sm text-destructive">
                {errors.arm_circumference.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="chest_circumference">Chest (cm)</Label>
            <Input
              id="chest_circumference"
              type="number"
              step="0.1"
              placeholder="e.g., 100"
              {...register("chest_circumference")}
              disabled={isSubmitting || isDeleting}
            />
            {errors.chest_circumference && (
              <p className="text-sm text-destructive">
                {errors.chest_circumference.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="waist_circumference">Waist (cm)</Label>
            <Input
              id="waist_circumference"
              type="number"
              step="0.1"
              placeholder="e.g., 80"
              {...register("waist_circumference")}
              disabled={isSubmitting || isDeleting}
            />
            {errors.waist_circumference && (
              <p className="text-sm text-destructive">
                {errors.waist_circumference.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || isFetchingLog || isDeleting}
            className="w-full sm:w-auto"
          >
            {(isSubmitting || isFetchingLog) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isFetchingLog
              ? "Loading..."
              : loadedLogData
              ? "Update Log Entry"
              : "Save Log Entry"}
          </Button>
          {loadedLogData && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={isDeleting || isSubmitting || isFetchingLog}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete Entry for this Date"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the progress log for{" "}
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteLog}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete entry"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
