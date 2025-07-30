
import type { ValidationResult, ApiError } from '../types';

interface ValidationRequest {
  idea: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export const validateIdea = async (idea: string): Promise<ValidationResult> => {
  try {
    // Input validation
    if (!idea || typeof idea !== 'string') {
      throw new Error('Idea is required and must be a string');
    }

    if (idea.trim().length < 10) {
      throw new Error('Idea must be at least 10 characters long');
    }

    if (idea.length > 1000) {
      throw new Error('Idea must be less than 1000 characters');
    }

    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idea: idea.trim() } as ValidationRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || 'An error occurred during validation';
      throw new Error(errorMessage);
    }

    // Response validation
    if (!result || typeof result.demandScore !== 'number' || 
        !Array.isArray(result.signalSummary) || 
        result.signalSummary.length < 3) {
      throw new Error('Invalid response format from server');
    }

    return result as ValidationResult;

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected network error occurred');
  }
};
