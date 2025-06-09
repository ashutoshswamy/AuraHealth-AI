"use client";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { GenerateDietWorkoutPlanInput } from "@/lib/types";
import { saveProfileAndGeneratePlan } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120),
  height: z.coerce.number().min(50, "Height in cm").max(300),
  weight: z.coerce.number().min(10, "Weight in kg").max(500),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum([
    "sedentary",
    "lightlyActive",
    "moderatelyActive",
    "veryActive",
    "extraActive",
  ]),
  preferredCuisine: z.string().min(1, "Preferred cuisine is required"),
  dietPreferences: z
    .string()
    .min(1, "Diet preferences are required (e.g., vegetarian, vegan, none)"),
  healthGoals: z
    .string()
    .min(1, "Health goals are required (e.g., weight loss, muscle gain)"),
  healthIssues: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData?: GenerateDietWorkoutPlanInput | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData || {
      age: undefined,
      height: undefined,
      weight: undefined,
      gender: "male",
      activityLevel: "moderatelyActive",
      preferredCuisine: "",
      dietPreferences: "",
      healthGoals: "",
      healthIssues: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await saveProfileAndGeneratePlan(data);
      if (result.success && result.planId) {
        toast({
          title: "Success!",
          description: result.message,
        });
        router.push(`/view-plan?planId=${result.planId}`); // Redirect to view the specific plan
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate plan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          Your Fitness Profile
        </CardTitle>
        <CardDescription>
          Tell us about yourself to generate a personalized plan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age")}
              placeholder="e.g., 30"
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              {...register("height")}
              placeholder="e.g., 175"
            />
            {errors.height && (
              <p className="text-sm text-destructive">
                {errors.height.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              {...register("weight")}
              placeholder="e.g., 70"
            />
            {errors.weight && (
              <p className="text-sm text-destructive">
                {errors.weight.message}
              </p>
            )}
          </div>

          {/* Gender Select */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-sm text-destructive">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Activity Level Select */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Controller
              name="activityLevel"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sedentary (little or no exercise)
                    </SelectItem>
                    <SelectItem value="lightlyActive">
                      Lightly Active (light exercise/sports 1-3 days/week)
                    </SelectItem>
                    <SelectItem value="moderatelyActive">
                      Moderately Active (moderate exercise/sports 3-5 days/week)
                    </SelectItem>
                    <SelectItem value="veryActive">
                      Very Active (hard exercise/sports 6-7 days a week)
                    </SelectItem>
                    <SelectItem value="extraActive">
                      Extra Active (very hard exercise/physical job)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.activityLevel && (
              <p className="text-sm text-destructive">
                {errors.activityLevel.message}
              </p>
            )}
          </div>

          {/* Preferences and Goals */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="preferredCuisine">Preferred Cuisine</Label>
            <Input
              id="preferredCuisine"
              {...register("preferredCuisine")}
              placeholder="e.g., Italian, Indian, Mexican"
            />
            {errors.preferredCuisine && (
              <p className="text-sm text-destructive">
                {errors.preferredCuisine.message}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dietPreferences">Dietary Preferences</Label>
            <Textarea
              id="dietPreferences"
              {...register("dietPreferences")}
              placeholder="e.g., Vegetarian, gluten-free, allergies to nuts"
            />
            {errors.dietPreferences && (
              <p className="text-sm text-destructive">
                {errors.dietPreferences.message}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="healthGoals">Health Goals</Label>
            <Textarea
              id="healthGoals"
              {...register("healthGoals")}
              placeholder="e.g., Lose 5kg, build muscle, improve stamina"
            />
            {errors.healthGoals && (
              <p className="text-sm text-destructive">
                {errors.healthGoals.message}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="healthIssues">Health Issues (Optional)</Label>
            <Textarea
              id="healthIssues"
              {...register("healthIssues")}
              placeholder="e.g., Knee pain, diabetes, hypertension"
            />
            {errors.healthIssues && (
              <p className="text-sm text-destructive">
                {errors.healthIssues.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate My Plan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
