interface PainPoint {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  demandScore: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  evidence: Array<{
    source: string;
    url: string;
    snippet: string;
    upvotes?: number;
    comments?: number;
  }>;
  suggestedSolution: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  technicalComplexity: 'Low' | 'Medium' | 'High';
  estimatedMarketSize: string;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
}

interface PainPointsResponse {
  painPoints: PainPoint[];
  total: number;
  hasMore: boolean;
}

class PainPointService {
  private baseUrl = '/api/pain-points';

  async getPainPoints(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<PainPointsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters?.difficulty && filters.difficulty !== 'All') {
      params.append('difficulty', filters.difficulty);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString());
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pain points: ${response.statusText}`);
    }

    return response.json();
  }

  async getPainPoint(id: string): Promise<PainPoint> {
    const response = await fetch(`${this.baseUrl}?id=${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pain point: ${response.statusText}`);
    }

    return response.json();
  }

  // Get categories for filtering
  getCategories(): string[] {
    return [
      'All', 'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 
      'Productivity', 'Marketing', 'Freelancing', 'Design', 'Development',
      'Remote Work', 'Food Service', 'Content Creation', 'Retail'
    ];
  }

  // Get difficulty levels
  getDifficultyLevels(): string[] {
    return ['All', 'Easy', 'Medium', 'Hard'];
  }
}

export const painPointService = new PainPointService();
export type { PainPoint, PainPointsResponse };