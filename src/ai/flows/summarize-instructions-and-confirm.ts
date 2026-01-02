'use server';
/**
 * @fileOverview Summarizes user instructions and confirms understanding before proceeding with video editing.
 *
 * - summarizeInstructionsAndConfirm - A function that summarizes instructions and confirms with the user.
 * - SummarizeInstructionsAndConfirmInput - The input type for the summarizeInstructionsAndConfirm function.
 * - SummarizeInstructionsAndConfirmOutput - The return type for the summarizeInstructionsAndConfirm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInstructionsAndConfirmInputSchema = z.object({
  videoEditingInstructions: z
    .string()
    .describe('The video editing instructions provided by the user.'),
  templateSelection: z
    .string()
    .describe('The selected video editing template (Hormozi, Gadzhi, Gary Vee, or Custom).'),
  customTrainingDetails: z
    .string()
    .optional()
    .describe('Details of custom training, if selected.'),
});
export type SummarizeInstructionsAndConfirmInput = z.infer<
  typeof SummarizeInstructionsAndConfirmInputSchema
>;

const SummarizeInstructionsAndConfirmOutputSchema = z.object({
  summary: z.string().describe('A summary of the video editing instructions and proposed actions.'),
  confirmationPrompt: z.string().describe('A prompt asking the user to confirm the summary.'),
});
export type SummarizeInstructionsAndConfirmOutput = z.infer<
  typeof SummarizeInstructionsAndConfirmOutputSchema
>;

export async function summarizeInstructionsAndConfirm(
  input: SummarizeInstructionsAndConfirmInput
): Promise<SummarizeInstructionsAndConfirmOutput> {
  return summarizeInstructionsAndConfirmFlow(input);
}

const summarizeInstructionsAndConfirmPrompt = ai.definePrompt({
  name: 'summarizeInstructionsAndConfirmPrompt',
  input: {schema: SummarizeInstructionsAndConfirmInputSchema},
  output: {schema: SummarizeInstructionsAndConfirmOutputSchema},
  prompt: `You are an AI video editing assistant. Please summarize the following video editing instructions and proposed actions, and then ask the user to confirm if the summary is correct.

Video Editing Instructions: {{{videoEditingInstructions}}}
Template Selection: {{{templateSelection}}}
Custom Training Details (if applicable): {{{customTrainingDetails}}}

Summary:

Confirmation Prompt: Is this summary correct? Please respond with YES to proceed, or provide additional instructions if needed.`,
});

const summarizeInstructionsAndConfirmFlow = ai.defineFlow(
  {
    name: 'summarizeInstructionsAndConfirmFlow',
    inputSchema: SummarizeInstructionsAndConfirmInputSchema,
    outputSchema: SummarizeInstructionsAndConfirmOutputSchema,
  },
  async input => {
    const {output} = await summarizeInstructionsAndConfirmPrompt(input);
    return output!;
  }
);
