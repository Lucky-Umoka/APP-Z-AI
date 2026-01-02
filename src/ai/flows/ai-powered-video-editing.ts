'use server';

/**
 * @fileOverview An AI-powered video editing flow.
 *
 * - aiPoweredVideoEditing - A function that handles the video editing process.
 * - AiPoweredVideoEditingInput - The input type for the aiPoweredVideoEditing function.
 * - AiPoweredVideoEditingOutput - The return type for the aiPoweredVideoEditing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredVideoEditingInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  editingInstructions: z.string().describe('The instructions for editing the video.'),
});
export type AiPoweredVideoEditingInput = z.infer<typeof AiPoweredVideoEditingInputSchema>;

const AiPoweredVideoEditingOutputSchema = z.object({
  editedVideoDataUri: z
    .string()
    .describe(
      'The edited video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Assuming Submagic returns a data URI
    ),
  summary: z.string().describe('A summary of the edits made to the video.'),
});
export type AiPoweredVideoEditingOutput = z.infer<typeof AiPoweredVideoEditingOutputSchema>;

export async function aiPoweredVideoEditing(input: AiPoweredVideoEditingInput): Promise<AiPoweredVideoEditingOutput> {
  return aiPoweredVideoEditingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredVideoEditingPrompt',
  input: {schema: AiPoweredVideoEditingInputSchema},
  output: {schema: AiPoweredVideoEditingOutputSchema},
  prompt: `You are an AI video editor. You will take the user's video and editing instructions and use them to edit the video using Submagic.

Video: {{media url=videoDataUri}}
Instructions: {{{editingInstructions}}}

You must summarize the edits you made in the summary field. The edited video should be returned as a data URI.

Ensure the output is a valid JSON object.`, // Add instructions for JSON output
});

const aiPoweredVideoEditingFlow = ai.defineFlow(
  {
    name: 'aiPoweredVideoEditingFlow',
    inputSchema: AiPoweredVideoEditingInputSchema,
    outputSchema: AiPoweredVideoEditingOutputSchema,
  },
  async input => {
    // Here, we'd ideally call the Submagic API using the video and
    // instructions.  Since we're mocking the backend,
    // we'll just return a placeholder.
    const {output} = await prompt(input);

    // Replace this with actual Submagic API call when available.
    //const submagicResponse = await callSubmagicApi(input.videoDataUri, input.editingInstructions);

    return {
      editedVideoDataUri: output!.editedVideoDataUri,
      summary: output!.summary,
    };
  }
);
