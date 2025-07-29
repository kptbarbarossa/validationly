
import type { ValidationResult } from '../types';

export const validateIdea = async (idea: string): Promise<ValidationResult> => {
    try {
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idea }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Use the error message from our API endpoint
            throw new Error(result.message || 'An error occurred during validation.');
        }

        return result as ValidationResult;

    } catch (error) {
        console.error("Error calling validation API:", error);
        if (error instanceof Error) {
           // Re-throw the error to be caught by the UI component
           throw error;
        }
        throw new Error("An unknown network error occurred.");
    }
};
