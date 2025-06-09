import type {
  GenerateDietWorkoutPlanInput,
  GenerateDietWorkoutPlanOutput,
} from "@/ai/flows/generate-diet-workout-plan";
export type { GenerateDietWorkoutPlanInput, GenerateDietWorkoutPlanOutput };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          age: number | null;
          height: number | null;
          weight: number | null;
          gender: "male" | "female" | "other" | null;
          activity_level:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive"
            | null;
          preferred_cuisine: string | null;
          diet_preferences: string | null;
          health_goals: string | null;
          health_issues: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          age?: number | null;
          height?: number | null;
          weight?: number | null;
          gender?: "male" | "female" | "other" | null;
          activity_level?:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive"
            | null;
          preferred_cuisine?: string | null;
          diet_preferences?: string | null;
          health_goals?: string | null;
          health_issues?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          age?: number | null;
          height?: number | null;
          weight?: number | null;
          gender?: "male" | "female" | "other" | null;
          activity_level?:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive"
            | null;
          preferred_cuisine?: string | null;
          diet_preferences?: string | null;
          health_goals?: string | null;
          health_issues?: string | null;
        };
      };
      generated_plans: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          inputs: GenerateDietWorkoutPlanInput;
          diet_plan: string;
          workout_plan: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          inputs: GenerateDietWorkoutPlanInput;
          diet_plan: string;
          workout_plan: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          inputs?: GenerateDietWorkoutPlanInput;
          diet_plan?: string;
          workout_plan?: string;
        };
      };
      progress_logs: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          date: string;
          weight: number | null;
          workout_summary: string | null;
          mood: string | null;
          notes: string | null;
          workout_completed: boolean | null; // Changed from default false to nullable
          arm_circumference: number | null;
          chest_circumference: number | null;
          waist_circumference: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          date: string;
          weight?: number | null;
          workout_summary?: string | null;
          mood?: string | null;
          notes?: string | null;
          workout_completed?: boolean | null;
          arm_circumference?: number | null;
          chest_circumference?: number | null;
          waist_circumference?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          date?: string;
          weight?: number | null;
          workout_summary?: string | null;
          mood?: string | null;
          notes?: string | null;
          workout_completed?: boolean | null;
          arm_circumference?: number | null;
          chest_circumference?: number | null;
          waist_circumference?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Type for inserting a progress log, used in actions.ts
export type ProgressLogInsertData = {
  date: string; // YYYY-MM-DD format
  weight?: number | null;
  workout_completed?: boolean | null;
  arm_circumference?: number | null;
  chest_circumference?: number | null;
  waist_circumference?: number | null;
  // workout_summary, mood, notes can be added if forms for them exist
};
