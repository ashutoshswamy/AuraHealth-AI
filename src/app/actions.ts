"use server";

import { generateDietWorkoutPlan } from "@/ai/flows/generate-diet-workout-plan";
import { summarizeProgressReport } from "@/ai/flows/summarize-progress-report";
import { createClient } from "@/lib/supabase/server";
import type {
  GenerateDietWorkoutPlanInput,
  Database,
  ProgressLogInsertData,
} from "@/lib/types";
import type { Tables } from "@/lib/types";
import { revalidatePath } from "next/cache";

type ProfileData = Tables<"profiles">;
type ProgressLogSupabaseInsert =
  Database["public"]["Tables"]["progress_logs"]["Insert"];
type ProgressLogSupabaseRow =
  Database["public"]["Tables"]["progress_logs"]["Row"];

export async function saveProfileAndGeneratePlan(
  input: GenerateDietWorkoutPlanInput
): Promise<{
  success: boolean;
  message: string;
  planId?: string;
  error?: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
      error: "User not authenticated.",
    };
  }

  const profileData: Omit<ProfileData, "id" | "updated_at"> & {
    id: string;
    updated_at: string;
  } = {
    id: user.id,
    age: input.age,
    height: input.height,
    weight: input.weight,
    gender: input.gender as ProfileData["gender"],
    activity_level: input.activityLevel as ProfileData["activity_level"],
    preferred_cuisine: input.preferredCuisine,
    diet_preferences: input.dietPreferences,
    health_goals: input.healthGoals,
    health_issues: input.healthIssues,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profileData);

  if (profileError) {
    console.error("Error saving profile:", profileError);
    return {
      success: false,
      message: "Failed to save profile.",
      error: profileError.message,
    };
  }

  try {
    const planOutput = await generateDietWorkoutPlan(input);

    const { data: newPlan, error: planSaveError } = await supabase
      .from("generated_plans")
      .insert({
        user_id: user.id,
        inputs: input,
        diet_plan: planOutput.dietPlan,
        workout_plan: planOutput.workoutPlan,
      })
      .select("id")
      .single();

    if (planSaveError) {
      console.error("Error saving plan:", planSaveError);
      return {
        success: false,
        message: "Failed to save generated plan.",
        error: planSaveError.message,
      };
    }

    revalidatePath("/view-plan");
    return {
      success: true,
      message: "Profile saved and plan generated successfully!",
      planId: newPlan?.id,
    };
  } catch (aiError: any) {
    console.error("Error generating plan with AI:", aiError);
    return {
      success: false,
      message: "Failed to generate plan using AI.",
      error: aiError.message || "Unknown AI error",
    };
  }
}

export async function getLatestProfile(): Promise<GenerateDietWorkoutPlanInput | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return {
    age: profile.age ?? 0,
    height: profile.height ?? 0,
    weight: profile.weight ?? 0,
    gender: profile.gender ?? "male",
    activityLevel: profile.activity_level ?? "sedentary",
    preferredCuisine: profile.preferred_cuisine ?? "",
    dietPreferences: profile.diet_preferences ?? "",
    healthGoals: profile.health_goals ?? "",
    healthIssues: profile.health_issues ?? undefined,
  };
}

export async function getGeneratedPlans(): Promise<
  Tables<"generated_plans">[]
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: plans, error } = await supabase
    .from("generated_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
  return plans || [];
}

export async function getPlanById(
  planId: string
): Promise<Tables<"generated_plans"> | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: plan, error } = await supabase
    .from("generated_plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(`Error fetching plan ${planId}:`, error);
    return null;
  }
  return plan;
}

export async function deleteGeneratedPlan(
  planId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
      error: "User not authenticated.",
    };
  }

  const { error } = await supabase
    .from("generated_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting plan:", error);
    return {
      success: false,
      message: "Failed to delete plan.",
      error: error.message,
    };
  }

  revalidatePath("/view-plan");
  return { success: true, message: "Plan deleted successfully!" };
}

export async function getProgressSummary(
  reportText: string
): Promise<{ summary: string; encouragement: string } | { error: string }> {
  try {
    const result = await summarizeProgressReport({ report: reportText });
    return result;
  } catch (error: any) {
    console.error("Error getting progress summary:", error);
    return { error: error.message || "Failed to get progress summary" };
  }
}

export async function saveProgressLog(
  data: ProgressLogInsertData
): Promise<{ success: boolean; message: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
      error: "User not authenticated.",
    };
  }

  const progressLogData: ProgressLogSupabaseInsert = {
    user_id: user.id,
    date: data.date,
    weight: data.weight,
    workout_completed: data.workout_completed,
    arm_circumference: data.arm_circumference,
    chest_circumference: data.chest_circumference,
    waist_circumference: data.waist_circumference,
  };

  const { error } = await supabase
    .from("progress_logs")
    .upsert(progressLogData, { onConflict: "user_id, date" });

  if (error) {
    console.error("Error saving progress log:", error);
    if (error.code === "23505") {
      return {
        success: false,
        message:
          "A log for this date already exists. You can edit the existing log or choose a different date.",
        error: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to save progress log.",
      error: error.message,
    };
  }

  revalidatePath("/progress");
  return { success: true, message: "Progress log saved successfully!" };
}

export async function getProgressLogs(): Promise<Tables<"progress_logs">[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: logs, error } = await supabase
    .from("progress_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching progress logs:", error);
    return [];
  }
  return logs || [];
}

export async function getProgressLogByDate(
  dateString: string
): Promise<ProgressLogSupabaseRow | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: log, error } = await supabase
    .from("progress_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", dateString)
    .single();

  if (error) {
    // .single() throws an error if no rows or multiple rows are found.
    // For "no rows found", it's not an actual error for our use case, so we return null.
    if (error.code === "PGRST116") {
      // PostgREST error code for "Searched item was not found"
      return null;
    }
    console.error(`Error fetching progress log for date ${dateString}:`, error);
    return null;
  }
  return log;
}

export async function deleteProgressLogByDate(
  dateString: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not authenticated.",
      error: "User not authenticated.",
    };
  }

  const { error } = await supabase
    .from("progress_logs")
    .delete()
    .eq("user_id", user.id)
    .eq("date", dateString);

  if (error) {
    console.error("Error deleting progress log:", error);
    return {
      success: false,
      message: "Failed to delete progress log.",
      error: error.message,
    };
  }

  revalidatePath("/progress");
  return { success: true, message: "Progress log deleted successfully!" };
}
