'use client';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';

/**
 * Uploads a video file to Firebase Storage and returns its public download URL.
 * @param file The video file to upload.
 * @param path The path in Storage where the file should be saved.
 */
export async function uploadVideoFile(file: File, path: string): Promise<string> {
  const { storage } = initializeFirebase();
  const storageRef = ref(storage, path);
  
  // Standard upload
  const snapshot = await uploadBytes(storageRef, file);
  
  // Return the public URL
  return getDownloadURL(snapshot.ref);
}
