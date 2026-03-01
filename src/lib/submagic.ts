'use client';

import axios from 'axios';

const SUBMAGIC_API_URL = 'https://api.submagic.co/v1';

export interface SubmagicProjectResponse {
  id: string;
  status: 'pending' | 'transcribing' | 'rendering' | 'completed' | 'failed';
  downloadUrl?: string;
  previewUrl?: string;
  progress?: number;
}

/**
 * Client for interacting with the Submagic API.
 */
export class SubmagicClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Creates a new video editing project in Submagic.
   */
  async createProject(params: {
    title: string;
    videoUrl: string;
    templateName?: string;
    language?: string;
  }): Promise<SubmagicProjectResponse> {
    const response = await axios.post(
      `${SUBMAGIC_API_URL}/projects`,
      {
        title: params.title,
        language: params.language || 'en',
        videoUrl: params.videoUrl,
        templateName: params.templateName || 'Sara',
        magicZooms: true,
        magicBrolls: true,
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Retrieves the current status and metadata of a project.
   */
  async getProject(projectId: string): Promise<SubmagicProjectResponse> {
    const response = await axios.get(`${SUBMAGIC_API_URL}/projects/${projectId}`, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });
    return response.data;
  }
}
