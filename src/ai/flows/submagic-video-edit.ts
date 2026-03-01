'use server';

/**
 * @fileOverview A Genkit flow that orchestrates the Submagic video editing lifecycle.
 * It handles project creation, Firestore status tracking, and the polling engine.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SubmagicClient } from '@/lib/submagic';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const SubmagicEditInputSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
  jobId: z.string(),
  videoUrl: z.string(),
  templateName: z.string().optional(),
});

export type SubmagicEditInput = z.infer<typeof SubmagicEditInputSchema>;

/**
 * This flow executes the backend logic for Submagic video editing.
 * It is intended to be called from a Server Action or another flow.
 */
export const submagicEditFlow = ai.defineFlow(
  {
    name: 'submagicEditFlow',
    inputSchema: SubmagicEditInputSchema,
  },
  async (input) => {
    const { firestore } = initializeFirebase();
    const apiKey = process.env.SUBMAGIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('SUBMAGIC_API_KEY environment variable is not defined.');
    }

    const submagic = new SubmagicClient(apiKey);
    const jobPath = `users/${input.userId}/conversations/${input.conversationId}/videoEditingJobs/${input.jobId}`;
    const jobRef = doc(firestore, jobPath);

    try {
      // 1. Start Edit: Create project in Submagic
      const project = await submagic.createProject({
        title: `Editing Job ${input.jobId}`,
        videoUrl: input.videoUrl,
        templateName: input.templateName || 'Sara',
      });

      // 2. Initial Firestore Update
      await updateDoc(jobRef, {
        status: 'processing',
        submagicProjectId: project.id,
        updatedAt: serverTimestamp(),
      });

      // 3. Smart Polling Engine
      const startTime = Date.now();
      const TIMEOUT = 10 * 60 * 1000; // 10 minute safety limit
      const POLL_INTERVAL = 20000; // 20 seconds

      while (Date.now() - startTime < TIMEOUT) {
        // Wait for next poll
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));

        const statusData = await submagic.getProject(project.id);

        if (statusData.status === 'completed') {
          // Success: Capture links and finalize
          await updateDoc(jobRef, {
            status: 'completed',
            editedVideoUrl: statusData.downloadUrl,
            previewUrl: statusData.previewUrl,
            progress: 100,
            completedAt: serverTimestamp(),
          });
          
          return {
            status: 'completed',
            downloadUrl: statusData.downloadUrl,
            previewUrl: statusData.previewUrl,
          };
        }

        if (statusData.status === 'failed') {
          // Failure: Report error
          await updateDoc(jobRef, {
            status: 'error',
            error: 'Submagic editing process failed.',
            updatedAt: serverTimestamp(),
          });
          return { status: 'failed', error: 'Submagic editing failed' };
        }

        // Processing: Update progress if available
        await updateDoc(jobRef, {
          progress: statusData.progress || 0,
          status: statusData.status, // e.g., 'transcribing', 'rendering'
          updatedAt: serverTimestamp(),
        });
      }

      // 4. Timeout reached
      await updateDoc(jobRef, {
        status: 'error',
        error: 'Editing timed out after 10 minutes.',
        updatedAt: serverTimestamp(),
      });
      
      return { status: 'error', error: 'Timeout' };

    } catch (error: any) {
      console.error('Error in submagicEditFlow:', error);
      await updateDoc(jobRef, {
        status: 'error',
        error: error.message || 'An unexpected error occurred during backend processing.',
        updatedAt: serverTimestamp(),
      });
      throw error;
    }
  }
);

export async function runSubmagicEdit(input: SubmagicEditInput) {
  return submagicEditFlow(input);
}
