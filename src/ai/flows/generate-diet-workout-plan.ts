"use server";
/**
 * @fileOverview AI agent that generates a personalized diet and workout plan based on user profile information.
 *
 * - generateDietWorkoutPlan - A function that generates the plan.
 * - GenerateDietWorkoutPlanInput - The input type for the generateDietWorkoutPlan function.
 * - GenerateDietWorkoutPlanOutput - The return type for the generateDietWorkoutPlan function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateDietWorkoutPlanInputSchema = z.object({
  age: z.number().describe("The age of the user."),
  height: z.number().describe("The height of the user in centimeters."),
  weight: z.number().describe("The weight of the user in kilograms."),
  gender: z.enum(["male", "female"]).describe("The gender of the user."),
  activityLevel: z
    .enum([
      "sedentary",
      "lightlyActive",
      "moderatelyActive",
      "veryActive",
      "extraActive",
    ])
    .describe("The activity level of the user."),
  preferredCuisine: z.string().describe("The preferred cuisine of the user."),
  dietPreferences: z.string().describe("The diet preferences of the user."),
  healthGoals: z.string().describe("The health goals of the user."),
  healthIssues: z
    .string()
    .optional()
    .describe("Any health issues of the user."),
});

export type GenerateDietWorkoutPlanInput = z.infer<
  typeof GenerateDietWorkoutPlanInputSchema
>;

const GenerateDietWorkoutPlanOutputSchema = z.object({
  dietPlan: z.string().describe("The personalized diet plan for the user."),
  workoutPlan: z
    .string()
    .describe("The personalized workout plan for the user."),
});

export type GenerateDietWorkoutPlanOutput = z.infer<
  typeof GenerateDietWorkoutPlanOutputSchema
>;

export async function generateDietWorkoutPlan(
  input: GenerateDietWorkoutPlanInput
): Promise<GenerateDietWorkoutPlanOutput> {
  return generateDietWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateDietWorkoutPlanPrompt",
  input: { schema: GenerateDietWorkoutPlanInputSchema },
  output: { schema: GenerateDietWorkoutPlanOutputSchema },
  prompt: `You are a personal trainer and nutritionist. Based on the following information, create a personalized diet and workout plan for the user.

  Age: {{{age}}}
  Height: {{{height}}} cm
  Weight: {{{weight}}} kg
  Gender: {{{gender}}}
  Activity Level: {{{activityLevel}}}
  Preferred Cuisine: {{{preferredCuisine}}}
  Diet Preferences: {{{dietPreferences}}}
  Health Goals: {{{healthGoals}}}
  Health Issues: {{{healthIssues}}}

  Diet Plan:
  Workout Plan:`,
});

const generateDietWorkoutPlanFlow = ai.defineFlow(
  {
    name: "generateDietWorkoutPlanFlow",
    inputSchema: GenerateDietWorkoutPlanInputSchema,
    outputSchema: GenerateDietWorkoutPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
