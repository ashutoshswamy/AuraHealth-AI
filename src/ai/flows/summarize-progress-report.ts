// Summarize the progress report and provide encouragement.
"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SummarizeProgressReportInputSchema = z.object({
  report: z
    .string()
    .describe(
      "The user provided report which includes metrics of their fitness progress."
    ),
});
export type SummarizeProgressReportInput = z.infer<
  typeof SummarizeProgressReportInputSchema
>;

const SummarizeProgressReportOutputSchema = z.object({
  summary: z.string().describe("A summary of the progress made."),
  encouragement: z
    .string()
    .describe("Words of encouragement to keep motivated."),
});
export type SummarizeProgressReportOutput = z.infer<
  typeof SummarizeProgressReportOutputSchema
>;

export async function summarizeProgressReport(
  input: SummarizeProgressReportInput
): Promise<SummarizeProgressReportOutput> {
  return summarizeProgressReportFlow(input);
}

const prompt = ai.definePrompt({
  name: "summarizeProgressReportPrompt",
  input: { schema: SummarizeProgressReportInputSchema },
  output: { schema: SummarizeProgressReportOutputSchema },
  prompt: `You are an AI fitness coach. You will analyze the progress report of the user and provide a summary of the progress made and some words of encouragement to keep motivated.\n\nProgress Report: {{{report}}}`,
});

const summarizeProgressReportFlow = ai.defineFlow(
  {
    name: "summarizeProgressReportFlow",
    inputSchema: SummarizeProgressReportInputSchema,
    outputSchema: SummarizeProgressReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
